import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUniversities } from "../api/universities";
import { register } from "../api/auth";

function Register() {
    const navigate = useNavigate();

    const [role, setRole] = useState("STUDENT");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [universityId, setUniversityId] = useState("");

    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadUniversities() {
            try {
                const data = await fetchUniversities();
                setUniversities(data);
            } catch (err) {
                console.error("Universities fetch error:", err);
            }
        }

        loadUniversities();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!email || !password || !universityId) {
            alert("Lütfen tüm alanları doldur.");
            return;
        }

        try {
            setLoading(true);

            await register({
                email,
                password,
                role,
                universityId: Number(universityId),
            });

            alert("Kayıt başarılı. Giriş yapabilirsiniz.");
            navigate("/login");
        } catch (err) {
            console.error("Register error:", err);
            alert("Kayıt başarısız.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.tabs}>
                    <button
                        type="button"
                        onClick={() => setRole("STUDENT")}
                        style={{
                            ...styles.tab,
                            ...(role === "STUDENT" ? styles.activeTab : {}),
                        }}
                    >
                        Öğrenci Kaydı
                    </button>

                    <button
                        type="button"
                        onClick={() => setRole("EMPLOYER")}
                        style={{
                            ...styles.tab,
                            ...(role === "EMPLOYER" ? styles.activeTab : {}),
                        }}
                    >
                        İşveren Kaydı
                    </button>
                </div>

                <h2 style={styles.title}>
                    {role === "STUDENT"
                        ? "Öğrenci hesabı oluştur"
                        : "İşveren hesabı oluştur"}
                </h2>

                <p style={styles.subtitle}>
                    Bilgilerini girerek hesabını oluştur.
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

                    <select
                        value={universityId}
                        onChange={(e) => setUniversityId(e.target.value)}
                        style={styles.select}
                    >
                        <option value="">Üniversite seç</option>
                        {universities.map((uni) => (
                            <option key={uni.id} value={uni.id}>
                                {uni.display_name || uni.name}
                            </option>
                        ))}
                    </select>

                    <button type="submit" style={styles.submitButton} disabled={loading}>
                        {loading ? "Kaydediliyor..." : "Kayıt Ol"}
                    </button>
                </form>
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
    tabs: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "8px",
        marginBottom: "20px",
    },
    tab: {
        border: "1px solid #d1d5db",
        background: "#f9fafb",
        color: "#111827",
        borderRadius: "12px",
        padding: "12px",
        cursor: "pointer",
        fontWeight: 600,
    },
    activeTab: {
        background: "#111827",
        color: "#fff",
        border: "1px solid #111827",
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
    select: {
        padding: "12px 14px",
        borderRadius: "12px",
        border: "1px solid #d1d5db",
        background: "#fff",
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
};

export default Register;