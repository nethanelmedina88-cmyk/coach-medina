# Coach Medina · פלטפורמת אימון אישי 🔥

פלטפורמה למאמן כושר ומתאמנים — עברית, RTL, מותאמת מובייל.
**Firebase Auth (אנונימי) + Firestore** עם סנכרון בזמן אמת: המתאמן מזין — המאמן רואה מיד, מכל מכשיר.

## מה יש בפנים

| קובץ | תפקיד |
|---|---|
| `index.html` | האפליקציה כולה (קובץ יחיד, ללא build) |
| `firebase-config.js` | כאן מדביקים את הגדרות ה-Firebase שלך |
| `firestore.rules` | חוקי אבטחה ל-Firestore (מדביקים בקונסולה) |

- **מאמן** נכנס עם PIN (ברירת מחדל: `2958`, אפשר לשנות במסך ההגדרות)
- **מתאמן** נכנס עם קוד אישי בן 6 תווים שהמאמן מפיק לו
- כל עוד `firebase-config.js` לא מולא — האפליקציה עובדת **במצב מקומי** (נתונים בדפדפן בלבד), כך שאפשר להתנסות מיד

## חיבור Firebase (חד-פעמי, ~5 דקות)

1. **צור פרויקט**: https://console.firebase.google.com ← Add project (למשל `coach-medina`)
2. **הוסף אפליקציית Web**: בעמוד הפרויקט לחץ על אייקון `</>` ← רשום כינוי ← העתק את בלוק ה-`firebaseConfig`
3. **הדבק** את הערכים ב-`firebase-config.js` (במקום שורות ה-`PASTE_...`)
4. **הפעל Anonymous Auth**: בקונסולה ← Build ← Authentication ← Sign-in method ← הפעל **Anonymous**
5. **צור Firestore**: Build ← Firestore Database ← Create database ← production mode ← אזור `europe-west1` (או הקרוב אליך)
6. **הדבק חוקים**: Firestore ← Rules ← הדבק את תוכן `firestore.rules` ← Publish

זהו. פתח את `index.html` — בתחתית הסרגל יופיע **"☁ מסונכרן בענן"**.

## פריסה ל-GitHub Pages

כמו ב-stay-hard: צור ריפו, העלה את כל הקבצים בתיקייה הזו (כולל `.nojekyll`), הפעל Pages על branch `main`. אין צורך בדומיין מורשה — Anonymous Auth עובד מכל דומיין.

## מבנה הנתונים ב-Firestore

```
clients/{clientId}   ← תיק מתאמן מלא: פרופיל, קוד אישי, weights[], checkins[],
                       habits[], workout[], nutrition{}, prs[]
meta/settings        ← { pin: "..." } — ה-PIN של המאמן
```

- כתיבות רצות בטרנזקציות (read-modify-write) — המאמן והמתאמן לא דורסים זה את זה
- `onSnapshot` על אוסף `clients` — כל שינוי מגיע לכל המכשירים בזמן אמת
- מטמון אופליין (`enablePersistence`) — עובד גם בלי רשת ומסתנכרן כשהיא חוזרת

## הערת אבטחה

הכניסה היא Anonymous Auth + בדיקת PIN/קוד בצד הלקוח — מתאים לפלטפורמה אישית בקנה מידה קטן.
המשמעות: כל מי שמכיר את כתובת האתר יכול טכנית לקרוא נתונים דרך ה-API אם יתאמץ.
אם תרצה נעילה אמיתית בעתיד: כניסת מאמן עם אימייל+סיסמה וחוקים שמגבילים כתיבה לפי UID — שדרוג פשוט יחסית.
