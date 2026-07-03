# Coach Medina · פלטפורמת אימון אישי 🔥

פלטפורמה למאמן כושר ומתאמנים — עברית, RTL, מותאמת מובייל, **PWA להתקנה**.
**Firebase Auth (אנונימי) + Firestore** עם סנכרון בזמן אמת: המתאמן מזין — המאמן רואה מיד, מכל מכשיר.
**Google Analytics** למעקב כניסות/יציאות ושימוש.

- **חי:** https://nethanelmedina88-cmyk.github.io/coach-medina/
- **מאמן** נכנס עם PIN (ברירת מחדל: `2958`, ניתן לשינוי במסך ההגדרות)
- **מתאמן** נכנס עם קוד אישי בן 6 תווים שהמאמן מפיק לו

## מה יש בפנים

| קובץ | תפקיד |
|---|---|
| `index.html` | האפליקציה כולה (קובץ יחיד, ללא build) |
| `firebase-config.js` | הגדרות Firebase — **מחובר לפרויקט coach-medina** |
| `firestore.rules` | חוקי אבטחה ל-Firestore (מפורסמים בקונסולה) |
| `manifest.webmanifest` | מניפסט PWA (שם, אייקונים, standalone) |
| `sw.js` | service worker — התקנה + עבודה אופליין |
| `icon-*.png`, `apple-touch-icon.png` | אייקוני האפליקציה (מהלוגו) |
| `.well-known/assetlinks.json` | אימות דומיין ל-TWA (Google Play) — ראה למטה |

## סטטוס Firebase — מחובר ✓

הפרויקט **`coach-medina`** כבר מוגדר ומחובר: התחברות אנונימית פעילה, Firestore באזור `eur3 (Europe)`,
חוקי אבטחה מפורסמים, ו-Google Analytics פעיל. אין מה להגדיר — האתר החי כבר עובד מול הענן.

### מבנה הנתונים
```
clients/{clientId}   ← תיק מתאמן מלא: פרופיל, קוד אישי, weights[], checkins[],
                       habits[], workout[], nutrition{}, prs[]
meta/settings        ← { pin: "..." } — ה-PIN של המאמן
```
- כתיבות רצות בטרנזקציות (read-modify-write) — המאמן והמתאמן לא דורסים זה את זה
- `onSnapshot` על אוסף `clients` — כל שינוי מגיע לכל המכשירים בזמן אמת
- מטמון אופליין (`enablePersistence`) — עובד גם בלי רשת ומסתנכרן כשהיא חוזרת

## Google Analytics — מעקב כניסות/יציאות

Analytics מחובר (`measurementId: G-1SWZ5V6CS6`). האפליקציה שולחת אירועים:

| אירוע | מתי | פרמטרים |
|---|---|---|
| `login` | כניסה מוצלחת | `method` (pin/code), `role` (coach/client) |
| `logout` | יציאה | `role` |
| `login_failed` | PIN/קוד שגוי | `role` |
| `screen_view` | מעבר בין מסכים | `screen_name`, `role` |

בנוסף Analytics אוסף אוטומטית `page_view`, `session_start`, `first_visit`, `user_engagement`.

**איפה רואים את הנתונים:**
- **Firebase console** ← Analytics Dashboard (סקירה נוחה)
- **Google Analytics** ← https://analytics.google.com ← property של coach-medina ← Reports ← Realtime (מיידי) / Engagement → Events (כניסות/יציאות)
- **DebugView** (זמן אמת מלא): ב-GA4 ← Admin ← DebugView. הערה: דוחות רגילים מתעדכנים תוך 24-48 שעות; Realtime תוך דקות.

## פריסה ל-GitHub Pages

הריפו `nethanelmedina88-cmyk/coach-medina` כבר מפורסם עם Pages על `main`. כל דחיפה מתעדכנת אוטומטית תוך ~דקה.
Anonymous Auth ו-Analytics עובדים מכל דומיין — אין צורך בדומיין מורשה.

## התקנה כאפליקציה (PWA)

בדפדפן במחשב (Chrome/Edge): אייקון ההתקנה בשורת הכתובת ← "התקן".
במובייל: תפריט הדפדפן ← "הוסף למסך הבית" / "Add to Home Screen". האפליקציה נפתחת במסך מלא, עם אייקון משלה, ועובדת אופליין.

## העלאה ל-Google Play (TWA)

האפליקציה היא PWA תקני, אז אפשר לעטוף אותה כאפליקציית אנדרואיד (TWA) ולהעלות לחנות. הצעדים:

1. **חשבון מפתח** — פתח **Google Play Developer** (תשלום חד-פעמי 25$) ב-https://play.google.com/console
2. **בנה חבילה** — היכנס ל-https://www.pwabuilder.com , הזן את הכתובת
   `https://nethanelmedina88-cmyk.github.io/coach-medina/` ← Package for stores ← Android ←
   הורד את חבילת ה-`.aab` (העטיפה TWA). שם החבילה המומלץ: `com.coachmedina.twa` (חייב להתאים ל-assetlinks).
3. **העלה** — ב-Play Console: Create app ← מלא פרטים (שם, קטגוריה: Health & Fitness, שפה: עברית) ←
   העלה את ה-`.aab` ל-Internal testing / Production.
4. **מדיניות פרטיות** — Play דורש קישור למדיניות פרטיות. (אפשר להוסיף עמוד `privacy.html` פשוט — תגיד לי ואכין.)
5. **דירוג תוכן + פרטי חנות** — מלא את שאלון דירוג התוכן, תיאור, צילומי מסך (אפשר לצלם מהאפליקציה החיה).
6. **אימות דומיין (הסרת שורת הכתובת)** — כדי שהאפליקציה תיראה "מלאה" בלי סרגל URL:
   - קח את טביעת האצבע **SHA-256** של מפתח החתימה (ב-Play Console ← App integrity ← App signing, או מ-PWABuilder).
   - הדבק אותה בקובץ `.well-known/assetlinks.json` במקום `REPLACE_WITH_...`.
   - ⚠ **חשוב:** הקובץ חייב להיות מוגש ב**שורש הדומיין**:
     `https://nethanelmedina88-cmyk.github.io/.well-known/assetlinks.json` — לא בתת-הנתיב `/coach-medina/`.
     לכן יש להעלות אותו לריפו של דף הבית של המשתמש (`nethanelmedina88-cmyk.github.io`). אם אין ריפו כזה — תגיד לי ואדריך ליצור אותו.

עד שלב 6 האפליקציה עובדת מצוין; האימות רק מסיר את סרגל הכתובת ומשדרג את חוויית ה"אפליקציה".

## הערת אבטחה

הכניסה היא Anonymous Auth + בדיקת PIN/קוד בצד הלקוח — מתאים לפלטפורמה אישית בקנה מידה קטן.
המשמעות: מי שמכיר את כתובת האתר יכול טכנית לגשת לנתונים דרך ה-API אם יתאמץ.
לנעילה חזקה בעתיד: כניסת מאמן עם אימייל+סיסמה וחוקים שמגבילים כתיבה לפי UID — שדרוג פשוט יחסית.
