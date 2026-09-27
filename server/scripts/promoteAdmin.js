/**
 * Promote an admin user in Django
 * Usage: python backend/manage.py shell -c "from accounts.models import User; u = User.objects.get(email='admin@demo.local'); u.role='admin'; u.is_staff=True; u.is_superuser=True; u.save()"
 */
console.log("To promote a user to admin in Django, run:");
console.log("python backend/manage.py shell -c \"from accounts.models import User; u = User.objects.get(email='admin@demo.local'); u.role='admin'; u.is_staff=True; u.is_superuser=True; u.save()\"");
