import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchJobsByUniversity } from "../api/jobs";
import { fetchUniversities } from "../api/universities";
import JobCard from "../components/JobCard";
import UniversityFilterBar from "../components/UniversityFilterBar";
import handshakeImg from "../assets/handshake.jpg";

function Landing() {
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const isAuthenticated = Boolean(user);
  const isStudent = user?.role === "STUDENT";
  const isEmployer = user?.role === "EMPLOYER";

  const [jobs, setJobs] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [selectedUniversityId, setSelectedUniversityId] = useState("");
  const [loadingJobs, setLoadingJobs] = useState(false);

  useEffect(() => {
    if (isAuthenticated) return;
    async function loadUniversities() {
      try {
        const uniData = await fetchUniversities();
        setUniversities(uniData);
        if (uniData.length > 0) {
          setSelectedUniversityId(uniData[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadUniversities();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated || !selectedUniversityId) return;
    async function loadJobs() {
      try {
        setLoadingJobs(true);
        const jobsData = await fetchJobsByUniversity(selectedUniversityId);
        setJobs(jobsData);
      } catch (err) {
        setJobs([]);
      } finally {
        setLoadingJobs(false);
      }
    }
    loadJobs();
  }, [selectedUniversityId, isAuthenticated]);

  function renderGuestContent() {
    return (
      <div style={{ width: '100%' }}>
        {/* Hero Section with Image Background */}
        <section style={{
          ...styles.heroSection,
          backgroundImage: `linear-gradient(rgba(33, 29, 51, 0.7), rgba(33, 29, 51, 0.7)), url(${handshakeImg})`,
        }}>
          <div style={styles.heroContainer}>
            <h1 style={styles.heroTitle}>
              İş İlanlarına Başvur, Kariyerine Yön Ver!
            </h1>

            <div style={{ marginTop: '60px' }}>
              <p style={styles.assistanceTitle}>Sana Nasıl Yardımcı Olabiliriz?</p>
              <div style={styles.pillGrid}>
                <div className="pill-card-hover" style={styles.pillCard} onClick={() => navigate('/register?role=STUDENT')}>
                  <span className="material-symbols-rounded" style={{ fontSize: '24px' }}>school</span>
                  <span>Öğrenci Başvurusu</span>
                </div>
                <div className="pill-card-hover" style={styles.pillCard} onClick={() => navigate('/register?role=EMPLOYER')}>
                  <span className="material-symbols-rounded" style={{ fontSize: '24px' }}>business_center</span>
                  <span>İşveren Başvurusu</span>
                </div>
                <div className="pill-card-hover" style={styles.pillCard} onClick={() => navigate('/login')}>
                  <span className="material-symbols-rounded" style={{ fontSize: '24px' }}>login</span>
                  <span>Giriş Yap</span>
                </div>
                <div className="pill-card-hover" style={styles.pillCard} onClick={() => navigate('/feed')}>
                  <span className="material-symbols-rounded" style={{ fontSize: '24px' }}>feed</span>
                  <span>İlanlara Göz At</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Jobs List replacing static universities */}
        <section style={styles.jobsSection}>
          <div style={styles.jobsContainer}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>İlgini Çekebilecek İş İlanları</h2>
              <button style={styles.viewAllBtn} onClick={() => navigate('/feed')}>Tümünü İncele &gt;</button>
            </div>

            <UniversityFilterBar
              universities={universities}
              selectedUniversityId={selectedUniversityId}
              onChange={setSelectedUniversityId}
            />

            <div style={{ marginTop: '24px' }}>
              {loadingJobs ? (
                <div style={styles.stateBox}>İlanlar yükleniyor...</div>
              ) : jobs.length === 0 ? (
                <div style={styles.stateBox}>Bu üniversite için henüz aktif ilan bulunmuyor.</div>
              ) : (
                <div style={styles.jobsGridHorizontal}>
                  {jobs.slice(0, 10).map((job) => (
                    <div key={job.id} style={styles.cardContainerHorizontal}>
                      <JobCard job={job} requireAuth={true} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  function renderStudentContent() {
    return (
      <div style={styles.jobsSection}>
        <div style={styles.jobsContainer}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Öğrenci Paneli</h2>
          </div>
          <div style={styles.pillGrid}>
            <div className="pill-card-hover" style={styles.pillCard} onClick={() => navigate('/feed')}>
              <span className="material-symbols-rounded" style={{ fontSize: '32px', color: 'var(--primary)' }}>search</span>
              <span style={{ fontWeight: 'bold' }}>İş İlanlarını Gör</span>
            </div>
            <div className="pill-card-hover" style={styles.pillCard} onClick={() => navigate('/saved-jobs')}>
              <span className="material-symbols-rounded" style={{ fontSize: '32px', color: 'var(--primary)' }}>bookmark</span>
              <span style={{ fontWeight: 'bold' }}>Kaydedilen İlanlar</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderEmployerContent() {
    return (
      <div style={styles.jobsSection}>
        <div style={styles.jobsContainer}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>İşveren Kontrol Merkezi</h2>
          </div>
          <div style={{ ...styles.pillGrid, gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            <div className="pill-card-hover" style={styles.pillCard} onClick={() => navigate('/employer/dashboard')}>
              <span className="material-symbols-rounded" style={{ fontSize: '32px', color: 'var(--primary)' }}>dashboard</span>
              <span style={{ fontWeight: 'bold' }}>Panel</span>
            </div>
            <div className="pill-card-hover" style={styles.pillCard} onClick={() => navigate('/employer/jobs')}>
              <span className="material-symbols-rounded" style={{ fontSize: '32px', color: 'var(--primary)' }}>work</span>
              <span style={{ fontWeight: 'bold' }}>İlanlarım</span>
            </div>
            <div className="pill-card-hover" style={styles.pillCard} onClick={() => navigate('/employer/jobs/new')}>
              <span className="material-symbols-rounded" style={{ fontSize: '32px', color: 'var(--primary)' }}>add_circle</span>
              <span style={{ fontWeight: 'bold' }}>Yeni İlan Oluştur</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Navbar />

      <main style={{ paddingTop: '70px', minHeight: 'calc(100vh - 70px)', background: '#f1f5f9' }}>
        {!isAuthenticated && renderGuestContent()}
        {isAuthenticated && isStudent && renderStudentContent()}
        {isAuthenticated && isEmployer && renderEmployerContent()}
      </main>
    </div>
  );
}

const styles = {
  heroSection: {
    width: "100%",
    minHeight: "500px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflow: "hidden",
  },
  heroContainer: {
    maxWidth: "1320px",
    margin: "0 auto",
    padding: "0 24px",
    width: "100%",
    zIndex: 2,
    position: "relative",
    paddingBottom: "80px",
    paddingTop: "60px",
  },
  heroTitle: {
    color: "#fff",
    fontSize: "clamp(36px, 4vw, 48px)",
    fontWeight: "700",
    marginBottom: "30px",
    maxWidth: "800px",
    lineHeight: 1.2,
  },
  assistanceTitle: {
    color: "#e2e8f0",
    fontSize: "18px",
    marginBottom: "20px",
  },
  pillGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "16px",
    maxWidth: "1000px",
  },
  pillCard: {
    background: "#fff",
    borderRadius: "8px",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    transition: "transform 0.2s, box-shadow 0.2s, background 0.2s",
    color: "#334155",
    fontWeight: "500",
  },
  jobsSection: {
    width: "100%",
    padding: "60px 0",
    background: "#f1f5f9",
  },
  jobsContainer: {
    maxWidth: "1320px",
    margin: "0 auto",
    padding: "0 24px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "24px",
    color: "#1e293b",
    margin: 0,
  },
  viewAllBtn: {
    background: "none",
    border: "none",
    color: "#3b82f6",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },
  jobsGridHorizontal: {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
    overflowX: "auto",
    paddingBottom: "16px",
    scrollbarWidth: "none", // For Firefox
    /* Webkit scrollbar hiding can be done in CSS */
  },
  cardContainerHorizontal: {
    minWidth: "350px",
    flex: "0 0 auto",
  },
  stateBox: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "32px",
    textAlign: "center",
    color: "#64748b",
  }
};

export default Landing;