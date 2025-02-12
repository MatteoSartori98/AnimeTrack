import React, { lazy, Suspense } from "react";
import Hero from "../../components/Hero/hero";
import styles from "./home.module.css";

const LastReleases = lazy(() =>
  import("../../components/Anime/LastReleases/lastReleases")
);
const Popular = lazy(() => import("../../components/Anime/Popular/popular"));

const LoadingFallback = () => (
  <div className="loading-container">
    <div className="spinner"></div>
  </div>
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <p className="error-text">
            Qualcosa è andato storto. Prova a ricaricare la pagina o riprova più
            tardi
          </p>
        </div>
      );
    }

    // eslint-disable-next-line react/prop-types
    return this.props.children;
  }
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Hero />
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <LastReleases />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Popular />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
