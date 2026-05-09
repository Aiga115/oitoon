import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.root}>
      <BookOpen size={56} className={styles.icon} />
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>Page not found</p>
      <Link href="/" className={styles.back}>
        <ArrowLeft size={14} />
        Go home
      </Link>
    </div>
  );
}
