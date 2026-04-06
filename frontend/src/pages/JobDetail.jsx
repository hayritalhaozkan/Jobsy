import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchJobDetail } from "../api/jobs";
import Navbar from "../components/Navbar";

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJob() {
      try {
        setLoading(true);
        const data = await fetchJobDetail(id);
        setJob(data);
      } catch (err) {
        console.error("Job detail error:", err);
        setJob(null);
      } finally {
        setLoading(false);
      }
    }

    loadJob();
  }, [id]);

  const whatsappHref = job?.contact_whatsapp
    ? `https://wa.me/${String(job.contact_whatsapp).replace(/\D/g, "")}`
    : null;

  const phoneHref = job?.contact_phone ? `tel:${job.contact_phone}` : null;
  const emailHref = job?.contact_email ? `mailto:${job.contact_email}` : null;
  const urlHref = job?.contact_url || null;

  return (
    <div style={styles.page}>
      <Navbar />

      <main style={styles.main}>
        <div style={styles.container}>
          <button className="back-btn" onClick={() => navigate(-1)}>
            <span className="material-symbols-rounded" style={{ fontSize: '18px' }}>arrow_back</span>
            İlanlara Dön
          </button>

          {loading ? (
            <div style={styles.stateBox}>İlan yükleniyor...</div>
          ) : !job ? (
            <div style={styles.stateBox}>İlan bulunamadı.</div>
          ) : (
            <>
              <section style={styles.hero}>
                <h1 style={styles.title}>{job.title}</h1>

                <div style={styles.subInfo}>
                  {job.employer_name && (
                    <div style={styles.subInfoItem}>
                      <span className="material-symbols-rounded">
                        apartment
                      </span>
                      {job.employer_name}
                    </div>
                  )}
                </div>
              </section>

              <section style={styles.infoGrid}>
                <div className="detail-info-card">
                  <div style={styles.infoLabel}>
                    <span className="material-symbols-rounded">payments</span>
                    ÜCRET
                  </div>
                  <div style={styles.infoValue}>
                    {job.salary || "Belirtilmedi"}
                  </div>
                </div>

                <div className="detail-info-card">
                  <div style={styles.infoLabel}>
                    <span className="material-symbols-rounded">schedule</span>
                    ÇALIŞMA SAATLERİ
                  </div>
                  <div style={styles.infoValue}>
                    {job.work_schedule || "Belirtilmedi"}
                  </div>
                </div>

                <div className="detail-info-card">
                  <div style={styles.infoLabel}>
                    <span className="material-symbols-rounded">
                      location_on
                    </span>
                    ADRES
                  </div>
                  <div style={styles.infoValue}>
                    {job.address || "Belirtilmedi"}
                  </div>
                </div>

                <div className="detail-info-card">
                  <div style={styles.infoLabel}>
                    <span className="material-symbols-rounded">person</span>
                    İLETİŞİM KİŞİSİ
                  </div>
                  <div style={styles.infoValue}>
                    {job.contact_person || "Belirtilmedi"}
                  </div>
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <span className="material-symbols-rounded">description</span>
                  İş Tanımı
                </h2>

                <p style={styles.paragraph}>
                  {job.description || "Açıklama bulunmuyor."}
                </p>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <span className="material-symbols-rounded">call</span>
                  İletişim Bilgileri
                </h2>

                <div style={styles.contactList}>
                  {job.contact_phone && (
                    <div style={styles.contactRow}>
                      <span className="material-symbols-rounded">
                        phone_iphone
                      </span>
                      {job.contact_phone}
                    </div>
                  )}

                  {job.contact_email && (
                    <div style={styles.contactRow}>
                      <span className="material-symbols-rounded">mail</span>
                      {job.contact_email}
                    </div>
                  )}

                  {job.contact_whatsapp && (
                    <div style={styles.contactRow}>
                      <span className="material-symbols-rounded">chat</span>
                      {job.contact_whatsapp}
                    </div>
                  )}

                  {!job.contact_phone &&
                    !job.contact_email &&
                    !job.contact_whatsapp && (
                      <div style={styles.emptyText}>
                        Bu ilan için iletişim bilgisi eklenmemiş.
                      </div>
                    )}
                </div>
              </section>

              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <span className="material-symbols-rounded">map</span>
                  Konum
                </h2>

                <div style={styles.mapPlaceholder}>
                  Harita entegrasyonu daha sonra eklenecek
                </div>

                <button style={styles.mapButton} disabled>
                  📍 Haritada Aç
                </button>
              </section>

              <section style={styles.bottomBar}>
                <div>
                  <div style={styles.bottomTitle}>{job.title}</div>
                  <div style={styles.bottomMeta}>
                    {job.salary || "Ücret belirtilmedi"}
                  </div>
                </div>

                <div style={styles.actionButtons}>
                  {whatsappHref && (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary"
                    >
                      WhatsApp ile Mesaj Gönder
                    </a>
                  )}

                  {phoneHref && (
                    <a href={phoneHref} className="btn-secondary">
                      Telefonla Ara
                    </a>
                  )}

                  {emailHref && (
                    <a href={emailHref} className="btn-secondary">
                      E-posta Gönder
                    </a>
                  )}

                  {urlHref && (
                    <a
                      href={urlHref}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary"
                    >
                      Başvuru Linki
                    </a>
                  )}

                  {!whatsappHref && !phoneHref && !emailHref && !urlHref && (
                    <div style={styles.noActionText}>
                      Bu ilan için doğrudan aksiyon bilgisi eklenmemiş.
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
  },

  main: {
    paddingTop: "110px",
    paddingBottom: "60px",
  },

  container: {
    maxWidth: "1320px",
    margin: "0 auto",
    padding: "0 16px",
  },

  stateBox: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "24px",
  },

  hero: {
    marginBottom: "28px",
  },

  title: {
    fontSize: "clamp(34px,5vw,54px)",
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
    color: "#0f172a",
    margin: 0,
  },

  subInfo: {
    marginTop: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  subInfoItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#6366f1",
    fontWeight: 600,
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: "16px",
    marginBottom: "30px",
  },

  infoLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#94a3b8",
    marginBottom: "10px",
  },

  infoValue: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#0f172a",
    lineHeight: 1.6,
  },

  section: {
    marginBottom: "30px",
  },

  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "18px",
    color: "#0f172a",
    marginBottom: "14px",
  },

  paragraph: {
    lineHeight: 1.8,
    color: "#475569",
    whiteSpace: "pre-wrap",
  },

  contactList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  contactRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#475569",
  },

  emptyText: {
    color: "#94a3b8",
  },

  mapPlaceholder: {
    width: "100%",
    minHeight: "280px",
    borderRadius: "18px",
    border: "1px dashed #cbd5e1",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    marginBottom: "14px",
  },

  mapButton: {
    border: "1px solid #d1d5db",
    background: "#fff",
    borderRadius: "12px",
    padding: "10px 14px",
    fontWeight: 600,
    cursor: "not-allowed",
  },

  bottomBar: {
    marginTop: "36px",
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "22px",
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
  },

  bottomTitle: {
    fontSize: "22px",
    fontWeight: 700,
  },

  bottomMeta: {
    color: "#14b8a6",
    fontWeight: 600,
  },

  actionButtons: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  noActionText: {
    color: "#94a3b8",
    fontWeight: 600,
  },
};

export default JobDetail;