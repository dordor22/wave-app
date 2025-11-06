# תיקון אבטחה - הסרת מפתחות חשופים מ-Git

## ⚠️ בעיה חמורה!
הקובץ `k3s/supabase-secret.yaml` נדחף ל-Git וחושף מפתחות רגישים של Supabase.

## מה צריך לעשות:

### 1. הסר את הקובץ מה-Git (אבל שמור אותו מקומית)

```bash
git rm --cached k3s/supabase-secret.yaml
```

### 2. הוסף את השינויים ל-Git

```bash
git add .gitignore
git add k3s/supabase-secret.yaml.example
git commit -m "Remove exposed secrets and add .gitignore rules"
```

### 3. דחף את השינויים

```bash
git push
```

### 4. ⚠️ חשוב מאוד - שנה את המפתחות ב-Supabase!

המפתחות נחשפו ב-Git, ולכן **חייבים לשנות אותם**:

1. היכנס ל-Supabase Dashboard: https://supabase.com/dashboard
2. בחר את הפרויקט שלך
3. לך ל-Settings → API
4. **צור מפתח חדש** (Rotate key) או שנה את ה-service role key
5. עדכן את `k3s/supabase-secret.yaml` המקומי עם המפתחות החדשים
6. עדכן את כל הסביבות (Docker, Kubernetes, וכו') עם המפתחות החדשים

### 5. אם הקובץ כבר ב-Git History

אם כבר דחפת את הקובץ ל-remote repository, תצטרך לנקות את ה-history:

```bash
# זה יסיר את הקובץ מכל ה-history (זהירות!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch k3s/supabase-secret.yaml" \
  --prune-empty --tag-name-filter cat -- --all

# או אם אתה משתמש ב-GitHub, אפשר להשתמש ב-BFG Repo-Cleaner
# או פשוט ליצור repository חדש
```

**הערה:** אם זה repository ציבורי או שיש לו collaborators, **חייבים** לשנות את המפתחות!

## מה כבר תוקן:

✅ הוספתי את `supabase-secret.yaml` ל-`.gitignore`
✅ יצרתי קובץ דוגמה: `k3s/supabase-secret.yaml.example`
✅ הקובץ המקומי נשאר (רק הוסר מה-git tracking)

## שימוש עתידי:

- **אל תדחף** קבצים עם `*secret*.yaml` ל-Git
- השתמש ב-`supabase-secret.yaml.example` כדוגמה
- עבור Kubernetes, השתמש ב-Sealed Secrets או ב-external secret management
- עבור Docker Compose, השתמש בקובץ `.env` (שכבר ב-.gitignore)

