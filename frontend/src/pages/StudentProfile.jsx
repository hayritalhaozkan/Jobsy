import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchProfile, updateProfile } from "../api/profile";
import { fetchUniversities } from "../api/universities";
import { useToast } from "../context/ToastContext";

function StudentProfile() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [profile,      setProfile     ] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [loading,      setLoading     ] = useState(true);
  const [saving,       setSaving      ] = useState(false);

  /* Form state — profil bilgileri */
  const [form, setForm] = useState({
    fullName:     "",
    phone:        "",
    bio:          "",
    universityId: "",
  });

  /* Şifre değişimi — ayrı section */
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword:     "",
    confirmPassword: "",
  });

  /* ─── Veri yükle ─── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user  = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || user?.role !== "STUDENT") {
      navigate("/login");
      return;
    }

    Promise.all([fetchProfile(), fetchUniversities()])
      .then(([prof, unis]) => {
        setProfile(prof);
        setUniversities(unis || []);
        setForm({
          fullName:     prof.fullName     || "",
          phone:        prof.phone        || "",
          bio:          prof.bio          || "",
          universityId: prof.universityId || "",
        });
      })
      .catch(() => showToast({ type: "error", title: "Profil yüklenemedi" }))
      .finally(() => setLoading(false));
  }, [navigate, showToast]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function handlePwChange(e) {
    const { name, value } = e.target;
    setPwForm((p) => ({ ...p, [name]: value }));
  }

  /* ─── Profil kaydet ─── */
  async function handleSaveProfile(e) {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await updateProfile({
        fullName:     form.fullName     || null,
        phone:        form.phone        || null,
        bio:          form.bio          || null,
        universityId: form.universityId ? Number(form.universityId) : undefined,
      });
      setProfile((p) => ({ ...p, ...updated }));
      showToast({ type: "success", title: "Profil güncellendi" });
    } catch {
      showToast({ type: "error", title: "Güncelleme başarısız" });
    } finally {
      setSaving(false);
    }
  }

  /* ─── Şifre değiştir ─── */
  async function handleChangePassword(e) {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      showToast({ type: "warning", title: "Şifreler eşleşmiyor" });
      return;
    }
    if (pwForm.newPassword.length < 6) {
      showToast({ type: "warning", title: "Şifre en az 6 karakter olmalı" });
      return;
    }
    try {
      setSaving(true);
      await updateProfile({
        currentPassword: pwForm.currentPassword,
        newPassword:     pwForm.newPassword,
      });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showToast({ type: "success", title: "Şifre değiştirildi" });
    } catch (err) {
      const msg = err?.response?.data?.message || "Şifre değiştirilemedi";
      showToast({ type: "error", title: msg });
    } finally {
      setSaving(false);
    }
  }

  /* ─── Render ─── */
  if (loading) {
    return (
      <div style={s.page}>
        <Navbar />
        <main style={s.main}>
          <div style={s.loadingWrap}>
            <span className="material-symbols-rounded" style={{ fontSize: "48px", color: "#cbd5e1" }}>
              person
            </span>
            <p style={{ color: "#64748b", marginTop: "12px" }}>Profil yükleniyor...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <Navbar />

      <main style={s.main}>
        <div style={s.container}>

          {/* ── Sayfa başlığı ── */}
          <div style={s.pageHeader}>
            <h1 style={s.pageTitle}>Profilim</h1>
            <p style={s.pageSubtitle}>Kişisel bilgilerini güncelle ve hesabını yönet</p>
          </div>

          <div style={s.layout}>

            {/* ── Sol — Avatar + özet ── */}
            <aside style={s.sidebar}>
              <div style={s.avatarWrap}>
                <div style={s.avatarCircle}>
                  <span className="material-symbols-rounded" style={s.avatarIcon}>person</span>
                </div>
                <div style={s.avatarInfo}>
                  <div style={s.avatarName}>
                    {form.fullName || profile?.email?.split("@")[0] || "Kullanıcı"}
                  </div>
                  <div style={s.avatarRole}>Öğrenci</div>
                </div>
              </div>

              <div style={s.metaList}>
                <div style={s.metaItem}>
                  <span className="material-symbols-rounded" style={s.metaIcon}>mail</span>
                  <span style={s.metaText}>{profile?.email}</span>
                </div>
                {profile?.universityName && (
                  <div style={s.metaItem}>
                    <span className="material-symbols-rounded" style={s.metaIcon}>school</span>
                    <span style={s.metaText}>{profile.universityName}</span>
                  </div>
                )}
                {form.phone && (
                  <div style={s.metaItem}>
                    <span className="material-symbols-rounded" style={s.metaIcon}>phone</span>
                    <span style={s.metaText}>{form.phone}</span>
                  </div>
                )}
                <div style={s.metaItem}>
                  <span className="material-symbols-rounded" style={s.metaIcon}>calendar_today</span>
                  <span style={s.metaText}>
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString("tr-TR", { year: "numeric", month: "long" })
                      : ""}
                    {" "}tarihinde katıldı
                  </span>
                </div>
              </div>

              <button
                style={s.savedJobsBtn}
                onClick={() => navigate("/saved-jobs")}
              >
                <span className="material-symbols-rounded" style={{ fontSize: "18px" }}>bookmark</span>
                Kaydedilen İlanlar
              </button>
            </aside>

            {/* ── Sağ — Formlar ── */}
            <div style={s.forms}>

              {/* ── Profil bilgileri ── */}
              <section style={s.card}>
                <h2 style={s.cardTitle}>
                  <span className="material-symbols-rounded" style={s.cardIcon}>edit</span>
                  Profil Bilgileri
                </h2>

                <form onSubmit={handleSaveProfile} style={s.formGrid}>
                  <div style={s.fieldWrap}>
                    <label style={s.label}>Ad Soyad</label>
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      style={s.input}
                      placeholder="Adınızı ve soyadınızı girin"
                    />
                  </div>

                  <div style={s.fieldWrap}>
                    <label style={s.label}>Telefon</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      style={s.input}
                      placeholder="+90 555 000 00 00"
                    />
                  </div>

                  <div style={{ ...s.fieldWrap, gridColumn: "1 / -1" }}>
                    <label style={s.label}>Üniversite</label>
                    <select
                      name="universityId"
                      value={form.universityId}
                      onChange={handleChange}
                      style={s.select}
                    >
                      <option value="">Üniversite seç</option>
                      {universities.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.display_name || u.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ ...s.fieldWrap, gridColumn: "1 / -1" }}>
                    <label style={s.label}>Hakkımda</label>
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      style={s.textarea}
                      placeholder="Kendinizden kısaca bahsedin..."
                    />
                  </div>

                  <div style={{ ...s.fieldWrap, gridColumn: "1 / -1" }}>
                    <label style={s.label}>E-posta</label>
                    <input
                      value={profile?.email || ""}
                      style={{ ...s.input, background: "#f8fafc", color: "#94a3b8", cursor: "not-allowed" }}
                      disabled
                    />
                    <p style={s.helpText}>E-posta adresi değiştirilemez.</p>
                  </div>

                  <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" style={s.saveBtn} disabled={saving}>
                      {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                    </button>
                  </div>
                </form>
              </section>

              {/* ── Şifre değiştir ── */}
              <section style={s.card}>
                <h2 style={s.cardTitle}>
                  <span className="material-symbols-rounded" style={s.cardIcon}>lock</span>
                  Şifre Değiştir
                </h2>

                <form onSubmit={handleChangePassword} style={s.formGrid}>
                  <div style={{ ...s.fieldWrap, gridColumn: "1 / -1" }}>
                    <label style={s.label}>Mevcut Şifre</label>
                    <input
                      name="currentPassword"
                      type="password"
                      value={pwForm.currentPassword}
                      onChange={handlePwChange}
                      style={s.input}
                      placeholder="Mevcut şifreniz"
                    />
                  </div>

                  <div style={s.fieldWrap}>
                    <label style={s.label}>Yeni Şifre</label>
                    <input
                      name="newPassword"
                      type="password"
                      value={pwForm.newPassword}
                      onChange={handlePwChange}
                      style={s.input}
                      placeholder="En az 6 karakter"
                    />
                  </div>

                  <div style={s.fieldWrap}>
                    <label style={s.label}>Yeni Şifre (Tekrar)</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      value={pwForm.confirmPassword}
                      onChange={handlePwChange}
                      style={s.input}
                      placeholder="Şifreyi tekrar girin"
                    />
                  </div>

                  <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" style={s.saveBtnOutline} disabled={saving}>
                      Şifreyi Değiştir
                    </button>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Styles ── */
const s = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f8fafc 0%, #eef4ff 40%, #f1f5f9 100%)",
  },

  main: {
    paddingTop: "90px",
    paddingBottom: "60px",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 24px",
  },

  loadingWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "60vh",
  },

  pageHeader: {
    marginBottom: "32px",
  },

  pageTitle: {
    margin: "0 0 6px",
    fontSize: "28px",
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: "-0.02em",
  },

  pageSubtitle: {
    margin: 0,
    fontSize: "15px",
    color: "#64748b",
  },

  layout: {
    display: "flex",
    gap: "24px",
    alignItems: "flex-start",
  },

  /* ── Sidebar ── */
  sidebar: {
    width: "260px",
    flexShrink: 0,
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 4px 16px rgba(15,23,42,0.05)",
    position: "sticky",
    top: "90px",
  },

  avatarWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginBottom: "24px",
    paddingBottom: "24px",
    borderBottom: "1px solid #f1f5f9",
  },

  avatarCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "14px",
    boxShadow: "0 8px 20px rgba(79,70,229,0.25)",
  },

  avatarIcon: {
    fontSize: "40px",
    color: "#fff",
  },

  avatarName: {
    fontWeight: 700,
    fontSize: "16px",
    color: "#0f172a",
    marginBottom: "4px",
  },

  avatarRole: {
    fontSize: "13px",
    color: "#94a3b8",
    background: "#f1f5f9",
    borderRadius: "999px",
    padding: "2px 10px",
    display: "inline-block",
  },

  metaList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "24px",
  },

  metaItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
  },

  metaIcon: {
    fontSize: "16px",
    color: "#94a3b8",
    marginTop: "1px",
    flexShrink: 0,
  },

  metaText: {
    fontSize: "13px",
    color: "#475569",
    lineHeight: 1.5,
    wordBreak: "break-word",
  },

  savedJobsBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    color: "#334155",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background 0.15s",
  },

  /* ── Forms ── */
  forms: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  card: {
    background: "rgba(255,255,255,0.95)",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "28px",
    boxShadow: "0 4px 16px rgba(15,23,42,0.05)",
  },

  cardTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: "0 0 24px",
    fontSize: "17px",
    fontWeight: 800,
    color: "#0f172a",
  },

  cardIcon: {
    fontSize: "20px",
    color: "#4F46E5",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },

  fieldWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  label: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#475569",
  },

  input: {
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    background: "#fff",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    width: "100%",
    transition: "border-color 0.15s",
  },

  select: {
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    background: "#fff",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    width: "100%",
    cursor: "pointer",
  },

  textarea: {
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    background: "#fff",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    width: "100%",
    minHeight: "100px",
    resize: "vertical",
  },

  helpText: {
    margin: 0,
    fontSize: "12px",
    color: "#94a3b8",
  },

  saveBtn: {
    padding: "11px 28px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 4px 14px rgba(79,70,229,0.3)",
  },

  saveBtnOutline: {
    padding: "11px 28px",
    borderRadius: "12px",
    border: "2px solid #4F46E5",
    background: "transparent",
    color: "#4F46E5",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "inherit",
  },
};

export default StudentProfile;
