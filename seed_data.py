import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'workshop_portal.settings')
django.setup()

from django.utils import timezone
from django.contrib.auth.models import User, Group
from django.core.files import File
from workshop_app.models import Profile, Workshop, WorkshopType, Comment, AttachmentFile

def seed():
    # 1. Create Groups
    instructor_group, _ = Group.objects.get_or_create(name='instructor')
    coordinator_group, _ = Group.objects.get_or_create(name='coordinator')

    # 2. Workshop Types
    types_data = [
        {
            'name': 'Python for Scientists',
            'description': 'A comprehensive workshop on using Python for scientific computing, including NumPy, SciPy, and Matplotlib.',
            'duration': 3,
            'terms': 'Standard FOSSEE terms apply. Participants must bring their own laptops.'
        },
        {
            'name': 'Arduino Robotics',
            'description': 'Hands-on training on building and programming robots using Arduino microcontrollers.',
            'duration': 2,
            'terms': 'Hardware kits will be provided during the workshop.'
        },
        {
            'name': 'Django Web Development',
            'description': 'Learn how to build robust web applications using the Django framework.',
            'duration': 5,
            'terms': 'Basic knowledge of Python is required.'
        }
    ]

    types = []
    for td in types_data:
        wt, created = WorkshopType.objects.get_or_create(
            name=td['name'],
            defaults={
                'description': td['description'],
                'duration': td['duration'],
                'terms_and_conditions': td['terms']
            }
        )
        types.append(wt)
        print(f"Workshop Type: {wt.name} ({'Created' if created else 'Existing'})")

    # 3. Create sample attachment for one type
    sample_file_path = 'media/sample_docs/schedule.txt'
    if os.path.exists(sample_file_path):
        with open(sample_file_path, 'rb') as f:
            af, created = AttachmentFile.objects.get_or_create(
                workshop_type=types[0],
                defaults={'attachments': File(f, name='python_schedule.txt')}
            )
            print(f"Attachment created for {types[0].name}")

    # 4. Users (Instructors and Coordinators)
    # Already have admin as coordinator (set up in previous turn)
    
    # Create an Instructor
    instr_user, created = User.objects.get_or_create(
        username='instructor1',
        defaults={
            'email': 'instructor1@example.com',
            'first_name': 'Sarah',
            'last_name': 'Jones'
        }
    )
    if created:
        instr_user.set_password('pass123')
        instr_user.save()
        instr_user.groups.add(instructor_group)
    
    instr_profile, _ = Profile.objects.update_or_create(
        user=instr_user,
        defaults={
            'institute': 'IIT Bombay',
            'department': 'electrical engineering',
            'phone_number': '9876543210',
            'position': 'instructor',
            'is_email_verified': True,
            'state': 'IN-MH'
        }
    )
    print(f"Instructor Sarah Jones created")

    # Create another Coordinator
    coord_user, created = User.objects.get_or_create(
        username='coord1',
        defaults={
            'email': 'coord1@example.com',
            'first_name': 'Raj',
            'last_name': 'Kumar'
        }
    )
    if created:
        coord_user.set_password('pass123')
        coord_user.save()
        coord_user.groups.add(coordinator_group)
    
    coord_profile, _ = Profile.objects.update_or_create(
        user=coord_user,
        defaults={
            'institute': 'Delhi Technological University',
            'department': 'computer engineering',
            'phone_number': '8888888888',
            'position': 'coordinator',
            'is_email_verified': True,
            'state': 'IN-DL'
        }
    )
    print(f"Coordinator Raj Kumar created")

    # 5. Workshops
    admin_user = User.objects.get(username='admin')
    
    # Admin (Coordinator) Workshops
    w1, _ = Workshop.objects.get_or_create(
        coordinator=admin_user,
        workshop_type=types[0],
        date=timezone.now().date() + timezone.timedelta(days=10),
        defaults={'status': 1, 'instructor': instr_user, 'tnc_accepted': True}
    )
    
    w2, _ = Workshop.objects.get_or_create(
        coordinator=admin_user,
        workshop_type=types[1],
        date=timezone.now().date() + timezone.timedelta(days=20),
        defaults={'status': 0, 'tnc_accepted': True}
    )

    # Raj (Coordinator) Workshops
    w3, _ = Workshop.objects.get_or_create(
        coordinator=coord_user,
        workshop_type=types[2],
        date=timezone.now().date() + timezone.timedelta(days=5),
        defaults={'status': 1, 'instructor': instr_user, 'tnc_accepted': True}
    )

    print(f"Sample workshops created")

    # 6. Comments
    Comment.objects.get_or_create(
        author=admin_user,
        workshop=w1,
        comment="Looking forward to the Python session!",
        public=True
    )
    Comment.objects.get_or_create(
        author=instr_user,
        workshop=w1,
        comment="I will be sending the pre-requisite material soon.",
        public=True
    )
    print("Sample comments created")

if __name__ == "__main__":
    seed()
