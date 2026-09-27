/**
 * Bidaya Tunisia - Secure Backend Script for Admin Promotion
 * 
 * Usage:
 *   node server/scripts/promoteAdmin.js <user-email>
 * 
 * This script runs strictly on the backend with privileged access.
 * Client-side role promotion is strictly disallowed by Row Level Security.
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const targetEmail = process.argv[2];

if (!targetEmail) {
  console.error('❌ Error: Please provide an email address to promote.');
  console.log('Usage: node server/scripts/promoteAdmin.js <user-email>');
  process.exit(1);
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function promoteAdmin() {
  console.log(`\n🔒 Bidaya Tunisia Privileged Admin Promotion`);
  console.log(`Target Email: ${targetEmail}`);

  if (!supabaseUrl || !serviceRoleKey || serviceRoleKey === 'your_service_role_key') {
    console.log('\n⚠️  Notice: SUPABASE_SERVICE_ROLE_KEY is not configured in .env.');
    console.log('In Demo Mode, admin access is pre-configured for: admin@bidaya.tn');
    console.log('\nFor a live Supabase production database, execute this SQL query in your Supabase SQL Editor:');
    console.log(`----------------------------------------------------------------`);
    console.log(`UPDATE public.profiles`);
    console.log(`SET role = 'admin', updated_at = NOW()`);
    console.log(`WHERE email = '${targetEmail}';`);
    console.log(`----------------------------------------------------------------\n`);
    process.exit(0);
  }

  try {
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 1. Find user in profiles
    const { data: profile, error: findError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email, role')
      .eq('email', targetEmail)
      .single();

    if (findError || !profile) {
      console.error(`❌ User not found with email: ${targetEmail}`);
      process.exit(1);
    }

    // 2. Promote to admin
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ role: 'admin', updated_at: new Date().toISOString() })
      .eq('id', profile.id)
      .select()
      .single();

    if (updateError) {
      console.error(`❌ Error updating profile: ${updateError.message}`);
      process.exit(1);
    }

    // 3. Log audit event
    await supabaseAdmin.from('audit_logs').insert({
      actor_id: profile.id,
      action: 'ADMIN_PROMOTED_VIA_CLI',
      entity_type: 'profile',
      entity_id: profile.id,
      metadata_json: { email: targetEmail, promotedAt: new Date().toISOString() }
    });

    console.log(`✅ Success: ${targetEmail} (${profile.full_name}) has been promoted to Admin!`);
    console.log(`Current Role: ${updated.role}`);
  } catch (err) {
    console.error('Fatal error during admin promotion:', err);
    process.exit(1);
  }
}

promoteAdmin();
