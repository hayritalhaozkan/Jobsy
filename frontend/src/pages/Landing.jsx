import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <Navbar />

      <section style={styles.heroSection}>
        <div style={styles.heroGlowOne} />
        <div style={styles.heroGlowTwo} />

        <div style={styles.heroContent}>
          <div style={styles.badge}>Yeni nesil kampüs iş deneyimi</div>

          <h1 style={styles.title}>
            Üniversite çevresindeki
            <br />
            fırsatlara daha hızlı ulaş.
          </h1>

          <p style={styles.subtitle}>
            Jobsy, öğrencileri kampüs çevresindeki part-time iş fırsatlarıyla
            buluşturur; işverenlerin ise doğru üniversite kitlesine kolayca
            ulaşmasını sağlar.
          </p>

          <div style={styles.ctaRow}>
            <button
              style={styles.primaryButton}
              onClick={() => navigate("/register?role=STUDENT")}
            >
              Öğrenci Olarak Başla
            </button>

            <button
              style={styles.secondaryButton}
              onClick={() => navigate("/register?role=EMPLOYER")}
            >
              İşveren Olarak Başla
            </button>
          </div>

          <div style={styles.heroStats}>
            <div style={styles.statBox}>
              <div style={styles.statValue}>Üniversite</div>
              <div style={styles.statLabel}>
                Kampüs bazlı iş keşfi için tasarlandı
              </div>
            </div>

            <div style={styles.statBox}>
              <div style={styles.statValue}>Hızlı</div>
              <div style={styles.statLabel}>
                Öğrenci ve işveren için sade akış
              </div>
            </div>

            <div style={styles.statBox}>
              <div style={styles.statValue}>Odaklı</div>
              <div style={styles.statLabel}>
                Üniversite çevresine özel ilan deneyimi
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.roleSection}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionEyebrow}>Sana uygun başlangıç</div>
          <h2 style={styles.sectionTitle}>Platformu nasıl kullanmak istiyorsun?</h2>
          <p style={styles.sectionText}>
            İster öğrenci olarak sana yakın fırsatları keşfet, ister işveren
            olarak hedeflediğin üniversite kitlesine ulaş.
          </p>
        </div>

        <div style={styles.roleGrid}>
          <div
            style={styles.roleCard}
            onClick={() => navigate("/register?role=STUDENT")}
          >
            <div style={styles.roleIconWrap}>
              <span className="material-symbols-rounded" style={styles.roleIcon}>
                school
              </span>
            </div>

            <h3 style={styles.roleTitle}>Öğrenciyim</h3>
            <p style={styles.roleText}>
              Üniversitene yakın yarı zamanlı iş ilanlarını keşfet, detayları
              incele ve hızlıca iletişime geç.
            </p>
            <div style={styles.roleLink}>Öğrenci hesabı oluştur →</div>
          </div>

          <div
            style={styles.roleCard}
            onClick={() => navigate("/register?role=EMPLOYER")}
          >
            <div style={styles.roleIconWrap}>
              <span className="material-symbols-rounded" style={styles.roleIcon}>
                apartment
              </span>
            </div>

            <h3 style={styles.roleTitle}>İşverenim</h3>
            <p style={styles.roleText}>
              İlan oluştur, doğru üniversite kitlesine ulaş ve kampüs
              çevresindeki adaylarla doğrudan iletişim kur.
            </p>
            <div style={styles.roleLink}>İşveren hesabı oluştur →</div>
          </div>
        </div>
      </section>

      <section style={styles.featureSection}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionEyebrow}>Neden Jobsy?</div>
          <h2 style={styles.sectionTitle}>Kampüs odaklı, sade ve etkili</h2>
        </div>

        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureTitle}>Üniversite bazlı deneyim</div>
            <div style={styles.featureText}>
              Kullanıcılar doğrudan kendi üniversite çevresine uygun ilanlara
              odaklanır.
            </div>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureTitle}>Hızlı iletişim akışı</div>
            <div style={styles.featureText}>
              Başvuru süreçlerini uzatmadan, işverenle doğrudan temas
              kurulabilir.
            </div>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureTitle}>Temiz arayüz</div>
            <div style={styles.featureText}>
              Gereksiz karmaşa olmadan, kullanıcıyı asıl aksiyona götüren sade
              bir ürün akışı sunar.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8fafc 0%, #eef4ff 35%, #ffffff 100%)",
  },

