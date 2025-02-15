import Hero from "../../components/Hero/hero";
import styles from "./home.module.css";
import LastReleases from "../../components/Anime/LastReleases/lastReleases";
import Popular from "../../components/Anime/Popular/popular";

export default function Home() {
  return (
    <div className={styles.container}>
      <Hero />
      <LastReleases />
      <Popular />
    </div>
  );
}
