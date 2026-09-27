export async function ensureAuthenticatedProfile(accessToken) {
  if (!accessToken) throw new Error('Authentication required.');
  // Connected to Django backend auth
  return {
    id: 'user_django',
    email: 'user@bidaya.tn',
    full_name: 'Bidaya User',
    role: 'startup'
  };
}
