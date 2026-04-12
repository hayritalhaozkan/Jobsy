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
            <div style={styles.stateBox}>İlanlar yükleniyor...</div>
          ) : jobs.length === 0 ? (
            <div style={styles.stateBox}>
              Bu üniversite için henüz aktif ilan bulunmuyor.
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

  stateBox: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "32px",
    textAlign: "center",
    color: "#64748b",
  },
};

export default Feed;