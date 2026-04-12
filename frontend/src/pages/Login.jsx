import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useToast } from "../context/ToastContext";
import Navbar from "../components/Navbar";

function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      showToast({ type: "warning", title: "Eksik bilgi", message: "Lütfen tüm alanları doldur." });
      return;
    }

    try {
      setLoading(true);
      const data = await login({ email, password });

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      showToast({ type: "success", title: "Giriş başarılı", message: "Hesabına başarıyla giriş yaptın." });
      navigate("/");
    } catch (err) {
      console.error(err);
      showToast({ type: "error", title: "Giriş başarısız", message: "E-posta veya şifre hatalı." });
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

        {/* Halka + şehir merkezi + balonlar */}
        <div className="auth-illustration">

          {/* Halka 3 - en dış */}
          <div className="auth-ring auth-ring-3" />
          {/* Halka 2 - orta */}
          <div className="auth-ring auth-ring-2" />
          {/* Halka 1 - en iç */}
          <div className="auth-ring auth-ring-1" />

          {/* Merkez: Üniversite ikonu */}
          <div className="auth-center-circle">
            <span className="material-symbols-rounded">school</span>
          </div>

          {/* Balon 1 — Sol üst */}
          <div className="auth-float-card" style={{ top: "14%", left: "2%" }}>
            <div className="auth-float-icon">
              <span className="material-symbols-rounded">business_center</span>
            </div>
            <div>
              <div className="auth-float-title">500+ İşveren</div>
              <div className="auth-float-sub">yarı zamanlı pozisyon sunuyor</div>
            </div>
          </div>

          {/* Balon 2 — Sağ üst */}
          <div className="auth-float-card" style={{ top: "10%", right: "1%" }}>
            <div className="auth-float-icon">
              <span className="material-symbols-rounded">school</span>
            </div>
            <div>
              <div className="auth-float-title">200+ Üniversite</div>
              <div className="auth-float-sub">kampüsünden aktif ilanlar</div>
            </div>
          </div>

          {/* Balon 3 — Sol alt */}
          <div className="auth-float-card" style={{ bottom: "14%", left: "2%" }}>
            <div className="auth-float-icon">
              <span className="material-symbols-rounded">location_on</span>
            </div>
            <div>
              <div className="auth-float-title">Kampüse Yakın</div>
              <div className="auth-float-sub">iş fırsatları seni bekliyor</div>
            </div>
          </div>

          {/* Balon 4 — Sağ alt */}
          <div className="auth-float-card" style={{ bottom: "10%", right: "1%" }}>
            <div className="auth-float-icon">
              <span className="material-symbols-rounded">schedule</span>
            </div>
            <div>
              <div className="auth-float-title">Esnek Çalışma</div>
              <div className="auth-float-sub">ders programına uygun saatler</div>
            </div>
          </div>
        </div>

        <p className="auth-tagline">Kampüs çevresindeki en iyi fırsatları keşfet</p>
      </div>

      {/* ══════════════════════════════════════
          Sağ Panel — Form
      ══════════════════════════════════════ */}
      <div className="auth-right-panel">
        <div className="auth-form-container">

          <h1 className="auth-heading">Jobsy'e Hoş Geldin!</h1>
          <p className="auth-subheading">Hesabına giriş yap ve fırsatları keşfet.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <label className="auth-label" htmlFor="login-email">E-posta</label>
              <input
                id="login-email"
                type="email"
                placeholder="E-posta"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                autoComplete="email"
              />
            </div>

            <div className="auth-input-group">
              <label className="auth-label" htmlFor="login-password">Şifre</label>
              <input
                id="login-password"
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                autoComplete="current-password"
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <p className="auth-switch-text">
            Hesabın yok mu?{" "}
            <Link to="/register" className="auth-switch-link">Kayıt ol</Link>
          </p>
        </div>
      </div>

      </div>
    </>
  );
}

export default Login;