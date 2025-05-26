import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.scss";

const ThemeToggle = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light"
    );
  }, [dark]);

  return (
    <button
      className={styles.toggle}
      onClick={() => setDark(!dark)}
      style={{ position: "absolute", top: 20, right: 20 }}
    >
      {dark ? "Light" : "Dark"}
    </button>
  );
};

export default ThemeToggle;
