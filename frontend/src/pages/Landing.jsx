import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchRandomJobs } from "../api/jobs";
import handshakeImg from "../assets/handshake.jpg";

/* ─── Profesyonel İş İlanı Renk Paleti ────────────────────────────────────────
   LinkedIn / Indeed tarzı: muted steel-blue, warm gray, soft slate
   Göz yormayan, nötr, sakin renkler
   ────────────────────────────────────────────────────────────────────────── */
const pal = {
  // Kart üst alan gradyanları — muted, profesyonel
  cardGrads: [
    "linear-gradient(145deg, #4A6FA5 0%, #6B8CBE 100%)",   // çelik mavi
    "linear-gradient(145deg, #5C7A6E 0%, #7A9E90 100%)",   // soft yeşil-gri
    "linear-gradient(145deg, #6B7280 0%, #8E9BAA 100%)",   // slate gri
    "linear-gradient(145deg, #5B6F8A 0%, #7A95AD 100%)",   // gece mavisi
    "linear-gradient(145deg, #7A6E8A 0%, #9B8FA8 100%)",   // pastel lavanta
    "linear-gradient(145deg, #6E7A5C 0%, #93A07A 100%)",   // olive
  ],

  // Genel sayfa
  bg:         "#F4F5F7",           // çok hafif gri (Indeed arka planı gibi)
  white:      "#FFFFFF",
  border:     "#E4E7EC",

  // Metin
  textDark:   "#111827",
  textMid:    "#374151",
  textMuted:  "#6B7280",

  // Vurgu (çok az kullanılacak)
  accent:     "#2563EB",           // mavi (çok canlı değil, ama distinct)
  accentBg:   "#EFF6FF",
  accentMid:  "#1D4ED8",

  // Badge / etiket
  badgeBg:    "#F0F4F8",
  badgeText:  "#4A5568",
  badgeBorder:"#CBD5E1",
};

// ─── Veriler ──────────────────────────────────────────────────────────────────
const HOW_STUDENT = [
  { step: 1, title: 'Kayıt Ol', desc: 'Öğrenci olarak ücretsiz hesabını oluştur.', icon: 'school', color: '#4A6FA5' },
  { step: 2, title: 'İlanları İncele', desc: 'Kendi yeteneklerine ve zamanına uygun ilanları bul.', icon: 'search', color: '#5C7A6E' },
  { step: 3, title: 'İlanları Kaydet', desc: 'İlgini çeken fırsatları kaydet ve daha sonra başvurmak için takip et.', icon: 'bookmark', color: '#6B7280' },
];

const HOW_EMPLOYER = [
  { step: 1, title: 'Hesap Oluştur', desc: 'İşveren profilini şirket detaylarıyla birlikte eksiksiz tamamla.', icon: 'business_center', color: '#4A6FA5' },
  { step: 2, title: 'İlan Yayınla', desc: 'Aradığın yetenekler ve çalışma şartları için detaylı bir ilan oluştur.', icon: 'post_add', color: '#5C7A6E' },
  { step: 3, title: 'İlanları Yönet', desc: 'Tüm aktif ilanlarını tek bir ekrandan kolayca kontrol et.', icon: 'dashboard', color: '#6B7280' },
];

// ─── Kart Bileşeni ────────────────────────────────────────────────────────────
function FeaturedJobCard({ job }) {
  const navigate = useNavigate();
  const grad = pal.cardGrads[job.id % pal.cardGrads.length];

  return (
    <div
      className="featured-job-card"
      style={cs.wrapper}
      onClick={() => navigate("/login")}
    >
      {/* Üst alan */}
      <div style={{ ...cs.colorTop, background: grad }}>
        <span className="material-symbols-rounded" style={cs.bagIcon}>work</span>
        <div style={cs.loginBadge}>
          <span className="material-symbols-rounded" style={{ fontSize: "12px" }}>lock</span>
          <span>Detay için giriş yap</span>
        </div>
      </div>

      {/* Alt bilgi — footer hep en altta */}
      <div style={cs.infoArea}>
        <div>
          <div style={cs.employerRow}>
            <span className="material-symbols-rounded" style={cs.empIcon}>apartment</span>
            <div>
              <div style={cs.empLabel}>İşveren</div>
              {job.address && (
                <div style={cs.empSub}>
                  {job.address.slice(0, 28)}{job.address.length > 28 ? "…" : ""}
                </div>
              )}
            </div>
          </div>
          <h3 style={{ ...cs.jobTitle, marginTop: "8px" }}>{job.title}</h3>
        </div>

        <div style={cs.footer}>
          <span style={cs.badge}>Yarı Zamanlı</span>
          <button
            style={cs.applyBtn}
            onClick={(e) => { e.stopPropagation(); navigate("/login"); }}
          >
            Görüntüle
          </button>
        </div>
      </div>
    </div>
  );
}

