-- ============================================================
-- Bidaya Tunisia: Startup Publication Status & Privacy RLS
-- ============================================================
-- 
-- This migration adds the publication_status system to the 
-- startups table and enforces strict Row Level Security (RLS)
-- to ensure startups are only visible according to their 
-- publication status.
--
-- Privacy Rules:
-- - draft, building, investor_ready: founder only
-- - under_review: founder + admin
-- - approved: founder + admin + verified investors
-- - changes_requested: founder + admin
-- - rejected: founder + admin
-- - suspended: admin only (founder limited)
--

-- ============================================================
-- 1. Add publication_status column to startups table
-- ============================================================

ALTER TABLE startups 
  ADD COLUMN IF NOT EXISTS publication_status TEXT 
    DEFAULT 'draft' 
    CHECK (publication_status IN (
      'draft', 
      'building', 
      'investor_ready', 
      'under_review', 
      'approved', 
      'changes_requested', 
      'rejected', 
      'suspended'
    ));

ALTER TABLE startups 
  ADD COLUMN IF NOT EXISTS publication_requested_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE startups 
  ADD COLUMN IF NOT EXISTS publication_approved_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE startups 
  ADD COLUMN IF NOT EXISTS admin_review_notes TEXT DEFAULT '';

-- Startup Act fields (separate from publication)
ALTER TABLE startups 
  ADD COLUMN IF NOT EXISTS startup_act_status TEXT 
    DEFAULT 'not_started' 
    CHECK (startup_act_status IN (
      'not_started', 
      'preparing', 
      'submitted', 
      'label_obtained'
    ));

ALTER TABLE startups 
  ADD COLUMN IF NOT EXISTS startup_act_evidence TEXT DEFAULT NULL;

ALTER TABLE startups 
  ADD COLUMN IF NOT EXISTS startup_act_admin_verified BOOLEAN DEFAULT FALSE;

-- Sensitive content access control
ALTER TABLE startups
  ADD COLUMN IF NOT EXISTS sensitive_access_granted JSONB DEFAULT '{}'::JSONB;

-- ============================================================
-- 2. Create an index on publication_status for query performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_startups_publication_status 
  ON startups (publication_status);

-- ============================================================
-- 3. Enable RLS on startups table
-- ============================================================

ALTER TABLE startups ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. Drop existing policies (if any) to avoid conflicts
-- ============================================================

DROP POLICY IF EXISTS "Founders can view own startup" ON startups;
DROP POLICY IF EXISTS "Founders can update own startup" ON startups;
DROP POLICY IF EXISTS "Founders can insert own startup" ON startups;
DROP POLICY IF EXISTS "Admins can view all startups" ON startups;
DROP POLICY IF EXISTS "Admins can update all startups" ON startups;
DROP POLICY IF EXISTS "Verified investors can view approved startups" ON startups;
DROP POLICY IF EXISTS "No public access to startups" ON startups;

-- ============================================================
-- 5. Founder policies
-- ============================================================

-- Founders can always see their own startup regardless of status
CREATE POLICY "Founders can view own startup" ON startups
  FOR SELECT
  USING (
    auth.uid() = founder_id
  );

-- Founders can update their own startup 
-- (except when suspended — status change requires admin)
CREATE POLICY "Founders can update own startup" ON startups
  FOR UPDATE
  USING (
    auth.uid() = founder_id 
    AND publication_status != 'suspended'
  )
  WITH CHECK (
    auth.uid() = founder_id 
    AND publication_status != 'suspended'
    -- Founders cannot set their own startup to 'approved' or 'suspended'
    AND publication_status NOT IN ('approved', 'suspended')
  );

-- Founders can create new startups (always defaults to 'draft')
CREATE POLICY "Founders can insert own startup" ON startups
  FOR INSERT
  WITH CHECK (
    auth.uid() = founder_id
    AND publication_status = 'draft'
  );

-- ============================================================
-- 6. Admin policies
-- ============================================================

-- Admins can view all startups regardless of status
CREATE POLICY "Admins can view all startups" ON startups
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Admins can update all startups (approve, reject, suspend, etc.)
CREATE POLICY "Admins can update all startups" ON startups
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ============================================================
-- 7. Investor policies (STRICTLY approved only + verified)
-- ============================================================

-- Verified investors can ONLY view startups with status = 'approved'
CREATE POLICY "Verified investors can view approved startups" ON startups
  FOR SELECT
  USING (
    publication_status = 'approved'
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'investor'
      AND profiles.is_verified = true
    )
  );

-- ============================================================
-- 8. Deny all other access
-- ============================================================

-- No policy for anonymous or non-matching roles means denial by default.
-- RLS denies access when no policy matches.

-- ============================================================
-- 9. Sensitive content protection
-- ============================================================
-- Even for approved startups, sensitive fields are stored separately.
-- The sensitive_access_granted JSONB column maps investor IDs to 
-- allowed field arrays:
-- { "investor_uuid": ["financial_projections", "cap_table"] }
--
-- Application logic checks this before returning sensitive data.
-- Never expose legal_documents, financial_projections, cap_table, 
-- or data_room content without explicit founder permission.

-- ============================================================
-- 10. Helper function for publication request
-- ============================================================

CREATE OR REPLACE FUNCTION request_investor_visibility(startup_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE startups 
  SET 
    publication_status = 'under_review',
    publication_requested_at = NOW()
  WHERE 
    id = startup_id 
    AND founder_id = auth.uid()
    AND publication_status IN ('draft', 'building', 'investor_ready', 'changes_requested');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 11. Helper function for admin approval
-- ============================================================

CREATE OR REPLACE FUNCTION admin_review_startup(
  p_startup_id UUID,
  p_decision TEXT,  -- 'approved', 'changes_requested', 'rejected', 'suspended'
  p_notes TEXT DEFAULT ''
)
RETURNS void AS $$
BEGIN
  -- Verify the caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: admin role required';
  END IF;

  -- Validate the decision
  IF p_decision NOT IN ('approved', 'changes_requested', 'rejected', 'suspended') THEN
    RAISE EXCEPTION 'Invalid decision: must be approved, changes_requested, rejected, or suspended';
  END IF;

  UPDATE startups 
  SET 
    publication_status = p_decision,
    admin_review_notes = p_notes,
    publication_approved_at = CASE WHEN p_decision = 'approved' THEN NOW() ELSE NULL END
  WHERE id = p_startup_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
