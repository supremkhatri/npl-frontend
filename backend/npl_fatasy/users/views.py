from django.shortcuts import render, redirect
from django.db import connection, IntegrityError
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
import json
from django.http import JsonResponse
from django.db import connection, IntegrityError
from django.views.decorators.http import require_POST


@ensure_csrf_cookie
def csrf(request):
    return JsonResponse({"message": "CSRF cookie set"}) 

def session_view(request):
    username = request.session.get("username")
    if username:
        return JsonResponse({"username": username})
    return JsonResponse({"username": None})

@require_POST
def register(request):
    try:
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return JsonResponse({"error": "Missing fields"}, status=400)

        hashed_password = make_password(password)

        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO users (username, password) VALUES (%s, %s)",
                [username, hashed_password],
            )

        return JsonResponse({"message": "User registered successfully"}, status=201)

    except IntegrityError:
        return JsonResponse({"error": "Username already exists"}, status=400)

    except Exception:
        return JsonResponse({"error": "Invalid request"}, status=400)


@require_POST
def login_view(request):
    try:
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT user_id, password FROM users WHERE username = %s",
                [username],
            )
            user = cursor.fetchone()

        if user and check_password(password, user[1]):
            request.session["user_id"] = user[0]
            request.session["username"] = username
            return JsonResponse({"message": "Login successful"})

        return JsonResponse({"error": "Invalid credentials"}, status=401)

    except Exception:
        return JsonResponse({"error": "Invalid request"}, status=400)

def logout_view(request):
    request.session.flush()
    return JsonResponse({"message": "Logged out"})


