from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from startups.models import Startup, StartupProgress
from investors.models import InvestorProfile

User = get_user_model()

DEFAULT_PASSWORD = "DemoPassword123!"

class Command(BaseCommand):
    help = 'Seeds initial demo accounts, startups, and investor profiles'

    def handle(self, *args, **options):
        self.stdout.write("Seeding demo data...")

        # 1. Admin Users
        admins = [
            {'email': 'admin@demo.local', 'first_name': 'Admin', 'last_name': 'Demo'},
            {'email': 'admin@bidaya.tn', 'first_name': 'Platform', 'last_name': 'Administrator'},
        ]
        for adm in admins:
            user, created = User.objects.get_or_create(
                email=adm['email'],
                defaults={
                    'first_name': adm['first_name'],
                    'last_name': adm['last_name'],
                    'role': 'admin',
                    'is_staff': True,
                    'is_superuser': True
                }
            )
            user.set_password(DEFAULT_PASSWORD)
            user.role = 'admin'
            user.is_staff = True
            user.is_superuser = True
            user.save()
            self.stdout.write(f"[OK] Admin ready: {user.email}")

        # 2. Startup Users & Profiles
        startups_data = [
            {
                'email': 'startup@demo.local',
                'first_name': 'Founder',
                'last_name': 'Demo',
                'startup_name': 'AgriSmart Tunisia',
                'sector': 'AgriTech',
                'stage': 'Seed',
                'location': 'Sfax',
                'funding_needed': 450000,
                'pitch': 'AI-driven irrigation and precision agriculture telemetry for olive and dates growers in Tunisia.',
                'problem': 'Water scarcity and climate volatility reduce crop yield by 35% in southern and central Tunisia.',
                'solution': 'IoT soil probes connected to edge analytics to optimize irrigation cycles with 40% water savings.',
                'business_model': 'Hardware sensor sale + annual SaaS telemetry subscription in TND.',
                'readiness_score': 88,
                'publication_status': 'approved',
                'investor_visible': True,
            },
            {
                'email': 'founder@agrismart.tn',
                'first_name': 'Yassine',
                'last_name': 'Karray',
                'startup_name': 'AgriSmart Tunisia',
                'sector': 'AgriTech',
                'stage': 'Seed',
                'location': 'Sfax',
                'funding_needed': 450000,
                'pitch': 'Precision agriculture sensors and analytics for Mediterranean farmers.',
                'problem': 'Water stress and inefficient fertilization.',
                'solution': 'Plug-and-play telemetry sensors and automated drip control.',
                'business_model': 'B2B subscription in TND.',
                'readiness_score': 92,
                'publication_status': 'approved',
                'investor_visible': True,
            },
            {
                'email': 'sarah@healthtech.tn',
                'first_name': 'Sarah',
                'last_name': 'Mansour',
                'startup_name': 'CurisTech Med',
                'sector': 'HealthTech',
                'stage': 'Early Revenue',
                'location': 'Tunis',
                'funding_needed': 300000,
                'pitch': 'Tele-consultation and electronic prescription platform compliant with Tunisian health regulations.',
                'problem': 'Medical desertification in interior governorates.',
                'solution': 'Secure web and mobile clinical scheduling and video consultation.',
                'business_model': 'Transaction fee per consultation.',
                'readiness_score': 85,
                'publication_status': 'approved',
                'investor_visible': True,
            },
            {
                'email': 'karim@payflouss.tn',
                'first_name': 'Karim',
                'last_name': 'Trabelsi',
                'startup_name': 'Floussi Pay',
                'sector': 'FinTech',
                'stage': 'MVP',
                'location': 'Ariana',
                'funding_needed': 600000,
                'pitch': 'Unified QR payment gateway for small businesses and merchants in Tunisia.',
                'problem': 'High cash dependency and fragmented card terminals.',
                'solution': 'Zero-hardware QR payment processing with instant merchant settlement in TND.',
                'business_model': '1.2% merchant discount rate.',
                'readiness_score': 79,
                'publication_status': 'approved',
                'investor_visible': True,
            }
        ]

        for s_data in startups_data:
            user, _ = User.objects.get_or_create(
                email=s_data['email'],
                defaults={'first_name': s_data['first_name'], 'last_name': s_data['last_name'], 'role': 'startup'}
            )
            user.set_password(DEFAULT_PASSWORD)
            user.role = 'startup'
            user.save()

            startup, _ = Startup.objects.get_or_create(
                owner=user,
                defaults={
                    'name': s_data['startup_name'],
                    'sector': s_data['sector'],
                    'stage': s_data['stage'],
                    'location': s_data['location'],
                    'funding_needed': s_data['funding_needed'],
                    'pitch': s_data['pitch'],
                    'problem': s_data['problem'],
                    'solution': s_data['solution'],
                    'business_model': s_data['business_model'],
                    'readiness_score': s_data['readiness_score'],
                    'publication_status': s_data['publication_status'],
                    'investor_visible': s_data['investor_visible'],
                }
            )
            self.stdout.write(f"[OK] Startup ready: {user.email} -> {startup.name}")

        # 3. Investor Users & Profiles
        investors_data = [
            {
                'email': 'investor@demo.local',
                'first_name': 'Investor',
                'last_name': 'Demo',
                'company_name': 'Carthage Venture Syndicate',
                'investor_type': 'Venture Capital',
                'sectors': ['AgriTech', 'FinTech', 'HealthTech', 'CleanTech'],
                'investment_stage': ['Seed', 'Early Revenue'],
                'ticket_min': 100000,
                'ticket_max': 600000,
                'country': 'Tunisia',
                'preferred_governorates': ['Tunis', 'Sfax', 'Sousse', 'Ariana'],
                'description': 'Early-stage venture fund backing high-impact Tunisian technology founders with smart capital.',
                'verification_status': 'approved'
            },
            {
                'email': 'investor@carthageangels.tn',
                'first_name': 'Sami',
                'last_name': 'Ben Amor',
                'company_name': 'Carthage Angels Network',
                'investor_type': 'Angel Investor',
                'sectors': ['AgriTech', 'CleanTech', 'EdTech'],
                'investment_stage': ['Pre-Seed', 'Seed'],
                'ticket_min': 50000,
                'ticket_max': 300000,
                'country': 'Tunisia',
                'preferred_governorates': ['Tunis', 'Sfax', 'Monastir'],
                'description': 'Network of 30+ experienced Tunisian angel investors and business leaders.',
                'verification_status': 'approved'
            }
        ]

        for inv_data in investors_data:
            user, _ = User.objects.get_or_create(
                email=inv_data['email'],
                defaults={'first_name': inv_data['first_name'], 'last_name': inv_data['last_name'], 'role': 'investor'}
            )
            user.set_password(DEFAULT_PASSWORD)
            user.role = 'investor'
            user.save()

            inv, _ = InvestorProfile.objects.get_or_create(
                user=user,
                defaults={
                    'company_name': inv_data['company_name'],
                    'investor_type': inv_data['investor_type'],
                    'sectors': inv_data['sectors'],
                    'investment_stage': inv_data['investment_stage'],
                    'ticket_min': inv_data['ticket_min'],
                    'ticket_max': inv_data['ticket_max'],
                    'country': inv_data['country'],
                    'preferred_governorates': inv_data['preferred_governorates'],
                    'description': inv_data['description'],
                    'verification_status': inv_data['verification_status']
                }
            )
            self.stdout.write(f"[OK] Investor ready: {user.email} -> {inv.company_name}")

        self.stdout.write(self.style.SUCCESS("All demo accounts and profiles successfully seeded!"))
