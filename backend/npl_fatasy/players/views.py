from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.db import connection, IntegrityError
from users.auth import login_required


# =========================
# Helper
# =========================
def dictfetchall(cursor):
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]


# =========================
# HTML VIEWS (KEEP)
# =========================

def players_by_team(request, acronym):
    """
    Server-rendered page:
    /players/ABC/
    """
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT 
                p.player_id,
                p.player_name,
                p.role,
                p.cost,
                t.team_name,
                t.acronym
            FROM players p
            JOIN teams t ON p.team_id = t.team_id
            WHERE t.acronym = %s
            ORDER BY p.player_name
        """, [acronym.upper()])
        players = dictfetchall(cursor)

    return render(
        request,
        "players.html",
        {"players": players, "acronym": acronym}
    )


@login_required
def add_player(request):
    # Fetch teams for dropdown
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT team_id, team_name, acronym
            FROM teams
            ORDER BY team_name
        """)
        teams = cursor.fetchall()

    error = None

    if request.method == "POST":
        player_id = request.POST.get("player_id")
        player_name = request.POST.get("player_name")
        role = request.POST.get("role")
        cost = request.POST.get("cost")
        team_id = request.POST.get("team_id")

        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO players
                    (player_id, player_name, role, cost, team_id)
                    VALUES (%s, %s, %s, %s, %s)
                """, [player_id, player_name, role, cost, team_id])

            return redirect("add_player")

        except IntegrityError:
            error = "Player ID already exists or invalid team selected."

    return render(request, "add_player.html", {
        "teams": teams,
        "error": error
    })


# =========================
# API VIEWS (FOR REACT)
# =========================

def players_by_team_api(request, acronym):
    """
    JSON API:
    GET /api/players/<TEAM_ACRONYM>/
    """
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT 
                p.player_id,
                p.player_name,
                p.role,
                p.cost
            FROM players p
            JOIN teams t ON p.team_id = t.team_id
            WHERE t.acronym = %s
            ORDER BY p.player_name
        """, [acronym.upper()])
        players = dictfetchall(cursor)

    return JsonResponse(players, safe=False)
