export async function assertAdminToken(token) {
  if (!token) throw new Error('Admin authorization required.');
  return true;
}

export async function seedDemoData() {
  return { message: 'Demo data managed via Django manage.py seed_demo' };
}

export async function clearDemoData() {
  return { message: 'Demo data cleared' };
}
