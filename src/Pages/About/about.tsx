// src/pages/About.tsx
import { Card, Button } from "flowbite-react";
import { Link } from "react-router-dom";


/**
 * דף אודות – מסביר בקצרה על כל לשונית בתפריט הראשי
 * Tailwind + Flowbite, RTL מלא, טקסט בעברית.
 */
const About = () => {
  /** תיאור טקסטואלי של כל פריט תפריט */
  const menuItems = [
    {
      id: "home",
      title: "בית",
      desc: "המסך הראשי – מציג את כל כרטיסי הביקור, חיפוש בזמן-אמת ופעולות \"אהבתי\".",
    },
    {
      id: "signin",
      title: "כניסה",
      desc: "טופס התחברות למשתמשים קיימים. לאחר אימות מתקבל אסימון (JWT) ושירותי המערכת נפתחים עבורך.",
    },
    {
      id: "signup",
      title: "הרשמה",
      desc: "פתיחת חשבון חדש (משתמש רגיל / עסקי). כולל בדיקות וחיווי שגיאות ידידותי.",
    },
    {
      id: "signout",
      title: "יציאה",
      desc: "התנתקות מלאה: ניקוי הטוקן מה-LocalStorage ואיפוס ה-Redux.\nהעמוד חוזר למצב אורח.",
    },
    {
      id: "profile",
      title: "פרופיל",
      desc: "ניהול פרטי המשתמש, שינוי סיסמה ומעקב אחר הכרטיסים שיצרת או סימנת.",
    },
    {
      id: "favourites",
      title: "מועדפים",
      desc: "רשימת כל הכרטיסים שסימנת ♥. ניתן להסיר לב בלחיצה אחת.",
    },
    {
      id: "about",
      title: "אודות",
      desc: "העמוד הנוכחי – מידע רחב על האפליקציה, הגדרות נגישות והסברים טכניים.",
    },
  ];

  return (
    <>
  
      <main dir="rtl" className="flex flex-col items-center gap-10 px-4 py-12">
        <header className="max-w-2xl space-y-4 text-center">
          <h1 className="text-4xl font-extrabold text-cyan-700">
            ברוכים הבאים לעמוד האודות
          </h1>
          <p className="leading-relaxed text-gray-600">
            כאן תמצאו פירוט קצר על כל לשונית בתפריט הראשי של האפליקציה וכיצד
            היא תסייע לכם להתמצא במערכת.
          </p>
        </header>

        {/* גריד כרטיסים – אחד לכל פריט תפריט */}
        <section className="grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map(({ id, title, desc }) => (
            <Card
              key={id}
              className="h-full rounded-xl shadow-md transition-shadow hover:shadow-lg"
            >
              <h3 className="text-2xl font-semibold text-cyan-700">{title}</h3>
              <p className="whitespace-pre-line text-gray-700">{desc}</p>
            </Card>
          ))}
        </section>

        {/* כפתור חזרה */}
        <Button as={Link} to="/" size="lg" color="light">
          חזרה לדף הבית
        </Button>
      </main>
    </>
  );
};

export default About;
