import re
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from models import Seat, BookingSeat, Show

def find_best_seats_for_show(db: Session, show_id: int, count: int = 2) -> Tuple[List[Seat], str]:
    """
    Intelligently recommends the best available seats for a given show.
    Priority criteria:
    1. Row tier: Center rows C & D (Premium center view), then B & E, then A.
    2. Column position: Center columns (4, 5, 3, 6, 2, 7, 1, 8).
    3. Contiguity: Group of consecutive seats in the same row.
    """
    show = db.query(Show).filter(Show.id == show_id).first()
    if not show:
        return [], "Show not found."

    # Fetch all seats for this screen
    all_seats = db.query(Seat).filter(Seat.screen_id == show.screen_id).all()
    
    # Fetch booked seat IDs for this show
    booked_subquery = (
        db.query(BookingSeat.seat_id)
        .join(BookingSeat.booking)
        .filter(BookingSeat.booking.has(show_id=show_id))
        .all()
    )
    booked_seat_ids = {row[0] for row in booked_subquery}

    # Group available seats by row
    row_seats: Dict[str, List[Seat]] = {}
    for s in all_seats:
        if s.id not in booked_seat_ids:
            # Parse row and number
            match = re.match(r"([A-Za-z]+)(\d+)", s.seat_number)
            if match:
                row = match.group(1).upper()
                col = int(match.group(2))
                s._col = col # temporary attribute for sorting
                if row not in row_seats:
                    row_seats[row] = []
                row_seats[row].append(s)

    # Preferred row order
    row_preference = ['C', 'D', 'B', 'E', 'A']

    best_group: List[Seat] = []
    best_score = -999999
    best_row_name = ""

    for row in row_preference:
        if row not in row_seats:
            continue
        seats_in_row = sorted(row_seats[row], key=lambda x: x._col)
        
        # Check consecutive sequences of length 'count'
        for i in range(len(seats_in_row) - count + 1):
            subset = seats_in_row[i : i + count]
            
            # Check if columns are consecutive
            is_consecutive = True
            for k in range(len(subset) - 1):
                if subset[k+1]._col - subset[k]._col != 1:
                    is_consecutive = False
                    break
            
            if is_consecutive:
                # Calculate distance score from center (center is ~4.5)
                center_dist = sum(abs(s._col - 4.5) for s in subset) / count
                
                # Row weight (C=100, D=90, B=80, E=70, A=60)
                row_weight = {'C': 100, 'D': 90, 'B': 80, 'E': 70, 'A': 60}.get(row, 50)
                score = row_weight - (center_dist * 10)
                
                if score > best_score:
                    best_score = score
                    best_group = subset
                    best_row_name = row

    if best_group:
        seat_names = " and ".join([s.seat_number for s in best_group]) if len(best_group) <= 2 else ", ".join([s.seat_number for s in best_group])
        explanation = f"Seats {seat_names} in Row {best_row_name} provide a balanced center view and are available together."
        return best_group, explanation

    # If no contiguous group, pick top individual center seats
    all_available = [s for s in all_seats if s.id not in booked_seat_ids]
    if len(all_available) >= count:
        def seat_rank(s: Seat):
            match = re.match(r"([A-Za-z]+)(\d+)", s.seat_number)
            if match:
                row = match.group(1).upper()
                col = int(match.group(2))
                row_rank = {'C': 5, 'D': 4, 'B': 3, 'E': 2, 'A': 1}.get(row, 0)
                col_dist = abs(col - 4.5)
                return (row_rank, -col_dist)
            return (0, 0)

        sorted_seats = sorted(all_available, key=seat_rank, reverse=True)
        picked = sorted_seats[:count]
        seat_names = ", ".join([s.seat_number for s in picked])
        return picked, f"Recommended available seats: {seat_names} offering the best remaining line-of-sight."

    return all_available, "Limited seats remaining for this show."
