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
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', width: '100%' }}>
        {/* Intro */}
        <section className="animate-fade-in" style={{ textAlign: 'center', margin: '0 auto 4rem', width: '100%' }}>

          <img
            src={handshakeImg}
            alt="Handshake"
            style={{
              width: '100%',
              height: '450px',
              objectFit: 'cover',
              borderRadius: '24px',
              marginBottom: '2.5rem',
              boxShadow: 'var(--shadow-md)'
            }}
          />

          <h1 className="title" style={{ marginBottom: '1.5rem' }}>
            Çevrendeki <span className="text-gradient">Fırsatları Keşfet</span>
          </h1>
          <p className="subtitle" style={{ marginBottom: '2.5rem' }}>
            Öğrenciler için en iyi yarı zamanlı işler, işverenler için en yetenekli adaylar Jobsy'de.
          </p>
          <div className="flex-center" style={{ gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/register?role=STUDENT')}>Öğrenci Başvurusu</button>
            <button className="btn-secondary" onClick={() => navigate('/register?role=EMPLOYER')}>İşveren Başvurusu</button>
          </div>
        </section>

        {/* Jobs List replacing static universities */}
        <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 className="title" style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: '1rem' }}>Üniversitene Göre İlanlar</h2>
            <p className="subtitle">Kampüsündeki ilanları keşfet ve hemen başvur.</p>
          </div>

          <UniversityFilterBar
            universities={universities}
            selectedUniversityId={selectedUniversityId}
            onChange={setSelectedUniversityId}
          />

          <div style={{ marginTop: '2rem' }}>
            {loadingJobs ? (
              <div style={{ background: "rgba(255,255,255,0.82)", border: "1px solid rgba(226,232,240,0.9)", borderRadius: "20px", padding: "24px", color: "#475569", boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)" }}>
                İlanlar yükleniyor...
              </div>
            ) : jobs.length === 0 ? (
              <div style={{ background: "rgba(255,255,255,0.82)", border: "1px solid rgba(226,232,240,0.9)", borderRadius: "20px", padding: "24px", color: "#475569", boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)" }}>
                Bu üniversite için henüz aktif ilan bulunmuyor.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {jobs.slice(0, 10).map((job) => (
                  <JobCard key={job.id} job={job} requireAuth={true} />
                ))}
              </div>
            )}
            
            {jobs.length > 10 && (
              <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                <button 
                  className="btn-primary" 
                  onClick={() => navigate('/login')}
                  style={{ padding: '16px 32px', fontSize: '1.2rem', boxShadow: '0 12px 34px rgba(79, 70, 229, 0.3)' }}
                >
                  Tüm İlanları ({(jobs.length)}+) İncelemek İçin Giriş Yap
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }

  function renderStudentContent() {
    return (
      <div className="container animate-fade-in" style={{ paddingTop: '5rem', textAlign: 'center', maxWidth: '800px' }}>
        <div className="badge">Hoş geldin</div>
        <h1 className="title" style={{ marginBottom: '1.5rem' }}>Öğrenci Paneli</h1>
        <p className="subtitle" style={{ marginBottom: '3rem' }}>
          Üniversite çevrendeki fırsatları keşfet, detayları incele ve sana en uygun ilanlara daha hızlı ulaş.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div onClick={() => navigate('/feed')} className="glass-card" style={{ padding: '2.5rem', cursor: 'pointer' }}>
            <span className="material-symbols-rounded text-gradient" style={{ fontSize: '48px', marginBottom: '1rem' }}>search</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem' }}>İş İlanlarını Gör</h3>
            <p className="subtitle" style={{ fontSize: '1rem' }}>Kampüs çevrendeki fırsatları keşfet ve detayları incele.</p>
          </div>
          <div onClick={() => navigate('/feed')} className="glass-card" style={{ padding: '2.5rem', cursor: 'pointer' }}>
            <span className="material-symbols-rounded text-gradient" style={{ fontSize: '48px', marginBottom: '1rem' }}>filter_alt</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.5rem' }}>Üniversitene Göre Keşfet</h3>
            <p className="subtitle" style={{ fontSize: '1rem' }}>Sadece kendi üniversitene uygun ilanları filtrele.</p>
          </div>
        </div>
      </div>
    );
  }

  function renderEmployerContent() {
    return (
      <div className="container animate-fade-in" style={{ paddingTop: '5rem', textAlign: 'center', maxWidth: '900px' }}>
        <div className="badge">Tekrar hoş geldin</div>
        <h1 className="title" style={{ marginBottom: '1.5rem' }}>İşveren Kontrol Merkezi</h1>
        <p className="subtitle" style={{ marginBottom: '3rem' }}>
          İlanlarını yönet, panelini görüntüle ve yeni ilan oluşturarak doğru üniversite kitlesine ulaş.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div onClick={() => navigate('/employer/dashboard')} className="glass-card" style={{ padding: '2rem', cursor: 'pointer' }}>
            <span className="material-symbols-rounded text-gradient" style={{ fontSize: '40px', marginBottom: '1rem' }}>dashboard</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Panel</h3>
            <p className="subtitle" style={{ fontSize: '0.95rem' }}>Genel durumu, aktif ve pasif ilan sayılarını görüntüle.</p>
          </div>
          <div onClick={() => navigate('/employer/jobs')} className="glass-card" style={{ padding: '2rem', cursor: 'pointer' }}>
            <span className="material-symbols-rounded text-gradient" style={{ fontSize: '40px', marginBottom: '1rem' }}>work</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>İlanlarım</h3>
            <p className="subtitle" style={{ fontSize: '0.95rem' }}>Mevcut ilanlarını listele, düzenle ve yönet.</p>
          </div>
          <div onClick={() => navigate('/employer/jobs/new')} className="glass-card" style={{ padding: '2rem', cursor: 'pointer' }}>
            <span className="material-symbols-rounded text-gradient" style={{ fontSize: '40px', marginBottom: '1rem' }}>add_circle</span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Yeni İlan Oluştur</h3>
            <p className="subtitle" style={{ fontSize: '0.95rem' }}>Hızlıca yeni bir ilan yayınlayarak adaylara ulaş.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', position: 'relative' }}>
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>
      <div className="bg-glow bg-glow-3"></div>

      <Navbar />

      <main style={{ position: 'relative', zIndex: 1 }}>
        {!isAuthenticated && renderGuestContent()}
        {isAuthenticated && isStudent && renderStudentContent()}
        {isAuthenticated && isEmployer && renderEmployerContent()}
      </main>
    </div>
  );
}

export default Landing;