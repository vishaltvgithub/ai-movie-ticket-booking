-- AI Movie Ticket Booking Assistant
-- Seed Data for MySQL (movie_booking_db)

USE movie_booking_db;

-- 1. Insert Users (Password: password123 with bcrypt hash)
-- bcrypt hash for 'password123': $2b$12$eX.7XhI0U2iJ1M8109FhEO7cQ5Xj6ZkI1f94K9t7p8aX1gH0/Fz82
INSERT INTO users (id, name, email, password_hash) VALUES
(1, 'Demo User', 'demo@example.com', '$2b$12$eX.7XhI0U2iJ1M8109FhEO7cQ5Xj6ZkI1f94K9t7p8aX1gH0/Fz82'),
(2, 'Alex Carter', 'alex@upshackathon.com', '$2b$12$eX.7XhI0U2iJ1M8109FhEO7cQ5Xj6ZkI1f94K9t7p8aX1gH0/Fz82');

-- 2. Insert Movies (Diverse genres: Action, Comedy, Romance, Thriller, Sci-Fi, Family, Horror | Languages: Tamil, Hindi, English)
INSERT INTO movies (id, title, description, genre, language, duration, rating, release_date, poster_url, director, cast, status) VALUES
(1, 'Leo: Blood & Thunder', 'An ordinary cafe owner in Himachal becomes the target of a ruthless crime syndicate who suspect he is their long-lost prodigal enforcer.', 'Action', 'Tamil', 164, 8.6, '2024-10-19', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80', 'Lokesh Kanagaraj', 'Thalapathy Vijay, Trisha Krishnan, Sanjay Dutt, Arjun Sarja', 'now_showing'),
(2, 'Jailer: The Resurgence', 'A retired prison warden sets out on a high-stakes manhunt when his honest police officer son goes missing while investigating an idol smuggling ring.', 'Action', 'Tamil', 168, 8.4, '2024-08-10', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80', 'Nelson Dilipkumar', 'Rajinikanth, Mohanlal, Shiva Rajkumar, Ramya Krishnan', 'now_showing'),
(3, 'Family Star: Heart & Laughter', 'A devoted middle-class architect goes to hilarious and heartwarming lengths to support his extended joint family while navigating romance with an ambitious entrepreneur.', 'Comedy', 'Tamil', 138, 8.1, '2024-04-05', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80', 'Parasuram', 'Vijay Deverakonda, Mrunal Thakur, Vasuki', 'now_showing'),
(4, 'Oppenheimer: The Atomic Dawn', 'The gripping biographical drama chronicling J. Robert Oppenheimer and his role in the Manhattan Project, exploring the moral gravity of world-altering science.', 'Thriller', 'English', 180, 8.9, '2024-07-21', 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&auto=format&fit=crop&q=80', 'Christopher Nolan', 'Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr.', 'trending'),
(5, 'Avengers: Secret Wars', 'Earth''s mightiest heroes and multiversal champions unite against a cosmic threat with power beyond imagination to restore balance across reality.', 'Sci-Fi', 'English', 160, 8.8, '2024-11-15', 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80', 'Russo Brothers', 'Robert Downey Jr., Chris Hemsworth, Benedict Cumberbatch, Tom Holland', 'trending'),
(6, 'Stree 2: The Haunted Night', 'The town of Chanderi faces a new terrifying headless entity, forcing Vicky and his eccentric squad to team up with the mysterious ghost spirit once again.', 'Comedy', 'Hindi', 147, 8.3, '2024-08-15', 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop&q=80', 'Amar Kaushik', 'Rajkummar Rao, Shraddha Kapoor, Pankaj Tripathi, Abhishek Banerjee', 'now_showing'),
(7, 'Fighter: Skies of Glory', 'Top Indian Air Force aviators face perilous aerial dogfights and intense personal sacrifice while protecting the nation''s borders.', 'Action', 'Hindi', 166, 7.9, '2024-01-25', 'https://images.unsplash.com/photo-1519074069444-1ba4ea16e6ef?w=800&auto=format&fit=crop&q=80', 'Siddharth Anand', 'Hrithik Roshan, Deepika Padukone, Anil Kapoor, Karan Singh Grover', 'now_showing'),
(8, 'Interstellar Odyssey', 'A team of daring explorers travel through a newly discovered wormhole near Saturn in an attempt to ensure humanity''s survival.', 'Sci-Fi', 'English', 169, 8.7, '2024-09-20', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80', 'Christopher Nolan', 'Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine', 'now_showing'),
(9, 'Midnight Whisper: The Manor', 'A young archaeologist unearths an ancient cursed relic inside an abandoned estate, unleashing a malevolent supernatural force.', 'Horror', 'English', 112, 7.5, '2024-10-31', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80', 'James Wan', 'Patrick Wilson, Vera Farmiga, Sterling Jerins', 'now_showing'),
(10, 'Love Today & Forever', 'A hilarious and charming modern romantic comedy where a couple is forced to exchange their smartphones for 24 hours before their wedding approval.', 'Romance', 'Tamil', 154, 8.2, '2024-02-14', 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop&q=80', 'Pradeep Ranganathan', 'Pradeep Ranganathan, Ivana, Radhika Sarathkumar, Sathyaraj', 'now_showing'),
(11, 'Kalki 2898 AD', 'In a dystopian world ruled by darkness, a modern avatar of Vishnu descends to protect the unborn savior of humanity.', 'Sci-Fi', 'Hindi', 181, 8.5, '2024-06-27', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80', 'Nag Ashwin', 'Prabhas, Amitabh Bachchan, Kamal Haasan, Deepika Padukone', 'trending'),
(12, 'Dune: Awakening', 'Paul Atreides unites with the Fremen on Arrakis to wage war against the conspirators who destroyed his family, fulfilling his mystical destiny.', 'Sci-Fi', 'English', 166, 8.7, '2024-12-20', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80', 'Denis Villeneuve', 'Timothée Chalamet, Zendaya, Rebecca Ferguson, Javier Bardem', 'upcoming');

-- 3. Insert Theatres (5 Multiplex Theatres)
INSERT INTO theatres (id, name, location) VALUES
(1, 'PVR Cinemas - Grand Mall', 'Velachery Main Road, Chennai'),
(2, 'INOX Multiplex - City Centre', 'Dr. Radhakrishnan Salai, Mylapore, Chennai'),
(3, 'AGS Cinemas - OMR Prime', 'Navalur, Old Mahabalipuram Rd, Chennai'),
(4, 'SPI Cinemas - Sathyam Grand', 'Royapettah High Rd, Royapettah, Chennai'),
(5, 'Cinepolis - Nexus Mall', 'Vadapalani, Arcot Road, Chennai');

-- 4. Insert Screens (2 screens per theatre)
INSERT INTO screens (id, theatre_id, screen_name) VALUES
(1, 1, 'Screen 1 (IMAX 4K)'),
(2, 1, 'Screen 2 (Dolby Atmos)'),
(3, 2, 'Screen 1 (Laser 3D)'),
(4, 2, 'Screen 2 (Insignia VIP)'),
(5, 3, 'Screen 1 (4K RGB Laser)'),
(6, 3, 'Screen 2 (Acoustic Luxe)'),
(7, 4, 'Screen 1 (Santham Atmos)'),
(8, 4, 'Screen 2 (Studio 5)'),
(9, 5, 'Screen 1 (Macro XE)'),
(10, 5, 'Screen 2 (Junior Lounge)');

-- 5. Insert Seats for Screens (A1..A8: Regular ₹150, B1..B8: Regular ₹150, C1..C8: Premium ₹220, D1..D8: Premium ₹220, E1..E8: VIP ₹300)
-- For screens 1 through 10
DELIMITER $$
DROP PROCEDURE IF EXISTS GenerateSeats$$
CREATE PROCEDURE GenerateSeats()
BEGIN
    DECLARE s_id INT DEFAULT 1;
    DECLARE row_letter CHAR(1);
    DECLARE col_num INT;
    DECLARE s_type VARCHAR(20);
    DECLARE s_price DECIMAL(8, 2);
    
    WHILE s_id <= 10 DO
        -- Row A (Regular)
        SET col_num = 1;
        WHILE col_num <= 8 DO
            INSERT INTO seats (screen_id, seat_number, seat_type, price) VALUES (s_id, CONCAT('A', col_num), 'Regular', 150.00);
            SET col_num = col_num + 1;
        END WHILE;

        -- Row B (Regular)
        SET col_num = 1;
        WHILE col_num <= 8 DO
            INSERT INTO seats (screen_id, seat_number, seat_type, price) VALUES (s_id, CONCAT('B', col_num), 'Regular', 150.00);
            SET col_num = col_num + 1;
        END WHILE;

        -- Row C (Premium)
        SET col_num = 1;
        WHILE col_num <= 8 DO
            INSERT INTO seats (screen_id, seat_number, seat_type, price) VALUES (s_id, CONCAT('C', col_num), 'Premium', 220.00);
            SET col_num = col_num + 1;
        END WHILE;

        -- Row D (Premium)
        SET col_num = 1;
        WHILE col_num <= 8 DO
            INSERT INTO seats (screen_id, seat_number, seat_type, price) VALUES (s_id, CONCAT('D', col_num), 'Premium', 220.00);
            SET col_num = col_num + 1;
        END WHILE;

        -- Row E (VIP)
        SET col_num = 1;
        WHILE col_num <= 8 DO
            INSERT INTO seats (screen_id, seat_number, seat_type, price) VALUES (s_id, CONCAT('E', col_num), 'VIP', 300.00);
            SET col_num = col_num + 1;
        END WHILE;

        SET s_id = s_id + 1;
    END WHILE;
END$$
DELIMITER ;

CALL GenerateSeats();
DROP PROCEDURE IF EXISTS GenerateSeats;

-- 6. Insert Shows (Across Today and next few days)
INSERT INTO shows (id, movie_id, theatre_id, screen_id, show_date, show_time) VALUES
-- Leo at PVR (Theatre 1, Screen 1)
(1, 1, 1, 1, CURDATE(), '10:30 AM'),
(2, 1, 1, 1, CURDATE(), '01:45 PM'),
(3, 1, 1, 1, CURDATE(), '04:30 PM'),
(4, 1, 1, 1, CURDATE(), '07:15 PM'),
(5, 1, 1, 1, CURDATE(), '10:30 PM'),
-- Leo at INOX (Theatre 2, Screen 3)
(6, 1, 2, 3, CURDATE(), '11:00 AM'),
(7, 1, 2, 3, CURDATE(), '03:15 PM'),
(8, 1, 2, 3, CURDATE(), '07:15 PM'),
(9, 1, 2, 3, CURDATE(), '10:45 PM'),
-- Leo at SPI Sathyam (Theatre 4, Screen 7)
(10, 1, 4, 7, CURDATE(), '10:30 AM'),
(11, 1, 4, 7, CURDATE(), '02:00 PM'),
(12, 1, 4, 7, CURDATE(), '07:15 PM'),

-- Jailer at PVR (Theatre 1, Screen 2) & AGS (Theatre 3, Screen 5)
(13, 2, 1, 2, CURDATE(), '11:15 AM'),
(14, 2, 1, 2, CURDATE(), '03:00 PM'),
(15, 2, 1, 2, CURDATE(), '06:45 PM'),
(16, 2, 1, 2, CURDATE(), '10:15 PM'),
(17, 2, 3, 5, CURDATE(), '01:30 PM'),
(18, 2, 3, 5, CURDATE(), '07:00 PM'),

-- Family Star at AGS (Theatre 3, Screen 6) & SPI (Theatre 4, Screen 8)
(19, 3, 3, 6, CURDATE(), '10:30 AM'),
(20, 3, 3, 6, CURDATE(), '02:15 PM'),
(21, 3, 3, 6, CURDATE(), '06:30 PM'),
(22, 3, 4, 8, CURDATE(), '01:15 PM'),
(23, 3, 4, 8, CURDATE(), '07:30 PM'),

-- Oppenheimer at PVR IMAX (Theatre 1, Screen 1 - tomorrow) & INOX
(24, 4, 1, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '02:30 PM'),
(25, 4, 1, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '07:30 PM'),
(26, 4, 2, 4, CURDATE(), '04:00 PM'),
(27, 4, 2, 4, CURDATE(), '08:30 PM'),

-- Avengers at Cinepolis (Theatre 5, Screen 9)
(28, 5, 5, 9, CURDATE(), '11:30 AM'),
(29, 5, 5, 9, CURDATE(), '03:45 PM'),
(30, 5, 5, 9, CURDATE(), '07:15 PM'),
(31, 5, 5, 9, CURDATE(), '10:45 PM'),

-- Stree 2 at Cinepolis (Theatre 5, Screen 10) & INOX
(32, 6, 5, 10, CURDATE(), '01:00 PM'),
(33, 6, 5, 10, CURDATE(), '06:15 PM'),
(34, 6, 2, 3, CURDATE(), '01:15 PM'),

-- Fighter at AGS (Theatre 3, Screen 5)
(35, 7, 3, 5, CURDATE(), '10:00 AM'),
(36, 7, 3, 5, CURDATE(), '04:15 PM'),
(37, 7, 3, 5, CURDATE(), '09:45 PM'),

-- Interstellar at SPI (Theatre 4, Screen 7)
(38, 8, 4, 7, CURDATE(), '03:45 PM'),
(39, 8, 4, 7, CURDATE(), '09:30 PM'),

-- Midnight Whisper at INOX (Theatre 2, Screen 4)
(40, 9, 2, 4, CURDATE(), '10:45 PM'),

-- Love Today at SPI Sathyam (Theatre 4, Screen 8)
(41, 10, 4, 8, CURDATE(), '10:00 AM'),
(42, 10, 4, 8, CURDATE(), '04:45 PM'),
(43, 10, 4, 8, CURDATE(), '10:15 PM'),

-- Kalki at Cinepolis (Theatre 5, Screen 9)
(44, 11, 5, 9, CURDATE(), '01:00 PM'),
(45, 11, 5, 9, CURDATE(), '08:00 PM');

-- 7. Insert Sample Realistic Bookings
-- Show 4 (Leo @ PVR 07:15 PM Screen 1) -> Pre-book A1, A2, D4, D5 so C4, C5 remain open for AI recommendation demo!
INSERT INTO bookings (id, booking_code, user_id, show_id, total_amount, booking_status, created_at) VALUES
(1, 'UPS-MOV-100201', 2, 4, 345.00, 'CONFIRMED', NOW() - INTERVAL 2 HOUR),
(2, 'UPS-MOV-100202', 2, 4, 506.00, 'CONFIRMED', NOW() - INTERVAL 1 HOUR);

-- Book seats A1, A2 (ids 1, 2) and D4, D5 (ids 28, 29 for Screen 1)
INSERT INTO booking_seats (booking_id, seat_id) VALUES
(1, 1),
(1, 2),
(2, 28),
(2, 29);
