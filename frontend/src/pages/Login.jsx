import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import Navbar from "../components/Navbar";
import { useToast } from "../context/ToastContext";

function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      showToast({
        type: "warning",
        title: "Giriş Başarısız",
      });
      return;
    }

    try {
      setLoading(true);

      const data = await login({
        email,
        password,
      });

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      showToast({
        type: "success",
        title: "Giriş başarılı",
        message: "Hesabına başarıyla giriş yaptın.",
      });

      navigate("/");
    } catch (err) {
      console.error(err);

      showToast({
        type: "error",
        title: "Giriş başarısız",
        message: "",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', position: 'relative' }}>
      <div style={{ 
        position: 'fixed', 
        inset: 0, 
        backgroundImage: 'url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: -2 
      }}></div>
      <div style={{ 
        position: 'fixed', 
        inset: 0, 
        background: 'rgba(240, 244, 248, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: -1 
      }}></div>

      <Navbar />

      <main className="container flex-center" style={{ minHeight: 'calc(100vh - 80px)', padding: '2rem' }}>
        <div className="glass-card animate-fade-in" style={{ 
          padding: '3rem', 
          width: '100%', 
          maxWidth: '440px', 
          display: 'flex', 
          flexDirection: 'column', 
          background: 'rgba(255, 255, 255, 0.9)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(14,165,233,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', marginInline: 'auto' }}>
            <span className="material-symbols-rounded" style={{ fontSize: '32px', color: 'var(--primary)' }}>login</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', textAlign: 'center' }}>Giriş Yap</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', textAlign: 'center' }}>Hesabına giriş yap.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="email"
              placeholder="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-glass"
            />
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-glass"
            />
            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Hesabın yok mu? <Link to="/register" style={{ color: 'var(--text-main)', fontWeight: '700' }}>Kayıt ol</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;