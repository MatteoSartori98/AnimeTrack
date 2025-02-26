import styles from "./footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.signature}>
            Creato con <span className={styles.heart}>❤</span> da Matteo Sartori
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
