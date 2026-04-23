import { Link, useLocation, useNavigate } from "react-router-dom";
import jobsyLogo from "../assets/jobsy-logo.png";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
    setDropdownOpen(false);
    navigate("/login");
  }

  return (
    <div style={styles.outer}>
      <header style={styles.header}>
        <div style={styles.left}>
          <Link to="/" style={styles.brandWrap}>
            <img
              src={jobsyLogo}
              alt="Jobsy Logo"
              style={styles.logoImage}
              draggable="false"
            />
          </Link>

          <nav style={styles.navLinks}>
            {/* İsStudent İş İlanları butonu sağ tarafa taşındı */}
            {/* isEmployer butonları da sağ tarafa taşındı */}
          </nav>
        </div>

        <div style={styles.right}>
          {!isAuthenticated ? (
            <>
            <button className="nav-auth-btn" onClick={() => navigate("/login")}>
                Giriş Yap
              </button>
              <button className="nav-auth-btn" onClick={() => navigate("/register")}>
                Kayıt Ol
              </button>
            </>
          ) : (
            <div style={styles.userSection}>
              {isStudent && (
                <button
                  style={{
                    backgroundColor: "transparent",
                    color: "var(--primary)",
                    border: "2px solid var(--primary)",
                    borderRadius: "8px",
                    padding: "6px 16px",
                    fontWeight: "700",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--primary)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--primary)";
                  }}
                  onClick={() => navigate("/feed")}
                >
                  İş İlanları
                </button>
              )}

              {isEmployer && (
                <>
                  <button
                    style={{
                      backgroundColor: location.pathname === "/employer/dashboard" ? "var(--primary)" : "transparent",
                      color: location.pathname === "/employer/dashboard" ? "#fff" : "var(--primary)",
                      border: "2px solid var(--primary)",
                      borderRadius: "8px",
                      padding: "6px 16px",
                      fontWeight: "700",
                      fontSize: "14px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (location.pathname !== "/employer/dashboard") {
                        e.currentTarget.style.backgroundColor = "var(--primary)";
                        e.currentTarget.style.color = "#fff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (location.pathname !== "/employer/dashboard") {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "var(--primary)";
                      }
                    }}
                    onClick={() => navigate("/employer/dashboard")}
                  >
                    Panel
                  </button>
                  <button
                    style={{
                      backgroundColor: location.pathname === "/employer/jobs" ? "var(--primary)" : "transparent",
                      color: location.pathname === "/employer/jobs" ? "#fff" : "var(--primary)",
                      border: "2px solid var(--primary)",
                      borderRadius: "8px",
                      padding: "6px 16px",
                      fontWeight: "700",
                      fontSize: "14px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (location.pathname !== "/employer/jobs") {
                        e.currentTarget.style.backgroundColor = "var(--primary)";
                        e.currentTarget.style.color = "#fff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (location.pathname !== "/employer/jobs") {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "var(--primary)";
                      }
                    }}
                    onClick={() => navigate("/employer/jobs")}
                  >
                    İlanlarım
                  </button>
                </>
              )}

              <div style={styles.profileWrapper}>
                <div style={styles.profileBtn} onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <div style={styles.avatar}>
                    <span className="material-symbols-rounded" style={styles.avatarIcon}>person</span>
                  </div>
                  <span style={styles.userName}>{user.name || user.email || 'Kullanıcı'}</span>
                  <span className="material-symbols-rounded" style={styles.chevron}>
                    expand_more
                  </span>
                </div>

                {dropdownOpen && (
                  <div style={styles.dropdown}>
                    {isStudent && (
                      <>
                        <div style={styles.dropdownItem} onClick={() => { setDropdownOpen(false); navigate("/profile"); }}>
                          Profilim
                        </div>
                        <div style={styles.dropdownItem} onClick={() => { setDropdownOpen(false); navigate("/saved-jobs"); }}>
                          Kaydedilen İlanlar
                        </div>
                      </>
                    )}
                    <div style={styles.dropdownSeparator}></div>
                    <div style={styles.dropdownItem} onClick={handleLogout}>
                      Çıkış Yap
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

const styles = {
  outer: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: "#ffffff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },

  header: {
    maxWidth: "1320px",
    margin: "0 auto",
    height: "70px",
    padding: "0 8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
  },

  brandWrap: {
    display: "flex",
    alignItems: "center",
  },

  logoImage: {
    height: "150px",
    width: "auto",
    objectFit: "contain",
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  navLink: {
    background: "none",
    border: "none",
    color: "#334155",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    padding: "8px 12px",
    transition: "color 0.2s",
    fontFamily: "inherit"
  },

  navLinkActive: {
    color: "var(--primary)",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },

  iconBtn: {
    position: "relative",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
  },

  iconText: {
    fontSize: "24px",
  },

  notificationBadge: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    background: "var(--primary)",
    color: "#fff",
    fontSize: "10px",
    fontWeight: "bold",
    height: "16px",
    minWidth: "16px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 4px",
  },

  profileWrapper: {
    position: "relative",
  },

  profileBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },

  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarIcon: {
    fontSize: "20px",
    color: "#94a3b8",
  },

  userName: {
    fontWeight: "600",
    fontSize: "14px",
    color: "#334155",
  },

  chevron: {
    fontSize: "18px",
    color: "#64748b",
  },

  dropdown: {
    position: "absolute",
    top: "calc(100% + 15px)",
    right: 0,
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    minWidth: "220px",
    padding: "8px 0",
    zIndex: 101,
  },

  dropdownItem: {
    padding: "12px 20px",
    fontSize: "14px",
    color: "#334155",
    cursor: "pointer",
    transition: "background 0.2s",
  },

  dropdownSeparator: {
    height: "1px",
    background: "#e2e8f0",
    margin: "4px 0",
  }
};

export default Navbar;