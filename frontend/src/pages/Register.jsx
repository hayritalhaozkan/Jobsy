import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { fetchUniversities } from "../api/universities";
import { register } from "../api/auth";
import Navbar from "../components/Navbar";
import { useToast } from "../context/ToastContext";

function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const initialRole = searchParams.get("role") === "EMPLOYER" ? "EMPLOYER" : "STUDENT";

  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [universityId, setUniversityId] = useState("");
  
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUniversities() {
      try {
        const data = await fetchUniversities();
        setUniversities(data);
      } catch (err) {
        showToast({ type: "error", title: "Üniversiteler yüklenemedi" });
      }
    }
    loadUniversities();
  }, [showToast]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (role === "STUDENT" && (!email || !password || !fullName || !universityId)) {
      showToast({ type: "warning", title: "Eksik bilgi", message: "Lütfen tüm öğrenci alanlarını doldur." });
      return;
    }
    if (role === "EMPLOYER" && (!email || !password || !companyName || !contactPerson)) {
      showToast({ type: "warning", title: "Eksik bilgi", message: "Lütfen tüm işveren alanlarını doldur." });
      return;
    }

    try {
      setLoading(true);
      
      const payload = role === "STUDENT" 
        ? { email, password, role, fullName, universityId: Number(universityId) }
        : { email, password, role, companyName, contactPerson };

      await register(payload);
      showToast({ type: "success", title: "Kayıt başarılı", message: "Şimdi giriş yapabilirsiniz." });
      navigate("/login");
    } catch (err) {
      showToast({ type: "error", title: "Kayıt başarısız" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animated-gradient-bg" style={{ paddingTop: '80px', minHeight: '100vh', position: 'relative' }}>
      <Navbar />

      <main className="container flex-center" style={{ minHeight: 'calc(100vh - 80px)', padding: '2rem' }}>
        <div className="glass-bubble-card animate-fade-in" style={{ 
          padding: '3.5rem', 
          width: '100%', 
          maxWidth: '460px'
        }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
            <button
              type="button"
              onClick={() => setRole("STUDENT")}
              style={{
                flex: 1,
                border: role === "STUDENT" ? 'none' : '1px solid rgba(15, 23, 42, 0.08)',
                background: role === "STUDENT" ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(248,250,252,0.5)',
                color: role === "STUDENT" ? '#fff' : 'var(--text-main)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                cursor: 'pointer',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                boxShadow: role === "STUDENT" ? '0 12px 24px rgba(79, 70, 229, 0.22)' : 'none'
              }}
            >
              <span className="material-symbols-rounded" style={{ fontSize: '20px' }}>school</span>Öğrenci
            </button>
            <button
              type="button"
              onClick={() => setRole("EMPLOYER")}
              style={{
                flex: 1,
                border: role === "EMPLOYER" ? 'none' : '1px solid rgba(15, 23, 42, 0.08)',
                background: role === "EMPLOYER" ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(248,250,252,0.5)',
                color: role === "EMPLOYER" ? '#fff' : 'var(--text-main)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                cursor: 'pointer',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                boxShadow: role === "EMPLOYER" ? '0 12px 24px rgba(79, 70, 229, 0.22)' : 'none'
              }}
            >
              <span className="material-symbols-rounded" style={{ fontSize: '20px' }}>apartment</span>İşveren
            </button>
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem', textAlign: 'center' }}>
            {role === "STUDENT" ? "Öğrenci Hesabı" : "İşveren Hesabı"}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', textAlign: 'center' }}>Hemen hesabını oluştur.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {role === "STUDENT" && (
              <>
                <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                  <label style={{fontSize: '14px', fontWeight: 'bold', color: 'var(--text-main)', marginLeft: '4px'}}>E-posta *</label>
                  <input type="email" placeholder="ornek@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input-glass" />
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                  <label style={{fontSize: '14px', fontWeight: 'bold', color: 'var(--text-main)', marginLeft: '4px'}}>Şifre *</label>
                  <input type="password" placeholder="En az 6 karakter" value={password} onChange={(e) => setPassword(e.target.value)} className="input-glass" />
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                  <label style={{fontSize: '14px', fontWeight: 'bold', color: 'var(--text-main)', marginLeft: '4px'}}>Ad Soyad *</label>
                  <input type="text" placeholder="Adınız Soyadınız" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-glass" />
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                  <label style={{fontSize: '14px', fontWeight: 'bold', color: 'var(--text-main)', marginLeft: '4px'}}>Üniversite *</label>
                  <select value={universityId} onChange={(e) => setUniversityId(e.target.value)} className="input-glass" style={{ appearance: 'none', cursor: 'pointer' }}>
                    <option value="">Üniversite seçin</option>
                    {universities.map((uni) => (
                      <option key={uni.id} value={uni.id}>{uni.display_name || uni.name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {role === "EMPLOYER" && (
              <>
                <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                  <label style={{fontSize: '14px', fontWeight: 'bold', color: 'var(--text-main)', marginLeft: '4px'}}>E-posta *</label>
                  <input type="email" placeholder="ornek@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input-glass" />
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                  <label style={{fontSize: '14px', fontWeight: 'bold', color: 'var(--text-main)', marginLeft: '4px'}}>Şifre *</label>
                  <input type="password" placeholder="En az 6 karakter" value={password} onChange={(e) => setPassword(e.target.value)} className="input-glass" />
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                  <label style={{fontSize: '14px', fontWeight: 'bold', color: 'var(--text-main)', marginLeft: '4px'}}>İşletme Adı *</label>
                  <input type="text" placeholder="İşletme adınız" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="input-glass" />
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                  <label style={{fontSize: '14px', fontWeight: 'bold', color: 'var(--text-main)', marginLeft: '4px'}}>Yetkili Adı *</label>
                  <input type="text" placeholder="İletişim kişisi" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className="input-glass" />
                </div>
              </>
            )}

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem', padding: '16px', fontSize: '16px' }}>
              {loading ? "Kaydediliyor..." : "Kayıt Ol"}
            </button>
          </form>

          <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Zaten hesabın var mı? <Link to="/login" style={{ color: 'var(--text-main)', fontWeight: '700' }}>Giriş yap</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Register;