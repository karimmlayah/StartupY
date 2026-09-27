-- ====================================================================
-- BIDAYA TUNISIA - POSTGRESQL & ROW LEVEL SECURITY SCHEMA
-- Migration: 20260927_init_schema.sql
-- ====================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked to auth.users)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'startup', 'investor') OR role IS NULL),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to automatically create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    NULL, -- Role must be chosen on /choose-role page
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- --------------------------------------------------------------------
-- 2. STARTUPS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.startups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  pitch TEXT,
  sector TEXT NOT NULL,
  stage TEXT NOT NULL,
  funding_needed_tnd NUMERIC,
  governorate TEXT NOT NULL,
  legal_status TEXT, -- SARL, SUARL, SA, In Creation
  funding_type TEXT, -- Equity, SAFE, Convertible Note, Grant
  registration_status TEXT DEFAULT 'Pending' CHECK (registration_status IN ('Yes', 'No', 'Pending')),
  readiness_score INTEGER DEFAULT 0 CHECK (readiness_score BETWEEN 0 AND 100),
  publication_status TEXT DEFAULT 'draft' CHECK (publication_status IN ('draft', 'under_review', 'approved', 'rejected', 'suspended')),
  reviewer_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- --------------------------------------------------------------------
-- 3. INVESTORS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.investors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_name TEXT NOT NULL,
  investor_type TEXT NOT NULL, -- Angel Investor, Venture Capital, Corporate, Diaspora, etc.
  sectors TEXT[] DEFAULT '{}',
  ticket_min_tnd NUMERIC DEFAULT 50000,
  ticket_max_tnd NUMERIC DEFAULT 500000,
  preferred_stages TEXT[] DEFAULT '{}',
  preferred_governorates TEXT[] DEFAULT '{}',
  investment_types TEXT[] DEFAULT '{}',
  verification_status TEXT DEFAULT 'draft' CHECK (verification_status IN ('draft', 'submitted', 'under_review', 'documents_required', 'approved', 'rejected', 'suspended')),
  verification_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- --------------------------------------------------------------------
-- 4. INVESTOR DOCUMENTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.investor_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID NOT NULL REFERENCES public.investors(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- Identity (CIN/Passport), Commercial Register (RNE), Investment Mandate
  file_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewer_note TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- --------------------------------------------------------------------
-- 5. STARTUP PROGRESS (11 Roadmap Steps)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.startup_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  roadmap_step INTEGER NOT NULL CHECK (roadmap_step BETWEEN 1 AND 11),
  status TEXT DEFAULT 'locked' CHECK (status IN ('locked', 'in_progress', 'completed')),
  completion_percent INTEGER DEFAULT 0 CHECK (completion_percent BETWEEN 0 AND 100),
  completed_at TIMESTAMPTZ,
  evidence_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(startup_id, roadmap_step)
);

