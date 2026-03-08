import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchEmployerDashboard } from "../api/jobs";

function EmployerDashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setErrorText("");

        const userRaw = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!token || !userRaw) {
          navigate("/login");
          return;
        }

        const user = JSON.parse(userRaw);

        if (user.role !== "EMPLOYER") {
          navigate("/feed");
          return;
        }

        const data = await fetchEmployerDashboard();
        setSummary(data.summary || null);
        setRecentJobs(data.recentJobs || []);
      } catch (err) {
        console.error("Employer dashboard error:", err);

        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Panel verileri alınamadı.";

        setErrorText(message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [navigate]);

  return (
    <div style={styles.page}>
      <Navbar />

      <main style={styles.main}>
        <div style={styles.container}>
          <div style={styles.headerBlock}>
            <h1 style={styles.title}>İşveren Paneli</h1>
            <p style={styles.subtitle}>
              İlan performansını özet olarak görüntüle ve hızlı aksiyonlarla
              yönetimini kolaylaştır.
            </p>
          </div>

          {loading ? (
            <div style={styles.stateBox}>Panel yükleniyor...</div>
          ) : errorText ? (
            <div style={styles.errorBox}>{errorText}</div>
          ) : (
            <>
              <section style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Toplam İlan</div>
                  <div style={styles.statValue}>
                    {Number(summary?.total_jobs || 0)}
                  </div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Aktif İlan</div>
                  <div style={styles.statValue}>
                    {Number(summary?.active_jobs || 0)}
                  </div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Pasif İlan</div>
                  <div style={styles.statValue}>
                    {Number(summary?.passive_jobs || 0)}
                  </div>
                </div>
              </section>

              <section style={styles.quickActions}>
                <button
                  style={styles.primaryButton}
                  onClick={() => navigate("/employer/jobs")}
                >
                  İlanlarımı Gör
                </button>

                <button
                  style={styles.secondaryButton}
                  onClick={() => navigate("/employer/jobs/new")}
                >
                  Yeni İlan Oluştur
                </button>
              </section>

              <section style={styles.recentSection}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>Son İlanlar</h2>
                </div>

                {recentJobs.length === 0 ? (
                  <div style={styles.stateBox}>Henüz ilan bulunmuyor.</div>
                ) : (
                  <div style={styles.recentList}>
                    {recentJobs.map((job) => (
                      <div key={job.id} style={styles.recentCard}>
                        <div>
                          <div style={styles.recentTitle}>{job.title}</div>
                          <div style={styles.recentMeta}>
                            {job.university_name || "Üniversite belirtilmedi"}
                          </div>
                        </div>

                        <div
                          style={{
                            ...styles.statusBadge,
                            ...(job.is_active
                              ? styles.activeBadge
                              : styles.passiveBadge),
                          }}
                        >
                          {job.is_active ? "Aktif" : "Pasif"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8fafc 0%, #eef4ff 35%, #ffffff 100%)",
  },

  main: {
    paddingTop: "110px",
    paddingBottom: "60px",
  },

  container: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "0 24px",
  },

  headerBlock: {
    marginBottom: "24px",
  },

  title: {
    margin: 0,
    fontSize: "clamp(34px, 5vw, 56px)",
    lineHeight: 1.04,
    letterSpacing: "-0.03em",
    color: "#0f172a",
  },

  subtitle: {
    marginTop: "12px",
    marginBottom: 0,
    color: "#64748b",
    fontSize: "17px",
    lineHeight: 1.7,
    maxWidth: "720px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "20px",
  },

  statCard: {
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(226,232,240,0.95)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.06)",
  },

  statLabel: {
    color: "#64748b",
    fontWeight: 600,
    marginBottom: "10px",
  },

  statValue: {
    fontSize: "42px",
    fontWeight: 800,
    color: "#0f172a",
    lineHeight: 1,
  },

  quickActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "28px",
  },

  recentSection: {
    marginTop: "8px",
  },

  sectionHeader: {
    marginBottom: "14px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "24px",
    color: "#0f172a",
  },

  recentList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  recentCard: {
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(226,232,240,0.95)",
    borderRadius: "22px",
    padding: "18px 20px",
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "18px",
  },

  recentTitle: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#0f172a",
  },

  recentMeta: {
    marginTop: "6px",
    color: "#6366f1",
    fontWeight: 600,
  },

  statusBadge: {
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  activeBadge: {
    background: "rgba(16,185,129,0.10)",
    color: "#059669",
  },

  passiveBadge: {
    background: "rgba(148,163,184,0.12)",
    color: "#475569",
  },

  primaryButton: {
    border: "none",
    background: "linear-gradient(135deg,#4f46e5,#0ea5e9)",
    color: "#fff",
    borderRadius: "16px",
    padding: "14px 20px",
    fontWeight: 700,
    boxShadow: "0 10px 24px rgba(79,70,229,0.22)",
    cursor: "pointer",
  },

  secondaryButton: {
    border: "1px solid #dbe2ea",
    background: "#fff",
    color: "#0f172a",
    borderRadius: "16px",
    padding: "14px 20px",
    fontWeight: 700,
    cursor: "pointer",
  },

  stateBox: {
    background: "rgba(255,255,255,0.82)",
    border: "1px solid rgba(226,232,240,0.9)",
    borderRadius: "20px",
    padding: "24px",
    color: "#475569",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
  },

  errorBox: {
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    borderRadius: "20px",
    padding: "24px",
    color: "#be123c",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
  },
};

export default EmployerDashboard;