const cs = {
  wrapper: {
    background: pal.white,
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)",
    cursor: "pointer",
    transition: "transform 0.22s ease, box-shadow 0.22s ease",
    minWidth: "218px",
    maxWidth: "235px",
    flex: "0 0 auto",
    /* flex-column: alttaki infoArea space-between için */
    display: "flex",
    flexDirection: "column",
  },
  colorTop: {
    height: "132px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  bagIcon: {
    fontSize: "42px",
    color: "rgba(255,255,255,0.50)",
  },
  loginBadge: {
    position: "absolute",
    bottom: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(0,0,0,0.28)",
    color: "#fff",
    borderRadius: "20px",
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    whiteSpace: "nowrap",
    backdropFilter: "blur(6px)",
  },
  infoArea: {
    padding: "14px 15px 15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1,
    gap: "0",
  },
  employerRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "7px",
  },
  empIcon: {
    fontSize: "16px",
    color: pal.textMuted,
    flexShrink: 0,
    marginTop: "2px",
    border: `1px solid ${pal.border}`,
    borderRadius: "6px",
    padding: "3px",
    background: pal.bg,
  },
  empLabel: {
    fontSize: "11.5px",
    fontWeight: "600",
    color: pal.textMid,
    lineHeight: 1.3,
  },
  empSub: {
    fontSize: "10px",
    color: pal.textMuted,
    lineHeight: 1.3,
  },
  jobTitle: {
    fontSize: "14.5px",
    fontWeight: "700",
    color: pal.textDark,
    margin: 0,
    lineHeight: 1.35,
  },
  footer: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    marginTop: "12px",
  },
  badge: {
    background: pal.badgeBg,
    color: pal.badgeText,
    borderRadius: "20px",
    padding: "3px 9px",
    fontSize: "11px",
    fontWeight: "600",
    border: `1px solid ${pal.badgeBorder}`,
  },
  applyBtn: {
    background: pal.accent,
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    padding: "4px 11px",
    fontSize: "11.5px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "background 0.15s",
    marginLeft: "auto",
  },
};

/* ── CTA Kart Stilleri (st nesnesine eklenecek) ── */
const ctaCardStyle = {
  wrapper: {
    minWidth: "180px",
    maxWidth: "190px",
    flex: "0 0 auto",
    background: "#F0F4F8",
    border: "2px dashed #CBD5E1",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "24px 16px",
    cursor: "pointer",
    transition: "background 0.2s, border-color 0.2s",
    alignSelf: "stretch",
  },
};

