import { Link, useLocation, useNavigate } from "react-router-dom";
import jobsyLogo from "../assets/jobsy-logo.png";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  let user = null;
  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch {
    user = null;
  }

  const isAuthenticated = Boolean(token && user);
  const isEmployer = user?.role === "EMPLOYER";
  const isStudent = user?.role === "STUDENT";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

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
          {!isAuthenticated ? (
            <>
              <button
                className="nav-btn-text"
                onClick={() => navigate("/login")}
              >
                Giriş Yap
              </button>

              <button
                className="nav-btn-primary"
                onClick={() => navigate("/register")}
              >
                Kayıt Ol
              </button>
            </>
          ) : (
            <>
              {isStudent && (
                <button
                  className={`nav-btn-text ${location.pathname === "/feed" ? "active" : ""}`}
                  onClick={() => navigate("/feed")}
                >
                  İlanlar
                </button>
              )}

              {isEmployer && (
                <>
                  <button
                    className={`nav-btn-text ${location.pathname === "/employer/dashboard" ? "active" : ""}`}
                    onClick={() => navigate("/employer/dashboard")}
                  >
                    Panel
                  </button>

                  <button
                    className={`nav-btn-text ${location.pathname === "/employer/jobs" ? "active" : ""}`}
                    onClick={() => navigate("/employer/jobs")}
                  >
                    İlanlarım
                  </button>
                </>
              )}

              <button className="nav-btn-primary" onClick={handleLogout}>
                Çıkış Yap
              </button>
            </>
          )}
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
    width: "min(1320px, calc(100% - 32px))",
    height: "72px",
    padding: "0 24px",
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
};

export default Navbar;