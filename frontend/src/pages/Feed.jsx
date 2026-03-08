import { useEffect, useState } from "react";
import { fetchJobsByUniversity } from "../api/jobs";
import { fetchUniversities } from "../api/universities";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import UniversityFilterBar from "../components/UniversityFilterBar";

function Feed() {
  const [jobs, setJobs] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [selectedUniversityId, setSelectedUniversityId] = useState(3);
  const [loading, setLoading] = useState(true);

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
            <h1 style={styles.title}>İlanlar</h1>
            <p style={styles.subtitle}>
              Üniversitene göre part-time ve kampüs çevresi fırsatlarını keşfet.
            </p>
          </div>

          <UniversityFilterBar
            universities={universities}
            selectedUniversityId={selectedUniversityId}
            onChange={setSelectedUniversityId}
          />

          {loading ? (
            <div style={styles.stateBox}>İlanlar yükleniyor...</div>
          ) : jobs.length === 0 ? (
            <div style={styles.stateBox}>
              Bu üniversite için henüz aktif ilan bulunmuyor.
            </div>
          ) : (
            <div style={styles.grid}>
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
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
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "0 24px",
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

  stateBox: {
    background: "rgba(255,255,255,0.82)",
    border: "1px solid rgba(226,232,240,0.9)",
    borderRadius: "20px",
    padding: "24px",
    color: "#475569",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
  },
};

export default Feed;