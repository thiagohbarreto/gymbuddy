import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./HamburgerMenu.module.scss";

const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.menuContainer}>
      {isMobile && (
        <button className={styles.hamburger} onClick={() => setOpen(!open)}>
          ☰
        </button>
      )}

      <div
        className={`${styles.dropdown} ${
          isMobile ? (open ? styles.open : "") : styles.open
        }`}
      >
        <Link to="/" onClick={() => setOpen(false)}>
          Inicial
        </Link>
      </div>
    </div>
  );
};

export default HamburgerMenu;
