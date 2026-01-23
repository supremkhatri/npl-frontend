from django.http import JsonResponse
from django.db import connection

def dictfetchall(cursor):
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]


# JSON API for React
def team_list_api(request):
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT team_id, team_name, acronym
            FROM teams
            ORDER BY team_name
        """)
        teams = dictfetchall(cursor)

    return JsonResponse(teams, safe=False)
