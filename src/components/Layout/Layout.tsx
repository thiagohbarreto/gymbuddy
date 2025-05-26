import { ReactNode } from "react";
import styles from "./Layout.module.scss";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>🏋️ GymBuddy</header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        © 2025 - Todos os direitos reservados
      </footer>
    </div>
  );
};

export default Layout;