// ─── Ana Sayfa ────────────────────────────────────────────────────────────────
function Landing() {
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }, []);

  const isAuthenticated = Boolean(user);
  const isStudent  = user?.role === "STUDENT";
  const isEmployer = user?.role === "EMPLOYER";

  const [jobs, setJobs]           = useState([]);
  const [loadingJobs, setLoading]  = useState(false);
  const [activeHowTab, setHowTab]  = useState('student');

  useEffect(() => {
    if (isAuthenticated) return;
    async function load() {
      try {
        setLoading(true);
        setJobs(await fetchRandomJobs(15));
      } catch { setJobs([]); }
      finally   { setLoading(false); }
    }
    load();
  }, [isAuthenticated]);

  /* ── Ziyaretçi ── */
  function renderGuest() {
    return (
      <div style={{ width: "100%" }}>
        {/* Hero */}
        <section
          style={{
            ...st.hero,
            backgroundImage: `linear-gradient(rgba(17,24,39,0.62), rgba(30,42,60,0.55)), url(${handshakeImg})`,
          }}
        >
          <div style={st.heroInner}>
            <div style={st.heroBadge}>
              <span className="material-symbols-rounded" style={{ fontSize: "14px" }}>bolt</span>
              Öğrenciler için yarı zamanlı fırsatlar
            </div>
            <h1 style={st.heroTitle}>
              İş İlanlarına Başvur,<br />Kariyerine Yön Ver!
            </h1>
            <div style={{ marginTop: "40px" }}>
              <p style={st.heroSub}>Sana Nasıl Yardımcı Olabiliriz?</p>
              <div style={st.pillGrid}>
                <div className="pill-card-hover" style={st.pillCard}
                  onClick={() => navigate("/register?role=STUDENT")}>
                  <span className="material-symbols-rounded" style={{ fontSize: "20px", color: "#4A6FA5" }}>school</span>
                  <span>Öğrenci Başvurusu</span>
                </div>
                <div className="pill-card-hover" style={st.pillCard}
                  onClick={() => navigate("/register?role=EMPLOYER")}>
                  <span className="material-symbols-rounded" style={{ fontSize: "20px", color: "#5C7A6E" }}>business_center</span>
                  <span>İşveren Başvurusu</span>
                </div>
                <div className="pill-card-hover" style={st.pillCard}
                  onClick={() => navigate("/login")}>
                  <span className="material-symbols-rounded" style={{ fontSize: "20px", color: "#6B7280" }}>login</span>
                  <span>Giriş Yap</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* İlanlar */}
        <section style={st.jobsSection}>
          <div style={st.jobsInner}>
            <h2 style={st.secTitle}>Öne Çıkan İlanlar</h2>
            <p style={st.secSub}>En güncel yarı zamanlı fırsatlar</p>

            <div style={st.rowWrap}>
              {loadingJobs ? (
                <div style={st.state}>İlanlar yükleniyor…</div>
              ) : jobs.length === 0 ? (
                <div style={st.state}>Şu anda aktif ilan bulunmuyor.</div>
              ) : (
                /* paddingTop → hover'da kart kesilmesini önler */
                <div className="scroll-row-hide" style={st.scrollRow}>
                  {jobs.map((job) => (
                    <FeaturedJobCard key={job.id} job={job} />
                  ))}
                  {/* Scroll sonu CTA kartı */}
                  <div style={st.loginCta} onClick={() => navigate("/login")}>
                    <span className="material-symbols-rounded" style={st.ctaIcon}>login</span>
                    <p style={st.ctaText}>Daha fazla ilan için</p>
                    <button style={st.ctaBtn}>Giriş Yap →</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        {/* ── Nasıl Çalışır ── */}
        <section style={st.howSection}>
          <div style={st.howInner}>
            <h2 style={st.howTitle}>Nasıl Çalışır?</h2>

            {/* Toggle */}
            <div style={st.tabWrap}>
              <button
                className="how-tab-btn"
                style={activeHowTab === 'student' ? { ...st.tabBtn, ...st.tabBtnActive } : st.tabBtn}
                onClick={() => setHowTab('student')}
              >
                <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>school</span>
                Öğrenci
              </button>
              <button
                className="how-tab-btn"
                style={activeHowTab === 'employer' ? { ...st.tabBtn, ...st.tabBtnActive } : st.tabBtn}
                onClick={() => setHowTab('employer')}
              >
                <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>business_center</span>
                İşveren
              </button>
            </div>

            {/* Steps */}
            <div style={st.stepsRow}>
              {(activeHowTab === 'student' ? HOW_STUDENT : HOW_EMPLOYER).map((step, i, arr) => (
                <>
                  <div key={step.step} className="how-step-card" style={st.stepCard}>
                    <div style={{ ...st.stepNumCircle, background: step.color }}>
                      <span className="material-symbols-rounded" style={{ fontSize: '26px', color: '#fff' }}>
                        {step.icon}
                      </span>
                    </div>
                    <div style={st.stepMeta}>
                      <span style={st.stepNum}>Adım {step.step}</span>
                      <h3 style={st.stepTitle}>{step.title}</h3>
                      <p style={st.stepDesc}>{step.desc}</p>
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div key={`arrow-${i}`} style={st.stepArrow}>
                      <span className="material-symbols-rounded" style={{ fontSize: '28px', color: '#CBD5E1' }}>arrow_forward</span>
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section style={st.ctaBanner}>
          <div style={st.ctaBannerInner}>
            <div style={st.ctaBannerGlow} />
            <p style={st.ctaBannerEyebrow}>Hemen Başla</p>
            <h2 style={st.ctaBannerTitle}>Kariyerine İlk Adımı At</h2>
            <p style={st.ctaBannerSub}>
              Ücretsiz hesap oluştur, binlerce yarı zamanlı fırsata anında eriş.
            </p>
            <div style={st.ctaBannerBtns}>
              <button className="cta-hover-btn-primary" style={st.ctaPrimaryBtn} onClick={() => navigate('/register?role=STUDENT')}>
                <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>school</span>
                Öğrenci Olarak Kaydol
              </button>
              <button className="cta-hover-btn-secondary" style={st.ctaSecondaryBtn} onClick={() => navigate('/register?role=EMPLOYER')}>
                <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>business_center</span>
                İşveren Olarak Kaydol
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* ── Öğrenci ── */
  function renderStudent() {
    return (
      <div style={st.jobsSection}>
        <div style={st.jobsInner}>
          <h2 style={st.secTitle}>Öğrenci Paneli</h2>
          <div style={{ ...st.pillGrid, marginTop: "24px" }}>
            <div className="pill-card-hover" style={st.pillCard}
              onClick={() => navigate("/feed")}>
              <span className="material-symbols-rounded" style={{ fontSize: "28px", color: "#4A6FA5" }}>search</span>
              <span style={{ fontWeight: "700" }}>İş İlanlarını Gör</span>
            </div>
            <div className="pill-card-hover" style={st.pillCard}
              onClick={() => navigate("/saved-jobs")}>
              <span className="material-symbols-rounded" style={{ fontSize: "28px", color: "#4A6FA5" }}>bookmark</span>
              <span style={{ fontWeight: "700" }}>Kaydedilen İlanlar</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── İşveren ── */
  function renderEmployer() {
    return (
      <div style={st.jobsSection}>
        <div style={st.jobsInner}>
          <h2 style={st.secTitle}>İşveren Kontrol Merkezi</h2>
          <div style={{ ...st.pillGrid, gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", marginTop: "24px" }}>
            <div className="pill-card-hover" style={st.pillCard}
              onClick={() => navigate("/employer/dashboard")}>
              <span className="material-symbols-rounded" style={{ fontSize: "28px", color: "#4A6FA5" }}>dashboard</span>
              <span style={{ fontWeight: "700" }}>Panel</span>
            </div>
            <div className="pill-card-hover" style={st.pillCard}
              onClick={() => navigate("/employer/jobs")}>
              <span className="material-symbols-rounded" style={{ fontSize: "28px", color: "#5C7A6E" }}>work</span>
              <span style={{ fontWeight: "700" }}>İlanlarım</span>
            </div>
            <div className="pill-card-hover" style={st.pillCard}
              onClick={() => navigate("/employer/jobs/new")}>
              <span className="material-symbols-rounded" style={{ fontSize: "28px", color: "#6B7280" }}>add_circle</span>
              <span style={{ fontWeight: "700" }}>Yeni İlan Oluştur</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ paddingTop: '70px', flex: 1, background: pal.bg }}>
        {!isAuthenticated && renderGuest()}
        {isAuthenticated && isStudent  && renderStudent()}
        {isAuthenticated && isEmployer && renderEmployer()}
      </main>

      {/* ── Footer ── */}
      <footer style={st.footer}>
        <div style={st.footerInner}>
          <span style={st.footerLogo}>Jobsy</span>
          <span style={st.footerCopy}>© 2026 Jobsy. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

// ─── Page Styles ──────────────────────────────────────────────────────────────
const st = {
  hero: {
    width: "100%",
    minHeight: "500px",
    display: "flex",
    alignItems: "center",
    backgroundSize: "cover",
    backgroundPosition: "center top",
    overflow: "hidden",
  },
  heroInner: {
    maxWidth: "1320px",
    margin: "0 auto",
    padding: "80px 32px",
    width: "100%",
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(255,255,255,0.13)",
    border: "1px solid rgba(255,255,255,0.28)",
    backdropFilter: "blur(8px)",
    color: "#fff",
    borderRadius: "999px",
    padding: "6px 14px",
    fontSize: "12.5px",
    fontWeight: "600",
    marginBottom: "18px",
    letterSpacing: "0.02em",
  },
  heroTitle: {
    color: "#fff",
    fontSize: "clamp(30px, 3.8vw, 50px)",
    fontWeight: "800",
    margin: 0,
    maxWidth: "620px",
    lineHeight: 1.22,
    letterSpacing: "-0.02em",
    textShadow: "0 2px 16px rgba(0,0,0,0.18)",
  },
  heroSub: {
    color: "rgba(255,255,255,0.75)",
    fontSize: "15px",
    marginBottom: "16px",
    fontWeight: "500",
  },
  pillGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(185px,1fr))",
    gap: "12px",
    maxWidth: "680px",
  },
  pillCard: {
    background: "rgba(255,255,255,0.93)",
    borderRadius: "10px",
    padding: "13px 16px",
    display: "flex",
    alignItems: "center",
    gap: "11px",
    cursor: "pointer",
    boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
    color: "#1F2937",
    fontWeight: "600",
    fontSize: "13.5px",
    backdropFilter: "blur(6px)",
    border: "1px solid rgba(255,255,255,0.8)",
  },

  jobsSection: {
    width: "100%",
    padding: "56px 0 72px",
    background: pal.bg,
  },
  jobsInner: {
    maxWidth: "1320px",
    margin: "0 auto",
    padding: "0 32px",
  },
  secTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#111827",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  secSub: {
    fontSize: "14px",
    color: "#6B7280",
    margin: "6px 0 0 0",
  },
  rowWrap: {
    marginTop: "28px",
    /* overflow visible so cards can lift on hover without clipping */
    overflow: "visible",
  },
  scrollRow: {
    display: "flex",
    gap: "16px",
    overflowX: "auto",
    /* paddingTop → kart hover'da yukarı kalkınca kesilmemesi için */
    paddingTop: "10px",
    paddingBottom: "12px",
    scrollbarWidth: "none",
  },
  state: {
    background: "#fff",
    border: "1px solid #E4E7EC",
    borderRadius: "12px",
    padding: "32px",
    textAlign: "center",
    color: "#6B7280",
    fontSize: "14px",
  },
  loginCta: {
    minWidth: "170px",
    maxWidth: "185px",
    flex: "0 0 auto",
    background: "#F8FAFC",
    border: "2px dashed #CBD5E1",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "20px 14px",
    cursor: "pointer",
    transition: "background 0.2s, border-color 0.2s",
    alignSelf: "stretch",
  },
  ctaIcon: {
    fontSize: "32px",
    color: "#4A6FA5",
  },
  ctaText: {
    fontSize: "12.5px",
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
    margin: 0,
    lineHeight: 1.35,
  },
  ctaBtn: {
    background: "#2563EB",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    padding: "7px 16px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  // ── NASIL ÇALIŞIR STİLLERİ ──
  howSection: {
    padding: '80px 32px',
    background: '#FFFFFF',
    borderTop: '1px solid #E4E7EC',
  },
  howInner: {
    maxWidth: '1000px',
    margin: '0 auto',
    textAlign: 'center',
  },
  howEyebrow: {
    color: '#4A6FA5',
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  howTitle: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#111827',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  howDesc: {
    fontSize: '16px',
    color: '#6B7280',
    marginTop: '12px',
    marginBottom: '40px',
  },
  tabWrap: {
    display: 'inline-flex',
    background: '#F4F5F7',
    padding: '4px',
    borderRadius: '12px',
    marginBottom: '40px',
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 20px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: '#6B7280',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabBtnActive: {
    background: '#FFFFFF',
    color: '#111827',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  stepsRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: '16px',
  },
  stepCard: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '28px 20px',
    background: '#FFFFFF',
    border: '1px solid #E4E7EC',
    borderRadius: '18px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
  },
  stepNumCircle: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  stepMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  stepNum: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  stepTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  stepDesc: {
    fontSize: '13.5px',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 1.5,
    margin: 0,
  },
  stepArrow: {
    marginTop: '65px',
  },

  // ── CTA BANNER STİLLERİ ──
  ctaBanner: {
    width: '100%',
    padding: '80px 32px',
    background: 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  ctaBannerInner: {
    maxWidth: '1000px',
    margin: '0 auto',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  },
  ctaBannerGlow: {
    position: 'absolute',
    top: '-50%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(74,111,165,0.20) 0%, rgba(0,0,0,0) 70%)',
    pointerEvents: 'none',
  },
  ctaBannerEyebrow: {
    color: '#93C5FD',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '12px',
    position: 'relative',
  },
  ctaBannerTitle: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#FFFFFF',
    margin: 0,
    letterSpacing: '-0.02em',
    position: 'relative',
  },
  ctaBannerSub: {
    fontSize: '16px',
    color: '#94A3B8',
    marginTop: '12px',
    marginBottom: '32px',
    position: 'relative',
  },
  ctaBannerBtns: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    position: 'relative',
  },
  ctaPrimaryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#4A6FA5',
    color: '#FFFFFF',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  ctaSecondaryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: '#FFFFFF',
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },

  // ── FOOTER STİLLERİ ──
  footer: {
    background: '#FFFFFF',
    borderTop: '1px solid #E4E7EC',
    padding: '28px 32px',
  },
  footerInner: {
    maxWidth: '1320px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLogo: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#111827',
    letterSpacing: '-0.02em',
  },
  footerCopy: {
    fontSize: '14px',
    color: '#6B7280',
    fontWeight: '500',
  },
};


export default Landing;