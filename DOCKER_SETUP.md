# הרצת האפליקציה עם Docker Compose

## הכנה

1. צור קובץ `.env` בתיקיית השורש של הפרויקט עם המשתנים הבאים:

```env
# Supabase Configuration (מהקובץ k3s/supabase-secret.yaml)
SUPABASE_URL=https://ecycgdubgadbfsceglnn.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjeWNnZHViZ2FkYmZzY2VnbG5uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDIwODc0NiwiZXhwIjoyMDc1Nzg0NzQ2fQ.zsYIPHfXCsPlxNE-DQZX5ja14B1q6H7OIX2sAeeGqr4

# Frontend build-time environment variables
VITE_SUPABASE_URL=https://ecycgdubgadbfsceglnn.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**הערה חשובה:** 
- הערכים `SUPABASE_URL` ו-`SUPABASE_KEY` כבר מוגדרים לעיל (מה-`k3s/supabase-secret.yaml`)
- עבור `VITE_SUPABASE_ANON_KEY` - אתה צריך לקבל את המפתח ה-anon (anon/public key) מ-Supabase Dashboard:
  1. היכנס ל-Supabase Dashboard
  2. בחר את הפרויקט שלך
  3. לך ל-Settings → API
  4. העתק את ה-"anon" או "public" key
  5. הדבק אותו ב-`.env` במקום `your-anon-key-here`

## הרצה

1. הרץ את הפקודה הבאה מהתיקייה הראשית:

```bash
docker-compose up --build
```

או להרצה ברקע:

```bash
docker-compose up --build -d
```

## גישה לאפליקציה

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:4000
- **Backend Health Check**: http://localhost:4000/health

## עצירת האפליקציה

```bash
docker-compose down
```

או עם מחיקת ה-volumes:

```bash
docker-compose down -v
```

## בדיקת הלוגים

```bash
# כל הלוגים
docker-compose logs

# לוגים של שירות ספציפי
docker-compose logs backend
docker-compose logs frontend

# לוגים בזמן אמת
docker-compose logs -f
```

