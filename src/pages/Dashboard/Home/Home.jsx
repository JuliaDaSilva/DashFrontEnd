import { useAuth } from "../../../context/AuthContext";
import styles from "./Home.module.css";

const Home = () => {
  const { user } = useAuth();
  const firstName = user?.firstName || "user name";

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>Home</h2>
        <div className={styles.divider}></div>
        <h1 className={styles.greeting}>Hi, {firstName}!</h1>
        <p className={styles.welcome}>Welcome to ElleHacks 2026</p>
        <p className={styles.description}>
          ElleHacks 2026 is a free, student-run, and beginner-friendly hackathon that serves
          as a canvas to pitch bold solutions to global challenges, participate in
          engaging workshops, and connect with a diverse community of recruiters,
          industry professionals, and peers.
        </p>

        <p className={styles.description}>
          To get started, click on the <strong>"Application Form"</strong> to submit your
          hacker application. Once submitted, you’ll be able to track the status of
          your application.
        </p>

        <p className={styles.description}>
          Once applications close, we’ll review your submission. Keep an eye on your email for updates and next steps.
        </p>


      </div>
    </div>
  );
};

export default Home;