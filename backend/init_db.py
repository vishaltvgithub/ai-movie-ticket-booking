import os
import hashlib
import logging
from datetime import date, timedelta
from database import SessionLocal, engine, Base
import models

logger = logging.getLogger(__name__)

def hash_pw(password: str) -> str:
    salt = "cine_salt_2024"
    return hashlib.sha256((password + salt).encode("utf-8")).hexdigest()

def seed_initial_data_if_empty():
    db = SessionLocal()
    try:
        # Check if movies exist
        movie_count = db.query(models.Movie).count()
        if movie_count > 0:
            logger.info("Database already seeded.")
            return

        logger.info("Empty database detected. Seeding initial cinema dataset...")

        # 1. Users
        demo_user = models.User(
            name="Demo User",
            email="demo@example.com",
            password_hash=hash_pw("password123")
        )
        alex_user = models.User(
            name="Alex Carter",
            email="alex@upshackathon.com",
            password_hash=hash_pw("password123")
        )
        db.add_all([demo_user, alex_user])
        db.commit()

        # 2. Movies
        movies_data = [
            {
                "title": "Leo: Blood & Thunder",
                "description": "An ordinary cafe owner in Himachal becomes the target of a ruthless crime syndicate who suspect he is their long-lost prodigal enforcer.",
                "genre": "Action",
                "language": "Tamil",
                "duration": 164,
                "rating": 8.6,
                "release_date": date.today() - timedelta(days=30),
                "poster_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
                "director": "Lokesh Kanagaraj",
                "cast": "Thalapathy Vijay, Trisha Krishnan, Sanjay Dutt, Arjun Sarja",
                "status": "now_showing"
            },
            {
                "title": "Jailer: The Resurgence",
                "description": "A retired prison warden sets out on a high-stakes manhunt when his honest police officer son goes missing while investigating an idol smuggling ring.",
                "genre": "Action",
                "language": "Tamil",
                "duration": 168,
                "rating": 8.4,
                "release_date": date.today() - timedelta(days=60),
                "poster_url": "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80",
                "director": "Nelson Dilipkumar",
                "cast": "Rajinikanth, Mohanlal, Shiva Rajkumar, Ramya Krishnan",
                "status": "now_showing"
            },
            {
                "title": "Family Star: Heart & Laughter",
                "description": "A devoted middle-class architect goes to hilarious and heartwarming lengths to support his extended joint family while navigating romance with an ambitious entrepreneur.",
                "genre": "Comedy",
                "language": "Tamil",
                "duration": 138,
                "rating": 8.1,
                "release_date": date.today() - timedelta(days=45),
                "poster_url": "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80",
                "director": "Parasuram",
                "cast": "Vijay Deverakonda, Mrunal Thakur, Vasuki",
                "status": "now_showing"
            },
            {
                "title": "Oppenheimer: The Atomic Dawn",
                "description": "The gripping biographical drama chronicling J. Robert Oppenheimer and his role in the Manhattan Project, exploring the moral gravity of world-altering science.",
                "genre": "Thriller",
                "language": "English",
                "duration": 180,
                "rating": 8.9,
                "release_date": date.today() - timedelta(days=120),
                "poster_url": "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&auto=format&fit=crop&q=80",
                "director": "Christopher Nolan",
                "cast": "Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr.",
                "status": "trending"
            },
            {
                "title": "Avengers: Secret Wars",
                "description": "Earth's mightiest heroes and multiversal champions unite against a cosmic threat with power beyond imagination to restore balance across reality.",
                "genre": "Sci-Fi",
                "language": "English",
                "duration": 160,
                "rating": 8.8,
                "release_date": date.today() - timedelta(days=15),
                "poster_url": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
                "director": "Russo Brothers",
                "cast": "Robert Downey Jr., Chris Hemsworth, Benedict Cumberbatch, Tom Holland",
                "status": "trending"
            },
            {
                "title": "Stree 2: The Haunted Night",
                "description": "The town of Chanderi faces a new terrifying headless entity, forcing Vicky and his eccentric squad to team up with the mysterious ghost spirit once again.",
                "genre": "Comedy",
                "language": "Hindi",
                "duration": 147,
                "rating": 8.3,
                "release_date": date.today() - timedelta(days=20),
                "poster_url": "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop&q=80",
                "director": "Amar Kaushik",
                "cast": "Rajkummar Rao, Shraddha Kapoor, Pankaj Tripathi, Abhishek Banerjee",
                "status": "now_showing"
            },
            {
                "title": "Fighter: Skies of Glory",
                "description": "Top Indian Air Force aviators face perilous aerial dogfights and intense personal sacrifice while protecting the nation's borders.",
                "genre": "Action",
                "language": "Hindi",
                "duration": 166,
                "rating": 7.9,
                "release_date": date.today() - timedelta(days=90),
                "poster_url": "https://images.unsplash.com/photo-1519074069444-1ba4ea16e6ef?w=800&auto=format&fit=crop&q=80",
                "director": "Siddharth Anand",
                "cast": "Hrithik Roshan, Deepika Padukone, Anil Kapoor, Karan Singh Grover",
                "status": "now_showing"
            },
            {
                "title": "Interstellar Odyssey",
                "description": "A team of daring explorers travel through a newly discovered wormhole near Saturn in an attempt to ensure humanity's survival.",
                "genre": "Sci-Fi",
                "language": "English",
                "duration": 169,
                "rating": 8.7,
                "release_date": date.today() - timedelta(days=100),
                "poster_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
                "director": "Christopher Nolan",
                "cast": "Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine",
                "status": "now_showing"
            },
            {
                "title": "Midnight Whisper: The Manor",
                "description": "A young archaeologist unearths an ancient cursed relic inside an abandoned estate, unleashing a malevolent supernatural force.",
                "genre": "Horror",
                "language": "English",
                "duration": 112,
                "rating": 7.5,
                "release_date": date.today() - timedelta(days=10),
                "poster_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
                "director": "James Wan",
                "cast": "Patrick Wilson, Vera Farmiga, Sterling Jerins",
                "status": "now_showing"
            },
            {
                "title": "Love Today & Forever",
                "description": "A hilarious and charming modern romantic comedy where a couple is forced to exchange their smartphones for 24 hours before their wedding approval.",
                "genre": "Romance",
                "language": "Tamil",
                "duration": 154,
                "rating": 8.2,
                "release_date": date.today() - timedelta(days=70),
                "poster_url": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80",
                "director": "Pradeep Ranganathan",
                "cast": "Pradeep Ranganathan, Ivana, Radhika Sarathkumar, Sathyaraj",
                "status": "now_showing"
            },
            {
                "title": "Kalki 2898 AD",
                "description": "In a dystopian world ruled by darkness, a modern avatar of Vishnu descends to protect the unborn savior of humanity.",
                "genre": "Sci-Fi",
                "language": "Hindi",
                "duration": 181,
                "rating": 8.5,
                "release_date": date.today() - timedelta(days=50),
                "poster_url": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
                "director": "Nag Ashwin",
                "cast": "Prabhas, Amitabh Bachchan, Kamal Haasan, Deepika Padukone",
                "status": "trending"
            },
            {
                "title": "Dune: Awakening",
                "description": "Paul Atreides unites with the Fremen on Arrakis to wage war against the conspirators who destroyed his family, fulfilling his mystical destiny.",
                "genre": "Sci-Fi",
                "language": "English",
                "duration": 166,
                "rating": 8.7,
                "release_date": date.today() + timedelta(days=30),
                "poster_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
                "director": "Denis Villeneuve",
                "cast": "Timothée Chalamet, Zendaya, Rebecca Ferguson, Javier Bardem",
                "status": "upcoming"
            }
        ]

        movie_objs = []
        for m in movies_data:
            obj = models.Movie(**m)
            db.add(obj)
            movie_objs.append(obj)
        db.commit()

        # 3. Theatres
        theatres_data = [
            {"name": "PVR Cinemas - Grand Mall", "location": "Velachery Main Road, Chennai"},
            {"name": "INOX Multiplex - City Centre", "location": "Dr. Radhakrishnan Salai, Mylapore, Chennai"},
            {"name": "AGS Cinemas - OMR Prime", "location": "Navalur, Old Mahabalipuram Rd, Chennai"},
            {"name": "SPI Cinemas - Sathyam Grand", "location": "Royapettah High Rd, Royapettah, Chennai"},
            {"name": "Cinepolis - Nexus Mall", "location": "Vadapalani, Arcot Road, Chennai"},
        ]

        theatre_objs = []
        for t in theatres_data:
            obj = models.Theatre(**t)
            db.add(obj)
            theatre_objs.append(obj)
        db.commit()

        # 4. Screens (2 screens per theatre)
        screen_names = [
            ("Screen 1 (IMAX 4K)", "Screen 2 (Dolby Atmos)"),
            ("Screen 1 (Laser 3D)", "Screen 2 (Insignia VIP)"),
            ("Screen 1 (4K RGB Laser)", "Screen 2 (Acoustic Luxe)"),
            ("Screen 1 (Santham Atmos)", "Screen 2 (Studio 5)"),
            ("Screen 1 (Macro XE)", "Screen 2 (Junior Lounge)"),
        ]

        screen_objs = []
        for i, t in enumerate(theatre_objs):
            s1 = models.Screen(theatre_id=t.id, screen_name=screen_names[i][0])
            s2 = models.Screen(theatre_id=t.id, screen_name=screen_names[i][1])
            db.add_all([s1, s2])
            screen_objs.extend([s1, s2])
        db.commit()

        # 5. Seats for Screens (Rows A to E, 1 to 8)
        seat_objs = []
        for s in screen_objs:
            # Row A (Regular ₹150)
            for c in range(1, 9):
                seat_objs.append(models.Seat(screen_id=s.id, seat_number=f"A{c}", seat_type="Regular", price=150.00))
            # Row B (Regular ₹150)
            for c in range(1, 9):
                seat_objs.append(models.Seat(screen_id=s.id, seat_number=f"B{c}", seat_type="Regular", price=150.00))
            # Row C (Premium ₹220)
            for c in range(1, 9):
                seat_objs.append(models.Seat(screen_id=s.id, seat_number=f"C{c}", seat_type="Premium", price=220.00))
            # Row D (Premium ₹220)
            for c in range(1, 9):
                seat_objs.append(models.Seat(screen_id=s.id, seat_number=f"D{c}", seat_type="Premium", price=220.00))
            # Row E (VIP ₹300)
            for c in range(1, 9):
                seat_objs.append(models.Seat(screen_id=s.id, seat_number=f"E{c}", seat_type="VIP", price=300.00))
        
        db.add_all(seat_objs)
        db.commit()

        # 6. Shows
        today = date.today()
        tomorrow = today + timedelta(days=1)
        shows_to_create = [
            # Leo at PVR (Theatre 1, Screen 1)
            (1, 1, 1, today, "10:30 AM"),
            (1, 1, 1, today, "01:45 PM"),
            (1, 1, 1, today, "04:30 PM"),
            (1, 1, 1, today, "07:15 PM"), # Demo target show!
            (1, 1, 1, today, "10:30 PM"),
            # Leo at INOX (Theatre 2, Screen 3)
            (1, 2, 3, today, "11:00 AM"),
            (1, 2, 3, today, "03:15 PM"),
            (1, 2, 3, today, "07:15 PM"),
            (1, 2, 3, today, "10:45 PM"),
            # Leo at SPI Sathyam (Theatre 4, Screen 7)
            (1, 4, 7, today, "10:30 AM"),
            (1, 4, 7, today, "02:00 PM"),
            (1, 4, 7, today, "07:15 PM"),
            # Jailer
            (2, 1, 2, today, "11:15 AM"),
            (2, 1, 2, today, "03:00 PM"),
            (2, 1, 2, today, "06:45 PM"),
            (2, 3, 5, today, "01:30 PM"),
            (2, 3, 5, today, "07:00 PM"),
            # Family Star
            (3, 3, 6, today, "10:30 AM"),
            (3, 3, 6, today, "02:15 PM"),
            (3, 3, 6, today, "06:30 PM"),
            (3, 4, 8, today, "01:15 PM"),
            (3, 4, 8, today, "07:30 PM"),
            # Oppenheimer
            (4, 1, 1, tomorrow, "02:30 PM"),
            (4, 1, 1, tomorrow, "07:30 PM"),
            (4, 2, 4, today, "04:00 PM"),
            (4, 2, 4, today, "08:30 PM"),
            # Avengers
            (5, 5, 9, today, "11:30 AM"),
            (5, 5, 9, today, "03:45 PM"),
            (5, 5, 9, today, "07:15 PM"),
            (5, 5, 9, today, "10:45 PM"),
            # Stree 2
            (6, 5, 10, today, "01:00 PM"),
            (6, 5, 10, today, "06:15 PM"),
            (6, 2, 3, today, "01:15 PM"),
            # Fighter
            (7, 3, 5, today, "10:00 AM"),
            (7, 3, 5, today, "04:15 PM"),
            (7, 3, 5, today, "09:45 PM"),
            # Interstellar
            (8, 4, 7, today, "03:45 PM"),
            (8, 4, 7, today, "09:30 PM"),
            # Midnight Whisper
            (9, 2, 4, today, "10:45 PM"),
            # Love Today
            (10, 4, 8, today, "10:00 AM"),
            (10, 4, 8, today, "04:45 PM"),
            (10, 4, 8, today, "10:15 PM"),
            # Kalki
            (11, 5, 9, today, "01:00 PM"),
            (11, 5, 9, today, "08:00 PM"),
        ]

        show_objs = []
        for m_id, t_id, s_id, s_date, s_time in shows_to_create:
            show_objs.append(models.Show(
                movie_id=m_id,
                theatre_id=t_id,
                screen_id=s_id,
                show_date=s_date,
                show_time=s_time
            ))
        db.add_all(show_objs)
        db.commit()

        # 7. Seed Pre-booked Seats on Show 4 (Leo @ PVR 07:15 PM Screen 1)
        # Pre-book A1, A2, D4, D5 for Screen 1 so C4, C5 remain clear for AI recommendation demo!
        target_show = show_objs[3] # Show 4
        s1_seats = db.query(models.Seat).filter(models.Seat.screen_id == 1).all()
        seat_map = {s.seat_number: s.id for s in s1_seats}

        sample_booking1 = models.Booking(
            booking_code="UPS-MOV-100201",
            user_id=alex_user.id,
            show_id=target_show.id,
            total_amount=345.00,
            booking_status="CONFIRMED"
        )
        sample_booking2 = models.Booking(
            booking_code="UPS-MOV-100202",
            user_id=alex_user.id,
            show_id=target_show.id,
            total_amount=506.00,
            booking_status="CONFIRMED"
        )
        db.add_all([sample_booking1, sample_booking2])
        db.commit()

        b_seats = [
            models.BookingSeat(booking_id=sample_booking1.id, seat_id=seat_map.get("A1")),
            models.BookingSeat(booking_id=sample_booking1.id, seat_id=seat_map.get("A2")),
            models.BookingSeat(booking_id=sample_booking2.id, seat_id=seat_map.get("D4")),
            models.BookingSeat(booking_id=sample_booking2.id, seat_id=seat_map.get("D5")),
        ]
        db.add_all([bs for bs in b_seats if bs.seat_id is not None])
        db.commit()

        logger.info("Cinema dataset seeded successfully.")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    seed_initial_data_if_empty()
