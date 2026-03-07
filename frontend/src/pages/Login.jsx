import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/feed");
    }
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("Lütfen e-posta ve şifre gir.");
      return;
    }

    try {
      setLoading(true);

      const data = await login({
        email,
        password,
      });

      // token sakla
      localStorage.setItem("token", data.accessToken);

      // user bilgisini sakla
      localStorage.setItem("user", JSON.stringify(data.user));

      // feed sayfasına git
      navigate("/feed");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Giriş Yap</h2>
        <p style={styles.subtitle}>
          Hesabına giriş yaparak ilanları görüntüle.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <p style={styles.footerText}>
          Hesabın yok mu?{" "}
          <Link to="/register" style={styles.link}>
            Kayıt ol
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    background: "#f6f7fb",
  },
  card: {
    width: "100%",
    maxWidth: "440px",
    background: "#fff",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  title: {
    marginTop: 0,
    marginBottom: "8px",
  },
  subtitle: {
    marginTop: 0,
    marginBottom: "16px",
    color: "#6b7280",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
  },
  submitButton: {
    border: "none",
    background: "#111827",
    color: "#fff",
    borderRadius: "12px",
    padding: "12px 14px",
    cursor: "pointer",
    fontWeight: 600,
    marginTop: "4px",
  },
  footerText: {
    marginTop: "16px",
    fontSize: "14px",
    color: "#6b7280",
  },
  link: {
    color: "#111827",
    fontWeight: 600,
  },
};

export default Login;