heroSection: {
  position: "relative",
  overflow: "hidden",
  padding: "140px 24px 56px",
},

  heroGlowOne: {
    position: "absolute",
    width: "420px",
    height: "420px",
    borderRadius: "999px",
    background: "rgba(99, 102, 241, 0.16)",
    filter: "blur(70px)",
    top: "-80px",
    left: "-80px",
    pointerEvents: "none",
  },

  heroGlowTwo: {
    position: "absolute",
    width: "380px",
    height: "380px",
    borderRadius: "999px",
    background: "rgba(14, 165, 233, 0.14)",
    filter: "blur(70px)",
    right: "-60px",
    top: "40px",
    pointerEvents: "none",
  },

  heroContent: {
    position: "relative",
    maxWidth: "1080px",
    margin: "0 auto",
    textAlign: "center",
  },

  badge: {
    display: "inline-block",
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
    fontSize: "clamp(40px, 8vw, 84px)",
    lineHeight: 1.02,
    letterSpacing: "-0.04em",
    fontWeight: 800,
    color: "#0f172a",
  },

  subtitle: {
    maxWidth: "760px",
    margin: "24px auto 0",
    fontSize: "clamp(17px, 2vw, 22px)",
    lineHeight: 1.7,
    color: "#475569",
  },

  ctaRow: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
    marginTop: "32px",
  },

  primaryButton: {
    border: "none",
    borderRadius: "999px",
    padding: "15px 24px",
    background: "linear-gradient(135deg, #4f46e5, #0ea5e9)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(79, 70, 229, 0.28)",
  },

  secondaryButton: {
    border: "1px solid rgba(15, 23, 42, 0.08)",
    borderRadius: "999px",
    padding: "15px 24px",
    background: "rgba(255,255,255,0.78)",
    color: "#0f172a",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
  },

  heroStats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginTop: "48px",
  },

  statBox: {
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(255,255,255,0.8)",
    borderRadius: "24px",
    padding: "22px 20px",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
    textAlign: "left",
  },

  statValue: {
    fontSize: "24px",
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: "8px",
  },

  statLabel: {
    color: "#64748b",
    lineHeight: 1.6,
    fontSize: "14px",
  },

  roleSection: {
    maxWidth: "1080px",
    margin: "0 auto",
    padding: "36px 24px 24px",
  },

  sectionHeader: {
    textAlign: "center",
    maxWidth: "740px",
    margin: "0 auto 30px",
  },

  sectionEyebrow: {
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#6366f1",
    marginBottom: "10px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "clamp(28px, 4vw, 48px)",
    lineHeight: 1.1,
    letterSpacing: "-0.03em",
    color: "#0f172a",
  },

  sectionText: {
    marginTop: "14px",
    color: "#64748b",
    fontSize: "17px",
    lineHeight: 1.7,
  },

  roleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },

  roleCard: {
    background: "rgba(255,255,255,0.88)",
    border: "1px solid rgba(15, 23, 42, 0.06)",
    borderRadius: "28px",
    padding: "28px",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.07)",
    cursor: "pointer",
  },

  roleIconWrap: {
    width: "64px",
    height: "64px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(109,40,217,0.12))",
    marginBottom: "16px",
  },

  roleIcon: {
    fontSize: "34px",
    color: "#4f46e5",
  },

  roleTitle: {
    margin: "0 0 10px",
    fontSize: "28px",
    color: "#0f172a",
  },

  roleText: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.7,
    minHeight: "72px",
  },

  roleLink: {
    marginTop: "20px",
    fontWeight: 700,
    color: "#334155",
  },

  featureSection: {
    maxWidth: "1080px",
    margin: "0 auto",
    padding: "40px 24px 90px",
  },

  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
  },

  featureCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)",
  },

  featureTitle: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: "10px",
  },

  featureText: {
    color: "#64748b",
    lineHeight: 1.7,
  },
};

export default Landing;