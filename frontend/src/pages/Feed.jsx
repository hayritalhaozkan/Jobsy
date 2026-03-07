import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJobsByUniversity } from "../api/jobs";
import { fetchUniversities } from "../api/universities";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import UniversityFilterBar from "../components/UniversityFilterBar";

function Feed() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const userRaw = localStorage.getItem("user");

    if (!userRaw) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userRaw);

    if (!user?.universityId) {
      navigate("/register");
      return;
    }

    async function loadPage() {
      try {
        setLoading(true);

        // 1) Üniversiteleri çek
        const uniData = await fetchUniversities();
        setUniversities(uniData);

        // 2) Kullanıcının üniversitesini bul
        const currentUniversity = uniData.find(
          (u) => Number(u.id) === Number(user.universityId)
        );

        setSelectedUniversity(currentUniversity || null);

        // 3) O üniversitenin ilanlarını çek
        const jobsData = await fetchJobsByUniversity(user.universityId);
        setJobs(jobsData);
      } catch (err) {
        console.error("Feed load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, [navigate]);

  async function handleChangeUniversity() {
    const newUniversityId = window.prompt("Yeni üniversite ID gir:");
    if (!newUniversityId) return;

    const selected = universities.find(
      (u) => Number(u.id) === Number(newUniversityId)
    );

    if (!selected) {
      alert("Geçersiz üniversite ID");
      return;
    }

    try {
      setLoading(true);
      setSelectedUniversity(selected);

      const jobsData = await fetchJobsByUniversity(newUniversityId);
      setJobs(jobsData);
    } catch (err) {
      console.error("University switch error:", err);
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

        <div style={styles.header}>
          <h1 style={styles.title}>İlanlar</h1>
          <p style={styles.subtitle}>
            Üniversitene göre part-time fırsatları görüntüle.
          </p>
        </div>

        {loading ? (
          <div>Yükleniyor...</div>
        ) : jobs.length === 0 ? (
          <div style={styles.empty}>
            Bu üniversite için henüz aktif ilan yok.
          </div>
        ) : (
          <div style={styles.grid}>
            {jobs.map((job) => (
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
  header: {
    marginBottom: "16px",
  },
  title: {
    marginBottom: "6px",
  },
  subtitle: {
    marginTop: 0,
    color: "#6b7280",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },
  empty: {
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
    color: "#6b7280",
  },
};

export default Feed;