import styles from "./hero.module.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { BellPlus, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Link } from "react-router";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContainer}>
        <Link to="/search" style={{ display: "flex", alignItems: "center" }}>
          <button className={styles.callToAction}>
            <ChevronsRight />
            <span>Cerca e aggiungi i tuoi anime preferiti clicca qui!</span>
            <ChevronsLeft />
          </button>
        </Link>
        <Swiper navigation={true} autoplay={{ delay: 3000, disableOnInteraction: false }} modules={[Navigation, Autoplay]} className={styles.swiper}>
          <SwiperSlide>
            <h5 className="">Solo Leveling</h5>
            <img src="/media/solo-leveling.jpg" alt="" />
          </SwiperSlide>
          <SwiperSlide>
            <h5 className="">Black Clover</h5>
            <img src="/media/blackClover.jpeg" alt="" />
          </SwiperSlide>
          <SwiperSlide>
            <h5 className="">Jujutsu Kaisen</h5>
            <img src="/media/jujutsu.jpg" alt="" />
          </SwiperSlide>
          <SwiperSlide>
            <h5 className="">The Promised Neverland</h5>
            <img src="/media/promised.png" alt="" />
          </SwiperSlide>
          <SwiperSlide>
            <h5 className="">Hunter X Hunter</h5>
            <img src="/media/hunter.jpg" alt="" />
          </SwiperSlide>
          <SwiperSlide>
            <h5 className="">Attack on Titan</h5>
            <img src="/media/attack.jpg" alt="" />
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
}
