import { useEffect, useState } from "react";
import { fetchJobsByUniversity } from "../api/jobs";
import { fetchUniversities } from "../api/universities";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import UniversityFilterBar from "../components/UniversityFilterBar";
import JobDetailModal from "../components/JobDetailModal";

function Feed() {
  const [jobs, setJobs] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [selectedUniversityId, setSelectedUniversityId] = useState(3);
  const [loading, setLoading] = useState(true);
  const [selectedJobIdForModal, setSelectedJobIdForModal] = useState(null);

  useEffect(() => {
    async function loadUniversities() {
      try {
        const uniData = await fetchUniversities();
        setUniversities(uniData);
      } catch (err) {
        console.error("Universities fetch error:", err);
      }
    }

    loadUniversities();
  }, []);

  useEffect(() => {
    async function loadJobs() {
      if (!selectedUniversityId) return;

      try {
        setLoading(true);
        const jobsData = await fetchJobsByUniversity(selectedUniversityId);
        setJobs(jobsData);
      } catch (err) {
        console.error("Jobs fetch error:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, [selectedUniversityId]);

  return (
    <div style={styles.page}>
      <Navbar />

      <main style={styles.main}>
        <div style={styles.container}>
          <div style={styles.headerBlock}>
            <h1 style={styles.title}>Tüm İlanlar</h1>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <UniversityFilterBar
              universities={universities}
              selectedUniversityId={selectedUniversityId}
              onChange={setSelectedUniversityId}
            />
          </div>

          {loading ? (
            <div style={styles.stateWrapper}>
              <span className="material-symbols-rounded" style={{...styles.stateIcon, animation: 'spin 1s linear infinite'}}>refresh</span>
              <h3 style={styles.stateTitle}>Yükleniyor...</h3>
              <p style={styles.stateText}>İlanlar getiriliyor, lütfen bekleyin.</p>
            </div>
          ) : jobs.length === 0 ? (
            <div style={styles.stateWrapper}>
              <span className="material-symbols-rounded" style={styles.stateIcon}>search_off</span>
              <h3 style={styles.stateTitle}>İlan Bulunamadı</h3>
              <p style={styles.stateText}>
                Seçili üniversite için şu anda aktif bir iş ilanı bulunmuyor. Lütfen başka bir üniversite filtrelemeyi deneyin.
              </p>
            </div>
          ) : (
            <div style={styles.grid}>
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} onClick={(id) => setSelectedJobIdForModal(id)} />
              ))}
            </div>
          )}

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
    background: "#f1f5f9",
  },

  main: {
    paddingTop: "100px",
    paddingBottom: "60px",
  },

  container: {
    maxWidth: "1320px",
    margin: "0 auto",
    padding: "0 24px",
  },

  headerBlock: {
    marginBottom: "24px",
  },

  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
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

export default Feed;