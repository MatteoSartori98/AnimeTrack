import { Link } from "react-router";
import styles from "./authStyle.module.css";
import supabase from "../../supabase/client";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import Banner from "../../components/Banner/banner";

export default function SignIn() {
  const [dataa, setData] = useState("");

  async function handleSignIn(event) {
    event.preventDefault();
    const formLogin = event.currentTarget;
    const { email, password } = Object.fromEntries(new FormData(formLogin));
    let { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      formLogin.reset();
      toast.error("Accesso fallito.");
    } else {
      formLogin.reset();
      toast.success("Accesso avvenuto con successo!");
    }
    setData(data);
  }

  return (
    <>
      <Banner />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>Login</h1>
          </div>

          <form onSubmit={handleSignIn}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input type="email" name="email" id="email" placeholder="Inserisci email" className={styles.input} />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelRow}>
                <label className={styles.label}>Password</label>
                <a href="#forgot" className={styles.forgotLink}>
                  Password dimenticata?
                </a>
              </div>
              <input type="password" name="password" id="password" placeholder="Inserisci password" className={styles.input} />
            </div>

            <div className={styles.checkboxGroup}>
              <input type="checkbox" id="stay-signed-in" className={styles.checkbox} />
              <label htmlFor="stay-signed-in" className={styles.checkboxLabel}>
                Ricordami
              </label>
            </div>

            <button type="submit" className={styles.button}>
              Accedi
            </button>
          </form>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              Non hai un account?
              <Link to="/register" className={styles.signupLink}>
                <span> Crea account</span>
              </Link>
            </p>
          </div>
        </div>
        <Toaster
          containerStyle={{
            top: 85,
            right: 0,
          }}
          position="bottom-center"
          reverseOrder={false}
          style={{ marginTop: "50px" }}
        />
      </div>
    </>
  );
}
