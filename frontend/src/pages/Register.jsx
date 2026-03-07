import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { fetchUniversities } from "../api/universities";
import { register } from "../api/auth";
import Navbar from "../components/Navbar";

function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole =
    searchParams.get("role") === "EMPLOYER" ? "EMPLOYER" : "STUDENT";

  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUniversities() {
      try {
        const data = await fetchUniversities();
        setUniversities(data);
      } catch (err) {
        console.error("Universities fetch error:", err);
      }
    }

    loadUniversities();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password || !universityId) {
      alert("Lütfen tüm alanları doldur.");
      return;
    }

    try {
      setLoading(true);

      await register({
        email,
        password,
        role,
        universityId: Number(universityId),
      });

      alert("Kayıt başarılı. Şimdi giriş yapabilirsiniz.");
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      alert("Kayıt başarısız.");
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
            <div style={styles.badge}>Hesabını oluştur</div>

            <h1 style={styles.title}>
              Jobsy’ye katıl,
              <br />
              kampüs
              <br />
              çevresindeki
              <br />
              akışa dahil ol.
            </h1>

            <p style={styles.subtitle}>
              İster öğrenci olarak üniversitene yakın fırsatları keşfet, ister
              işveren olarak doğru kitleye hızlıca ulaş.
            </p>

            <div style={styles.infoCards}>
              <div style={styles.infoCard}>
                <div style={styles.infoCardTitle}>Üniversite odaklı yapı</div>
                <div style={styles.infoCardText}>
                  Kayıt sırasında üniversiteni belirle, deneyimini buna göre
                  başlat.
                </div>
              </div>

              <div style={styles.infoCard}>
                <div style={styles.infoCardTitle}>Hızlı başlangıç</div>
                <div style={styles.infoCardText}>
                  Öğrenci ve işveren için sade, anlaşılır ve hızlı bir kayıt
                  akışı.
                </div>
              </div>
            </div>
          </div>

          <div style={styles.formCard}>
            <div style={styles.tabs}>
              <button
                type="button"
                onClick={() => setRole("STUDENT")}
                style={{
                  ...styles.tab,
                  ...(role === "STUDENT" ? styles.activeTab : {}),
                }}
              >
                <span className="material-symbols-rounded" style={styles.tabIcon}>
                  school
                </span>
                Öğrenci
              </button>

              <button
                type="button"
                onClick={() => setRole("EMPLOYER")}
                style={{
                  ...styles.tab,
                  ...(role === "EMPLOYER" ? styles.activeTab : {}),
                }}
              >
                <span className="material-symbols-rounded" style={styles.tabIcon}>
                  apartment
                </span>
                İşveren
              </button>
            </div>

            <h2 style={styles.formTitle}>
              {role === "STUDENT"
                ? "Öğrenci hesabı oluştur"
                : "İşveren hesabı oluştur"}
            </h2>

            <p style={styles.formSubtitle}>
              Bilgilerini gir ve hesabını birkaç adımda tamamla.
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

              <select
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
                style={styles.select}
              >
                <option value="">Üniversite seç</option>
                {universities.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.display_name || uni.name}
                  </option>
                ))}
              </select>

              <button type="submit" style={styles.submitButton} disabled={loading}>
                {loading ? "Kaydediliyor..." : "Kayıt Ol"}
              </button>
            </form>

            <p style={styles.footerText}>
              Zaten hesabın var mı?{" "}
              <Link to="/login" style={styles.link}>
                Giriş yap
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

  tabs: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "22px",
  },

  tab: {
    border: "1px solid rgba(15, 23, 42, 0.08)",
    background: "rgba(248,250,252,0.9)",
    color: "#0f172a",
    borderRadius: "18px",
    padding: "14px 16px",
    cursor: "pointer",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.2s ease",
  },

  activeTab: {
    background: "linear-gradient(135deg, #4f46e5, #0ea5e9)",
    color: "#fff",
    border: "1px solid rgba(79,70,229,0.2)",
    boxShadow: "0 12px 24px rgba(79, 70, 229, 0.22)",
  },

  tabIcon: {
    fontSize: "20px",
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

  select: {
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

export default Register;