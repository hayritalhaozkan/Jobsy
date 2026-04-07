import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchEmployerJobs, deactivateJob, activateJob } from "../api/jobs";

function EmployerJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  async function loadJobs() {
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

      const data = await fetchEmployerJobs();
      setJobs(data);
    } catch (err) {
      console.error("Employer jobs fetch error:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "İlanlar alınamadı.";

      setErrorText(message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function handleDeactivate(id) {
    try {
      await deactivateJob(id);
      await loadJobs();
    } catch (err) {
      console.error("Deactivate error:", err);
      alert("İlan pasife alınamadı.");
    }
  }

  async function handleActivate(id) {
    try {
      await activateJob(id);
      await loadJobs();
    } catch (err) {
      console.error("Activate error:", err);
      alert("İlan aktifleştirilemedi.");
    }
  }

  function handleEdit(id) {
    navigate(`/employer/jobs/${id}/edit`);
  }

  function handleCreate() {
    navigate("/employer/jobs/new");
  }

  return (
    <div style={styles.page}>
      <Navbar />

      <main style={styles.main}>
        <div style={styles.container}>
          <div style={styles.headerRow}>
            <div>
              <h1 style={styles.title}>İlanlarım</h1>
              <p style={styles.subtitle}>
                Oluşturduğun ilanları yönet, düzenle ve aktif/pasif durumunu
                kontrol et.
              </p>
            </div>

            <button className="btn-primary" onClick={handleCreate}>
              + Yeni İlan
            </button>
          </div>

          {loading ? (
            <div style={styles.stateBox}>İlanlar yükleniyor...</div>
          ) : errorText ? (
            <div style={styles.errorBox}>{errorText}</div>
          ) : jobs.length === 0 ? (
            <div style={styles.emptyCard}>
              <div style={styles.emptyTitle}>Henüz ilanın yok</div>
              <div style={styles.emptyText}>
                İlk ilanını oluşturarak işveren panelini kullanmaya
                başlayabilirsin.
              </div>

              <button className="btn-primary" onClick={handleCreate}>
                İlk İlanı Oluştur
              </button>
            </div>
          ) : (
            <div style={styles.list}>
              {jobs.map((job) => (
                <div key={job.id} style={styles.card}>
                  <div style={styles.cardTop}>
                    <div>
                      <div style={styles.cardTitle}>{job.title}</div>
                      <div style={styles.cardMeta}>
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

                  <div style={styles.description}>
                    {job.description?.length > 180
                      ? `${job.description.slice(0, 180)}...`
                      : job.description}
                  </div>

                  <div style={styles.infoRow}>
                    {job.salary && (
                      <div style={styles.infoItem}>
                        <span
                          className="material-symbols-rounded"
                          style={styles.infoIcon}
                        >
                          payments
                        </span>
                        {job.salary}
                      </div>
                    )}

                    {job.work_schedule && (
                      <div style={styles.infoItem}>
                        <span
                          className="material-symbols-rounded"
                          style={styles.infoIcon}
                        >
                          schedule
                        </span>
                        {job.work_schedule}
                      </div>
                    )}

                    {job.address && (
                      <div style={styles.infoItem}>
                        <span
                          className="material-symbols-rounded"
                          style={styles.infoIcon}
                        >
                          location_on
                        </span>
                        {job.address}
                      </div>
                    )}
                  </div>

                  <div style={styles.actions}>
                    <button
                      className="btn-secondary"
                      onClick={() => handleEdit(job.id)}
                    >
                      Düzenle
                    </button>

                    {job.is_active ? (
                      <button
                        className="btn-ghost"
                        onClick={() => handleDeactivate(job.id)}
                      >
                        Pasife Al
                      </button>
                    ) : (
                      <button
                        className="btn-primary btn-sm"
                        onClick={() => handleActivate(job.id)}
                      >
                        Aktifleştir
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
    maxWidth: "1320px",
    margin: "0 auto",
    padding: "0 24px",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "24px",
    flexWrap: "wrap",
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

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  card: {
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(226,232,240,0.95)",
    borderRadius: "24px",
    padding: "22px",
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.06)",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "14px",
  },

  cardTitle: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#0f172a",
    lineHeight: 1.15,
  },

  cardMeta: {
    marginTop: "8px",
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

  description: {
    color: "#475569",
    lineHeight: 1.75,
    marginBottom: "16px",
  },

  infoRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "18px",
  },

  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#64748b",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "999px",
    padding: "8px 12px",
    fontSize: "14px",
  },

  infoIcon: {
    fontSize: "18px",
    color: "#6366f1",
  },

  actions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
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

  emptyCard: {
    background: "rgba(255,255,255,0.88)",
    border: "1px solid rgba(226,232,240,0.95)",
    borderRadius: "24px",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.06)",
    alignItems: "flex-start",
  },

  emptyTitle: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#0f172a",
  },

  emptyText: {
    color: "#64748b",
    lineHeight: 1.7,
    maxWidth: "640px",
  },
};

export default EmployerJobs;