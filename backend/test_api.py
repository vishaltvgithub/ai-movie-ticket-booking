import requests
import sys

# Ensure UTF-8 printing for emojis/unicode characters on Windows
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("=== Starting End-to-End API Integration Verification ===")

    # 1. Health & Root check
    r = requests.get(f"{BASE_URL}/")
    assert r.status_code == 200, f"Root failed: {r.text}"
    print("[PASS] 1. Root & Health API Check Passed")

    # 2. Stats
    r = requests.get(f"{BASE_URL}/api/stats")
    assert r.status_code == 200, f"Stats failed: {r.text}"
    stats = r.json()
    print(f"[PASS] 2. Dashboard Stats Passed: {stats}")

    # 3. Movies List
    r = requests.get(f"{BASE_URL}/api/movies")
    assert r.status_code == 200
    movies = r.json()
    assert len(movies) >= 10, f"Expected >= 10 movies, got {len(movies)}"
    print(f"[PASS] 3. Movies Catalog Passed: Loaded {len(movies)} movies")

    # 4. Search Filter
    r = requests.get(f"{BASE_URL}/api/movies/search?q=Tamil&genre=Action")
    assert r.status_code == 200
    tamil_action = r.json()
    assert len(tamil_action) >= 1
    print(f"[PASS] 4. Movie Search Passed: Found {len(tamil_action)} Tamil Action movies ({[m['title'] for m in tamil_action]})")

    # 5. AI Chatbot
    chat_payload = {"message": "I want to watch a Tamil action movie tonight."}
    r = requests.post(f"{BASE_URL}/api/ai/chat", json=chat_payload)
    assert r.status_code == 200
    ai_data = r.json()
    assert len(ai_data["recommendations"]) > 0, "No recommendations returned"
    print("[PASS] 5. CineAI Chatbot Passed:")
    print(f"   Reply: {ai_data['reply'][:120]}...")
    print(f"   Recommended: {[m['title'] for m in ai_data['recommendations']]}")

    # 6. Show Seats for Leo @ PVR (first show in DB)
    target_show_id = 4
    r = requests.get(f"{BASE_URL}/api/shows/{target_show_id}/seats")
    assert r.status_code == 200
    seats = r.json()
    assert len(seats) == 40, f"Expected 40 seats, got {len(seats)}"
    booked_count = sum(1 for s in seats if s["is_booked"])
    print(f"[PASS] 6. Show Seats Passed: Total {len(seats)} seats ({booked_count} pre-booked)")

    # 7. AI Seat Recommendation (dynamic - always picks best available)
    r = requests.get(f"{BASE_URL}/api/shows/{target_show_id}/recommended-seats?count=2")
    assert r.status_code == 200
    rec_data = r.json()
    rec_seats = rec_data["recommended_seats"]
    seat_numbers = [s["seat_number"] for s in rec_seats]
    print(f"[PASS] 7. AI Seat Recommendation Passed:")
    print(f"   Recommended Seats: {seat_numbers}")
    print(f"   Explanation: {rec_data['explanation']}")

    # 8. Create Booking with AI-recommended seats (dynamic, always available)
    seat_ids = [s["id"] for s in rec_seats]
    booking_payload = {
        "show_id": target_show_id,
        "seat_ids": seat_ids,
        "user_id": 1,
        "payment_method": "UPI"
    }
    r = requests.post(f"{BASE_URL}/api/bookings", json=booking_payload)
    assert r.status_code == 200, f"Booking failed ({r.status_code}): {r.text}"
    booking_res = r.json()
    print(f"[PASS] 8. Booking Creation Passed: Code={booking_res['booking_code']}, Amount=Rs.{booking_res['total_amount']}, Seats={booking_res['seats']}")

    # 9. Double Booking Guard - trying same seats again must return 409 Conflict
    r_conflict = requests.post(f"{BASE_URL}/api/bookings", json=booking_payload)
    assert r_conflict.status_code == 409, f"Expected 409 Conflict, got {r_conflict.status_code}: {r_conflict.text}"
    print(f"[PASS] 9. Double Booking Guard Passed: '{r_conflict.json()['detail']}'")

    # 10. Fetch User Bookings
    r = requests.get(f"{BASE_URL}/api/users/1/bookings")
    assert r.status_code == 200
    user_bookings = r.json()
    assert len(user_bookings) >= 1
    print(f"[PASS] 10. User Bookings Passed: Found {len(user_bookings)} confirmed booking(s)")

    print("\n*** ALL 10 END-TO-END SYSTEM INTEGRATION TESTS PASSED SUCCESSFULLY! ***\n")

if __name__ == "__main__":
    run_tests()
