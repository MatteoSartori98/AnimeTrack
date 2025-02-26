import { Github, Mail } from "lucide-react";
import styles from "./footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.links}>
            <a href="sartorimatteo1205@gmail.com" className={styles.link}>
              <Mail />
              sartorimatteo1205@gmail.com
            </a>
            <a href="https://github.com/matteosartori" target="_blank" rel="noopener noreferrer" className={styles.link}>
              <Github />
              GitHub
            </a>
          </div>
          <div className={styles.signature}>
            Creato con <span className={styles.heart}>❤</span> da Matteo Sartori
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
