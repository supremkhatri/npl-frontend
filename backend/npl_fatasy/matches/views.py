from django.http import JsonResponse
from django.db import connection
from django.utils.timezone import localdate

def dictfetchall(cursor):
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]


def match_list_api(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT 
                m.match_id,
                m.match_date,
                t1.team_name AS team1_name,
                t2.team_name AS team2_name
            FROM matches m
            JOIN teams t1 ON m.team_1 = t1.team_id
            JOIN teams t2 ON m.team_2 = t2.team_id
            ORDER BY m.match_date ASC
        """)
        rows = dictfetchall(cursor)

    today = localdate()
    matches = []

    for row in rows:
        matches.append({
            "id": row["match_id"],
            "teams": f"{row['team1_name']} vs {row['team2_name']}",
            "time": row["match_date"].strftime("%b %d"),
            "status": "Upcoming" if row["match_date"] >= today else "Completed"
        })

    return JsonResponse(matches, safe=False)
