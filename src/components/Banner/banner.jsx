import { useState } from "react";
import styles from "./banner.module.css";
import { useEffect } from "react";

const backgrounds = ["/media/background1.jpeg", "/media/background2.jpg", "/media/background3.png", "/media/background4.jpg", "/media/background5.jpg"];

export default function Banner() {
  const [background, setBackground] = useState("");

  useEffect(() => {
    function randomBackground() {
      const randomIndex = Math.floor(Math.random() * backgrounds.length);

      setBackground(backgrounds[randomIndex]);
    }
    randomBackground();
  }, []);

  return (
    <>
      <div className={styles.banner} style={{ backgroundImage: `url(${background})` }}></div>
      <div className={styles.bannerBackground}></div>
    </>
  );
}
