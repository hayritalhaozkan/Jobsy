import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import Navbar from "../components/Navbar";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("Lütfen e-posta ve şifre gir.");
      return;
    }

    try {
      setLoading(true);

      const data = await login({
        email,
        password,
      });

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Giriş başarısız.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.backgroundLayer}>
        <div style={styles.glowOne} />
        <div style={styles.glowTwo} />
        <div style={styles.glowThree} />
      </div>

      <Navbar />

      <section style={styles.heroSection}>
        <div style={styles.wrapper}>
          <div style={styles.left}>
            <div style={styles.badge}>Tekrar hoş geldin</div>

            <h1 style={styles.title}>
              Jobsy hesabına giriş yap,
              <br />
              kampüs çevresindeki
              <br />
              fırsatları keşfet.
            </h1>

            <p style={styles.subtitle}>
              Hesabına giriş yaparak sana uygun akışla devam et.
            </p>

            <div style={styles.infoCards}>
              <div style={styles.infoCard}>
                <div style={styles.infoCardTitle}>Öğrenci akışı</div>
                <div style={styles.infoCardText}>
                  İlanları görüntüle ve üniversitene göre fırsatları keşfet.
                </div>
              </div>

              <div style={styles.infoCard}>
                <div style={styles.infoCardTitle}>İşveren akışı</div>
                <div style={styles.infoCardText}>
                  Panelini aç, ilanlarını yönet ve yeni ilan oluştur.
                </div>
              </div>
            </div>
          </div>

          <div style={styles.formCard}>
            <div style={styles.formTopIconWrap}>
              <span className="material-symbols-rounded" style={styles.formTopIcon}>
                login
              </span>
            </div>

            <h2 style={styles.formTitle}>Giriş Yap</h2>

            <p style={styles.formSubtitle}>
              Hesabına giriş yaparak Jobsy deneyimine devam et.
            </p>

            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                type="email"
                placeholder="E-posta"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />

              <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />

              <button type="submit" style={styles.submitButton} disabled={loading}>
                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </button>
            </form>

            <p style={styles.footerText}>
              Hesabın yok mu?{" "}
              <Link to="/register" style={styles.link}>
                Kayıt ol
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    paddingTop: "110px",
    background:
      "linear-gradient(180deg, #f8fafc 0%, #eef4ff 35%, #ffffff 100%)",
    overflow: "hidden",
  },

  backgroundLayer: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 0,
  },

  glowOne: {
    position: "absolute",
    width: "560px",
    height: "560px",
    borderRadius: "999px",
    background: "rgba(99, 102, 241, 0.16)",
    filter: "blur(95px)",
    top: "-140px",
    left: "-130px",
  },

  glowTwo: {
    position: "absolute",
    width: "520px",
    height: "520px",
    borderRadius: "999px",
    background: "rgba(14, 165, 233, 0.14)",
    filter: "blur(95px)",
    right: "-120px",
    top: "-40px",
  },

  glowThree: {
    position: "absolute",
    width: "520px",
    height: "520px",
    borderRadius: "999px",
    background: "rgba(168, 85, 247, 0.10)",
    filter: "blur(100px)",
    left: "28%",
    bottom: "-180px",
  },

  heroSection: {
    position: "relative",
    zIndex: 1,
    padding: "32px 24px 72px",
  },

  wrapper: {
    position: "relative",
    maxWidth: "1180px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1.05fr 0.95fr",
    gap: "28px",
    alignItems: "stretch",
  },

  left: {
    padding: "16px 8px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },

  badge: {
    display: "inline-block",
    alignSelf: "flex-start",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.7)",
    border: "1px solid rgba(255,255,255,0.8)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    fontSize: "13px",
    fontWeight: 600,
    color: "#334155",
    marginBottom: "20px",
    boxShadow: "0 8px 30px rgba(15, 23, 42, 0.06)",
  },

  title: {
    margin: 0,
    fontSize: "clamp(36px, 6vw, 64px)",
    lineHeight: 1.04,
    letterSpacing: "-0.04em",
    fontWeight: 800,
    color: "#0f172a",
  },

  subtitle: {
    maxWidth: "620px",
    marginTop: "22px",
    marginBottom: "32px",
    fontSize: "18px",
    lineHeight: 1.75,
    color: "#475569",
  },

  infoCards: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginTop: "auto",
  },

  infoCard: {
    background: "rgba(255,255,255,0.74)",
    border: "1px solid rgba(255,255,255,0.78)",
    borderRadius: "22px",
    padding: "20px",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
  },

  infoCardTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: "8px",
  },

  infoCardText: {
    color: "#64748b",
    lineHeight: 1.7,
    fontSize: "14px",
  },

  formCard: {
    background: "rgba(255,255,255,0.82)",
    border: "1px solid rgba(255,255,255,0.85)",
    borderRadius: "30px",
    padding: "28px",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  formTopIconWrap: {
    width: "64px",
    height: "64px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, rgba(79,70,229,0.12), rgba(14,165,233,0.12))",
    marginBottom: "16px",
  },

  formTopIcon: {
    fontSize: "32px",
    color: "#4f46e5",
  },

  formTitle: {
    marginTop: 0,
    marginBottom: "8px",
    fontSize: "30px",
    lineHeight: 1.1,
    letterSpacing: "-0.03em",
    color: "#0f172a",
  },

  formSubtitle: {
    marginTop: 0,
    marginBottom: "18px",
    color: "#64748b",
    lineHeight: 1.7,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  input: {
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid #dbe2ea",
    background: "rgba(255,255,255,0.96)",
    outline: "none",
  },

  submitButton: {
    border: "none",
    background: "linear-gradient(135deg, #4f46e5, #0ea5e9)",
    color: "#fff",
    borderRadius: "18px",
    padding: "14px 18px",
    cursor: "pointer",
    fontWeight: 700,
    marginTop: "6px",
    boxShadow: "0 12px 26px rgba(79, 70, 229, 0.22)",
  },

  footerText: {
    marginTop: "18px",
    fontSize: "14px",
    color: "#6b7280",
  },

  link: {
    color: "#0f172a",
    fontWeight: 700,
  },
};

export default Login;