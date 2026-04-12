import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { fetchUniversities } from "../api/universities";
import { register } from "../api/auth";
import { useToast } from "../context/ToastContext";
import Navbar from "../components/Navbar";

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
      } catch {
        showToast({ type: "error", title: "Üniversiteler yüklenemedi" });
      }
    }
    loadUniversities();
  }, [showToast]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (role === "STUDENT" && (!email || !password || !fullName || !universityId)) {
      showToast({ type: "warning", title: "Eksik bilgi", message: "Lütfen tüm alanları doldur." });
      return;
    }
    if (role === "EMPLOYER" && (!email || !password || !companyName || !contactPerson)) {
      showToast({ type: "warning", title: "Eksik bilgi", message: "Lütfen tüm alanları doldur." });
      return;
    }

    try {
      setLoading(true);

      const payload =
        role === "STUDENT"
          ? { email, password, role, fullName, universityId: Number(universityId) }
          : { email, password, role, companyName, contactPerson };

      await register(payload);
      showToast({ type: "success", title: "Kayıt başarılı", message: "Şimdi giriş yapabilirsiniz." });
      navigate("/login");
    } catch {
      showToast({ type: "error", title: "Kayıt başarısız", message: "Lütfen bilgilerini kontrol et." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="auth-page">

      {/* ══════════════════════════════════════
          Sol Panel — İllüstrasyon
      ══════════════════════════════════════ */}
      <div className="auth-left-panel">

        {/* Halka + üniversite merkezi + balonlar */}
        <div className="auth-illustration">

          <div className="auth-ring auth-ring-3" />
          <div className="auth-ring auth-ring-2" />
          <div className="auth-ring auth-ring-1" />

          {/* Merkez: Üniversite kampüsü */}
          <div className="auth-center-circle">
            <span className="material-symbols-rounded">school</span>
          </div>

          {/* Balon 1 — Sol üst */}
          <div className="auth-float-card" style={{ top: "14%", left: "2%" }}>
            <div className="auth-float-icon">
              <span className="material-symbols-rounded">work_history</span>
            </div>
            <div>
              <div className="auth-float-title">Hızlı Başvuru</div>
              <div className="auth-float-sub">saniyeler içinde ilan başvurusu</div>
            </div>
          </div>

          {/* Balon 2 — Sağ üst */}
          <div className="auth-float-card" style={{ top: "10%", right: "1%" }}>
            <div className="auth-float-icon">
              <span className="material-symbols-rounded">groups</span>
            </div>
            <div>
              <div className="auth-float-title">Binlerce Öğrenci</div>
              <div className="auth-float-sub">Jobsy topluluğuna katıl</div>
            </div>
          </div>

          {/* Balon 3 — Sol alt */}
          <div className="auth-float-card" style={{ bottom: "14%", left: "2%" }}>
            <div className="auth-float-icon">
              <span className="material-symbols-rounded">apartment</span>
            </div>
            <div>
              <div className="auth-float-title">500+ İşveren</div>
              <div className="auth-float-sub">seni keşfetmek için bekliyor</div>
            </div>
          </div>

          {/* Balon 4 — Sağ alt */}
          <div className="auth-float-card" style={{ bottom: "10%", right: "1%" }}>
            <div className="auth-float-icon">
              <span className="material-symbols-rounded">verified</span>
            </div>
            <div>
              <div className="auth-float-title">Güvenilir İlanlar</div>
              <div className="auth-float-sub">doğrulanmış işveren profilleri</div>
            </div>
          </div>
        </div>

        <p className="auth-tagline">Kariyerine kampüsten başla</p>
      </div>

      {/* ══════════════════════════════════════
          Sağ Panel — Form
      ══════════════════════════════════════ */}
      <div className="auth-right-panel">
        <div className="auth-form-container">

          <h1 className="auth-heading">Hesap Oluştur</h1>
          <p className="auth-subheading">
            Jobsy'e katıl, kampüs çevresindeki fırsatları keşfet.
          </p>

          {/* Rol Seçimi */}
          <div className="auth-role-toggle">
            <button
              type="button"
              id="role-student"
              className={`auth-role-btn${role === "STUDENT" ? " active" : ""}`}
              onClick={() => setRole("STUDENT")}
            >
              <span className="material-symbols-rounded">school</span>
              Öğrenci
            </button>
            <button
              type="button"
              id="role-employer"
              className={`auth-role-btn${role === "EMPLOYER" ? " active" : ""}`}
              onClick={() => setRole("EMPLOYER")}
            >
              <span className="material-symbols-rounded">apartment</span>
              İşveren
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">

            {/* ── Öğrenci Formu ── */}
            {role === "STUDENT" && (
              <>
                <div className="auth-input-group">
                  <label className="auth-label" htmlFor="reg-email">E-posta *</label>
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="E-posta"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                    autoComplete="email"
                  />
                </div>

                <div className="auth-input-group">
                  <label className="auth-label" htmlFor="reg-password">Şifre *</label>
                  <input
                    id="reg-password"
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input"
                    autoComplete="new-password"
                  />
                </div>

                <div className="auth-input-group">
                  <label className="auth-label" htmlFor="reg-fullname">Ad Soyad *</label>
                  <input
                    id="reg-fullname"
                    type="text"
                    placeholder="Adınız Soyadınız"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="auth-input"
                    autoComplete="name"
                  />
                </div>

                <div className="auth-input-group">
                  <label className="auth-label" htmlFor="reg-university">Üniversite *</label>
                  <select
                    id="reg-university"
                    value={universityId}
                    onChange={(e) => setUniversityId(e.target.value)}
                    className="auth-select"
                  >
                    <option value="">Üniversite seçin</option>
                    {universities.map((uni) => (
                      <option key={uni.id} value={uni.id}>
                        {uni.display_name || uni.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* ── İşveren Formu ── */}
            {role === "EMPLOYER" && (
              <>
                <div className="auth-input-group">
                  <label className="auth-label" htmlFor="reg-emp-email">E-posta *</label>
                  <input
                    id="reg-emp-email"
                    type="email"
                    placeholder="E-posta"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                    autoComplete="email"
                  />
                </div>

                <div className="auth-input-group">
                  <label className="auth-label" htmlFor="reg-emp-password">Şifre *</label>
                  <input
                    id="reg-emp-password"
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input"
                    autoComplete="new-password"
                  />
                </div>

                <div className="auth-input-group">
                  <label className="auth-label" htmlFor="reg-company">İşletme Adı *</label>
                  <input
                    id="reg-company"
                    type="text"
                    placeholder="İşletme adı"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="auth-input"
                  />
                </div>

                <div className="auth-input-group">
                  <label className="auth-label" htmlFor="reg-contact">Yetkili Adı *</label>
                  <input
                    id="reg-contact"
                    type="text"
                    placeholder="İletişim kişisi"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="auth-input"
                  />
                </div>
              </>
            )}

            <button
              id="register-submit"
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Kaydediliyor..." : "Kayıt Ol"}
            </button>
          </form>

          <p className="auth-switch-text">
            Zaten hesabın var mı?{" "}
            <Link to="/login" className="auth-switch-link">Giriş yap</Link>
          </p>
        </div>
      </div>

      </div>
    </>
  );
}

export default Register;