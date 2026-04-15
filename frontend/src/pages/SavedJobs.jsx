import { useEffect, useState } from "react";
import { fetchSavedJobs } from "../api/jobs";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import JobDetailModal from "../components/JobDetailModal";

function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobIdForModal, setSelectedJobIdForModal] = useState(null);

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);
        const jobsData = await fetchSavedJobs();
        setJobs(jobsData);
      } catch (err) {
        console.error("Saved jobs fetch error:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  return (
    <div style={styles.page}>
      <Navbar />

      <main style={styles.main}>
        <div style={styles.container}>
          <div style={styles.headerBlock}>
            <h1 style={styles.title}>Kaydedilen İlanlar</h1>
            <p style={styles.subtitle}>
              İlgini çektiği için kaydettiğin tüm fırsatlar burada.
            </p>
          </div>

          <div style={{ marginTop: '2rem' }}>
            {loading ? (
              <div style={styles.stateWrapper}>
                <span className="material-symbols-rounded" style={{...styles.stateIcon, animation: 'spin 1s linear infinite'}}>refresh</span>
                <h3 style={styles.stateTitle}>Yükleniyor...</h3>
                <p style={styles.stateText}>Kaydedilen ilanlar getiriliyor, lütfen bekleyin.</p>
              </div>
            ) : jobs.length === 0 ? (
              <div style={styles.stateWrapper}>
                <span className="material-symbols-rounded" style={styles.stateIcon}>bookmark_border</span>
                <h3 style={styles.stateTitle}>Henüz İlan Kaydetmedin</h3>
                <p style={styles.stateText}>
                  İlanları incelerken ilgini çeken fırsatları kaydet butonuna basarak buraya ekleyebilirsin.
                </p>
              </div>
            ) : (
              <div style={styles.grid}>
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} onClick={(id) => setSelectedJobIdForModal(id)} />
                ))}
              </div>
            )}
          </div>

          {selectedJobIdForModal && (
             <JobDetailModal 
                jobId={selectedJobIdForModal} 
                onClose={() => setSelectedJobIdForModal(null)} 
             />
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
    padding: "0 16px",
  },
  headerBlock: {
    marginBottom: "18px",
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
    maxWidth: "700px",
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  stateWrapper: {
    background: "rgba(255,255,255,0.8)",
    border: "2px dashed #cbd5e1",
    borderRadius: "24px",
    padding: "100px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  stateIcon: {
    fontSize: "64px",
    color: "#94a3b8",
    marginBottom: "24px",
    background: "#f1f5f9",
    padding: "24px",
    borderRadius: "50%",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
  },
  stateTitle: {
    margin: "0 0 12px 0",
    fontSize: "24px",
    fontWeight: "700",
    color: "#334155",
  },
  stateText: {
    margin: 0,
    fontSize: "16px",
    color: "#64748b",
    maxWidth: "400px",
    lineHeight: "1.6",
  },
};

export default SavedJobs;
