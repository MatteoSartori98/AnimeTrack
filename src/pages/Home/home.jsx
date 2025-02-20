import Hero from "./Hero/hero";
import styles from "./home.module.css";
import LastReleases from "./LastReleases/lastReleases";
import Popular from "./Popular/popular";

export default function Home() {
  return (
    <div style={{ marginTop: "50px" }} className={styles.container}>
      <Hero />
      <LastReleases />
      <Popular />
    </div>
  );
}
