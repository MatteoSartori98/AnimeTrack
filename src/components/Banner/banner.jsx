import styles from "./banner.module.css";
export default function Banner() {
  const backgrounds = ["/media/background1.jpeg", "/media/background2.jpg", "/media/background3.png", "/media/background4.jpg", "/media/background5.jpg"];

  const randomIndex = Math.floor(Math.random() * backgrounds.length);

  const randomBackground = backgrounds[randomIndex];

  return (
    <>
      <div className={styles.banner} style={{ backgroundImage: `url(${randomBackground})` }}></div>
      <div className={styles.bannerBackground}></div>
    </>
  );
}
