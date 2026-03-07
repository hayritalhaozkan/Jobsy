import { Link, useNavigate } from "react-router-dom";
import jobsyLogo from "../assets/jobsy-logo.png";

function Navbar() {
  const navigate = useNavigate();

  return (
    <div style={styles.outer}>
      <header style={styles.floatingIsland}>
        <Link to="/" style={styles.brandWrap}>
          <img
            src={jobsyLogo}
            alt="Jobsy Logo"
            style={styles.logoImage}
            draggable="false"
          />
        </Link>

        <div style={styles.actions}>
          <button style={styles.textButton} onClick={() => navigate("/login")}>
            Giriş Yap
          </button>

          <button
            style={styles.primaryButton}
            onClick={() => navigate("/register")}
          >
            Kayıt Ol
          </button>
        </div>
      </header>
    </div>
  );
}

const styles = {
  outer: {
    position: "fixed",
    top: "18px",
    left: 0,
    right: 0,
    zIndex: 100,
    display: "flex",
    justifyContent: "center",
    pointerEvents: "none",
  },

  floatingIsland: {
    width: "min(1180px, calc(100% - 32px))",
    height: "72px",
    padding: "0 18px",
    borderRadius: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    background: "rgba(255, 255, 255, 0.58)",
    border: "1px solid rgba(255, 255, 255, 0.55)",
    backdropFilter: "blur(22px) saturate(160%)",
    WebkitBackdropFilter: "blur(22px) saturate(160%)",

    boxShadow:
      "0 10px 30px rgba(15, 23, 42, 0.10), inset 0 1px 0 rgba(255,255,255,0.35)",

    pointerEvents: "auto",
  },

  brandWrap: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
    WebkitUserSelect: "none",
    textDecoration: "none",
  },

  logoImage: {
    height: "150px",
    width: "auto",
    objectFit: "contain",
    cursor: "pointer",
    userSelect: "none",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.08))",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  textButton: {
    border: "none",
    background: "transparent",
    color: "#334155",
    fontWeight: 600,
    cursor: "pointer",
    padding: "10px 14px",
    borderRadius: "12px",
    transition: "background 0.2s ease",
  },

  primaryButton: {
    border: "1px solid rgba(255,255,255,0.45)",
    background: "rgba(255,255,255,0.62)",
    color: "#0f172a",
    borderRadius: "16px",
    padding: "12px 18px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
};

export default Navbar;