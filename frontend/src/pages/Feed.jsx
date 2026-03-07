import { useEffect, useState } from "react";
import { fetchJobsByUniversity } from "../api/jobs";
import { fetchUniversities } from "../api/universities";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import UniversityFilterBar from "../components/UniversityFilterBar";

function Feed() {
  const [jobs, setJobs] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [loading, setLoading] = useState(true);

  const DEFAULT_UNIVERSITY_ID = 3;

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const uniData = await fetchUniversities();
        setUniversities(uniData);

        const uni = uniData.find(u => Number(u.id) === DEFAULT_UNIVERSITY_ID);
        setSelectedUniversity(uni);

        const jobsData = await fetchJobsByUniversity(DEFAULT_UNIVERSITY_ID);
        setJobs(jobsData);

      } catch (err) {
        console.error("Feed load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleChangeUniversity() {
    const input = window.prompt("Üniversite ID gir:");
    if (!input) return;

    const nextId = Number(input);

    const uni = universities.find(u => Number(u.id) === nextId);
    if (!uni) {
      alert("Üniversite bulunamadı");
      return;
    }

    try {
      setLoading(true);
      setSelectedUniversity(uni);

      const jobsData = await fetchJobsByUniversity(nextId);
      setJobs(jobsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        <UniversityFilterBar
          selectedUniversity={selectedUniversity}
          onChange={handleChangeUniversity}
        />

        <h1>İlanlar</h1>

        {loading ? (
          <div>Yükleniyor...</div>
        ) : jobs.length === 0 ? (
          <div>Bu üniversite için ilan yok</div>
        ) : (
          <div style={styles.grid}>
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  page: {
    maxWidth: "960px",
    margin: "0 auto",
    padding: "24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },
};

export default Feed;