-- --------------------------------------------------------------------
-- 6. MEETING REQUESTS (Bidaya Video Meetings)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.meeting_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  investor_id UUID NOT NULL REFERENCES public.investors(id) ON DELETE CASCADE,
  requested_by TEXT NOT NULL CHECK (requested_by IN ('startup', 'investor')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 45 CHECK (duration_minutes IN (30, 45, 60)),
  agenda TEXT,
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested', 'accepted', 'declined', 'completed', 'cancelled')),
  room_id TEXT NOT NULL,
  outcome_status TEXT CHECK (outcome_status IN ('Interested', 'Follow-up Needed', 'Declined', 'No Show') OR outcome_status IS NULL),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- --------------------------------------------------------------------
-- 7. INTERESTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  investor_id UUID NOT NULL REFERENCES public.investors(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'interested' CHECK (status IN ('interested', 'contacted', 'meeting_scheduled', 'due_diligence', 'passed')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(startup_id, investor_id)
);

-- --------------------------------------------------------------------
-- 8. AUDIT LOGS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --------------------------------------------------------------------
-- PROFILES POLICIES
-- --------------------------------------------------------------------
-- Anyone authenticated can view their own profile; admins can view all
CREATE POLICY "Users can read own profile or admin can read all"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- Users can update their own profile, but CANNOT change role once set (unless admin)
CREATE POLICY "Users can update own profile without changing role"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (
    public.is_admin() OR 
    (auth.uid() = id AND (public.profiles.role IS NULL OR public.profiles.role = role))
  );

-- --------------------------------------------------------------------
-- STARTUPS POLICIES
-- --------------------------------------------------------------------
-- Founders can see and edit their own startup; 
-- Approved investors can see approved startups;
-- Admins can see and edit all startups.
CREATE POLICY "Founders read own startup; investors read approved; admin reads all"
  ON public.startups FOR SELECT
  USING (
    auth.uid() = owner_id OR
    public.is_admin() OR
    (publication_status = 'approved' AND EXISTS (
      SELECT 1 FROM public.investors
      WHERE owner_id = auth.uid() AND verification_status = 'approved'
    ))
  );

CREATE POLICY "Founders can insert own startup"
  ON public.startups FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Founders can update own startup draft/review; admin can update all"
  ON public.startups FOR UPDATE
  USING (auth.uid() = owner_id OR public.is_admin())
  WITH CHECK (auth.uid() = owner_id OR public.is_admin());

-- --------------------------------------------------------------------
-- INVESTORS POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "Investors read own profile; approved startups read approved investors; admin reads all"
  ON public.investors FOR SELECT
  USING (
    auth.uid() = owner_id OR
    public.is_admin() OR
    (verification_status = 'approved' AND EXISTS (
      SELECT 1 FROM public.startups
      WHERE owner_id = auth.uid()
    ))
  );

CREATE POLICY "Investors can insert own record"
  ON public.investors FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Investors can update own draft; admin can update all"
  ON public.investors FOR UPDATE
  USING (auth.uid() = owner_id OR public.is_admin())
  WITH CHECK (auth.uid() = owner_id OR public.is_admin());

-- --------------------------------------------------------------------
-- INVESTOR DOCUMENTS POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "Investor reads own documents; admin reads all"
  ON public.investor_documents FOR SELECT
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.investors
      WHERE id = investor_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Investor inserts own documents"
  ON public.investor_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.investors
      WHERE id = investor_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Admin can update investor documents"
  ON public.investor_documents FOR UPDATE
  USING (public.is_admin());

-- --------------------------------------------------------------------
-- STARTUP PROGRESS POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "Founders read and update own progress; admin reads all"
  ON public.startup_progress FOR SELECT
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.startups
      WHERE id = startup_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Founders can insert/update own progress"
  ON public.startup_progress FOR ALL
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.startups
      WHERE id = startup_id AND owner_id = auth.uid()
    )
  );

-- --------------------------------------------------------------------
-- MEETING REQUESTS POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "Participants and admins can view meetings"
  ON public.meeting_requests FOR SELECT
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.startups
      WHERE id = startup_id AND owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.investors
      WHERE id = investor_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Participants can manage meeting requests"
  ON public.meeting_requests FOR ALL
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.startups
      WHERE id = startup_id AND owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.investors
      WHERE id = investor_id AND owner_id = auth.uid()
    )
  );

-- --------------------------------------------------------------------
-- INTERESTS POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "Participants can view interests"
  ON public.interests FOR SELECT
  USING (
    public.is_admin() OR
    EXISTS (SELECT 1 FROM public.startups WHERE id = startup_id AND owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.investors WHERE id = investor_id AND owner_id = auth.uid())
  );

CREATE POLICY "Investors or founders can express interest"
  ON public.interests FOR ALL
  USING (
    public.is_admin() OR
    EXISTS (SELECT 1 FROM public.startups WHERE id = startup_id AND owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.investors WHERE id = investor_id AND owner_id = auth.uid())
  );

-- --------------------------------------------------------------------
-- AUDIT LOGS POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "Only admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin());

CREATE POLICY "System and users can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (true);
