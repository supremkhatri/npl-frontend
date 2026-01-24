from django.http import JsonResponse
from django.db import connection, IntegrityError
from django.views.decorators.csrf import csrf_exempt
import json
from django.utils.timezone import localdate
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required

@login_required
def admin_session_api(request):
    if request.user.is_superuser:
        return JsonResponse({"authenticated": True})
    return JsonResponse({"authenticated": False}, status=403)


def admin_login_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    try:
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        user = authenticate(username=username, password=password)

        if user and user.is_superuser:
            login(request, user)
            return JsonResponse({"status": "ok"})

        return JsonResponse({"error": "Invalid admin credentials"}, status=401)

    except Exception:
        return JsonResponse({"error": "Invalid request"}, status=400)
    

# ===========================
# HELPER
# ===========================
def dictfetchall(cursor):
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]


# ===========================
# TEAMS CRUD
# ===========================
@login_required
def list_teams_api(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT team_id, team_name, acronym FROM teams ORDER BY team_name")
        teams = dictfetchall(cursor)
    return JsonResponse({"teams": teams})


@csrf_exempt
@login_required
def add_team_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    team_name = data.get("team_name", "").strip()
    acronym = data.get("acronym", "").strip()

    if not team_name or not acronym:
        return JsonResponse({"error": "Team name and acronym are required"}, status=400)

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT COALESCE(MAX(team_id), 0) + 1 FROM teams")
            new_id = cursor.fetchone()[0]
            cursor.execute(
                "INSERT INTO teams (team_id, team_name, acronym) VALUES (%s, %s, %s)",
                [new_id, team_name, acronym],
            )
        return JsonResponse({"status": "created"})
    except IntegrityError as e:
        return JsonResponse({"error": str(e)}, status=400)



@csrf_exempt
@login_required
def edit_team_api(request, team_id):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT required"}, status=405)
    try:
        data = json.loads(request.body)
        team_name = data.get("team_name")
        acronym = data.get("acronym")

        with connection.cursor() as cursor:
            cursor.execute(
                "UPDATE teams SET team_name=%s, acronym=%s WHERE team_id=%s",
                [team_name, acronym, team_id],
            )
        return JsonResponse({"status": "updated"})
    except IntegrityError:
        return JsonResponse({"error": "Update failed"}, status=400)


@csrf_exempt
@login_required
def delete_team_api(request, team_id):
    if request.method != "DELETE":
        return JsonResponse({"error": "DELETE required"}, status=405)
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM players WHERE team_id=%s", [team_id])
        cursor.execute("""
            DELETE FROM matches
            WHERE team_1=%s OR team_2=%s
        """, [team_id, team_id])
        cursor.execute("DELETE FROM teams WHERE team_id=%s", [team_id])
    return JsonResponse({"status": "deleted"})


# ===========================
# PLAYERS CRUD
# ===========================
@login_required
def list_players_api(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT p.player_id, p.player_name, p.role, p.cost, t.team_name, t.acronym
            FROM players p
            JOIN teams t ON p.team_id = t.team_id
            ORDER BY p.player_name
        """)
        players = dictfetchall(cursor)
    return JsonResponse({"players": players})


@csrf_exempt
@login_required
def add_player_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    player_name = data.get("player_name")
    role = data.get("role")
    cost = data.get("cost")
    team_id = data.get("team_id")

    if not all([player_name, role, cost, team_id]):
        return JsonResponse({"error": "Missing fields"}, status=400)

    # Get team acronym
    with connection.cursor() as cursor:
        cursor.execute("SELECT acronym FROM teams WHERE team_id=%s", [team_id])
        team = cursor.fetchone()

    if not team:
        return JsonResponse({"error": "Invalid team"}, status=400)

    team_acronym = team[0]

    # Generate player_id
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT player_id
            FROM players
            WHERE player_id LIKE %s
            ORDER BY player_id DESC
            LIMIT 1
        """, [f"{team_acronym}%"])
        last = cursor.fetchone()

    if last:
        last_id = last[0]
        number = int(last_id.replace(team_acronym, ""))
        new_number = number + 1
    else:
        new_number = 1

    new_player_id = f"{team_acronym}{new_number:03d}"

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO players (player_id, player_name, role, cost, team_id)
                VALUES (%s,%s,%s,%s,%s)
            """, [new_player_id, player_name, role, cost, team_id])

        return JsonResponse({"status": "created", "player_id": new_player_id})
    except IntegrityError:
        return JsonResponse({"error": "Player exists or invalid team"}, status=400)




@csrf_exempt
@login_required
def edit_player_api(request, player_id):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT required"}, status=405)
    try:
        data = json.loads(request.body)
        player_name = data.get("player_name")
        role = data.get("role")
        cost = data.get("cost")
        team_id = data.get("team_id")

        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE players SET player_name=%s, role=%s, cost=%s, team_id=%s
                WHERE player_id=%s
            """, [player_name, role, cost, team_id, player_id])

        return JsonResponse({"status": "updated"})
    except IntegrityError:
        return JsonResponse({"error": "Update failed"}, status=400)


@csrf_exempt
@login_required
def delete_player_api(request, player_id):
    if request.method != "DELETE":
        return JsonResponse({"error": "DELETE required"}, status=405)
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM players WHERE player_id=%s", [player_id])
    return JsonResponse({"status": "deleted"})


# ===========================
# MATCHES CRUD
# ===========================
@login_required
def list_matches_api(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT m.match_id, m.match_date, t1.team_name AS team1_name, t2.team_name AS team2_name
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
            "match_date": row["match_date"].strftime("%Y-%m-%d"),
            "status": "Upcoming" if row["match_date"] >= today else "Completed"
        })

    return JsonResponse({"matches": matches})


@csrf_exempt
@login_required
def add_match_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    match_date = data.get("match_date")
    team_1 = data.get("team_1")
    team_2 = data.get("team_2")

    if not all([match_date, team_1, team_2]):
        return JsonResponse({"error": "Missing fields"}, status=400)

    # 🔹 Generate match_id = MAX + 1
    with connection.cursor() as cursor:
        cursor.execute("SELECT COALESCE(MAX(match_id), 0) + 1 FROM matches")
        match_id = cursor.fetchone()[0]

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO matches (match_id, match_date, team_1, team_2)
                VALUES (%s, %s, %s, %s)
            """, [match_id, match_date, team_1, team_2])

        return JsonResponse({
            "status": "created",
            "match_id": match_id
        })

    except IntegrityError:
        return JsonResponse({"error": "Failed to create match"}, status=400)




@csrf_exempt
@login_required
def edit_match_api(request, match_id):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT required"}, status=405)
    try:
        data = json.loads(request.body)
        match_date = data.get("match_date")
        team_1 = data.get("team_1")
        team_2 = data.get("team_2")

        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE matches SET match_date=%s, team_1=%s, team_2=%s
                WHERE match_id=%s
            """, [match_date, team_1, team_2, match_id])

        return JsonResponse({"status": "updated"})
    except IntegrityError:
        return JsonResponse({"error": "Update failed"}, status=400)


@csrf_exempt
@login_required
def delete_match_api(request, match_id):
    if request.method != "DELETE":
        return JsonResponse({"error": "DELETE required"}, status=405)
    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM matches WHERE match_id=%s", [match_id])
    return JsonResponse({"status": "deleted"})
