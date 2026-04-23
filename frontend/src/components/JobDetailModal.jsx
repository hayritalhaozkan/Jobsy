import { useEffect, useState } from "react";
import { fetchJobDetail, checkJobSaved, saveJob, unsaveJob } from "../api/jobs";
import { useToast } from "../context/ToastContext";
import { MapView } from "./Map";

function JobDetailModal({ jobId, onClose }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    async function loadJob() {
      if (!jobId) return;
      try {
        setLoading(true);
        const [data, saveStatus] = await Promise.all([
          fetchJobDetail(jobId),
          checkJobSaved(jobId)
        ]);
        setJob(data);
        setIsSaved(saveStatus.isSaved);
      } catch (err) {
        console.error("Job detail error:", err);
        setJob(null);
      } finally {
        setLoading(false);
      }
    }

    loadJob();
  }, [jobId]);

  const toggleSave = async () => {
    if (!jobId) return;
    
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      showToast({ type: "error", title: "Hata", message: "İlanları kaydetmek için giriş yapmalısınız." });
      return;
    }
    
    try {
      if (isSaved) {
        await unsaveJob(jobId);
        setIsSaved(false);
        showToast({ type: "info", title: "Bilgi", message: "İlan kaydedilenlerden çıkarıldı." });
      } else {
        await saveJob(jobId);
        setIsSaved(true);
        showToast({ type: "success", title: "Başarılı", message: "İlan başarıyla kaydedildi!" });
      }
    } catch (err) {
      console.error("Error toggling save status:", err);
      showToast({ type: "error", title: "Hata", message: "İşlem başarısız (Öğrenci girişi gerekebilir)." });
    }
  };

  if (!jobId) return null;

  const whatsappHref = job?.contact_whatsapp
    ? `https://wa.me/${String(job.contact_whatsapp).replace(/\D/g, "")}`
    : null;

  const phoneHref = job?.contact_phone ? `tel:${job.contact_phone}` : null;
  const emailHref = job?.contact_email ? `mailto:${job.contact_email}` : null;
  const urlHref = job?.contact_url || null;

  return (
    <div
      id="modal-backdrop"
      style={styles.backdrop}
    >
      <div style={styles.modalBox}>
        {/* Header Icons Container */}
        <div style={styles.modalHeaderIcons}>
          <button style={{...styles.iconButton, color: isSaved ? '#4f46e5' : '#64748b'}} title={isSaved ? "Kaydedildi" : "Kaydet"} onClick={toggleSave}>
            <span className="material-symbols-rounded">
              {isSaved ? "bookmark" : "bookmark_border"}
            </span>
          </button>
          <button style={styles.iconButton} title="Kapat" onClick={onClose}>
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>

        <div style={styles.modalContent}>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
              İlan detayları yükleniyor...
            </div>
          ) : !job ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
              İlan bulunamadı.
            </div>
          ) : (
            <>
              {/* Top Hero equivalent inside Modal */}
              <div style={styles.hero}>
                <h1 style={styles.title}>{job.title}</h1>
                <div style={styles.subInfo}>
                  {job.company_name && (
                    <div style={styles.subInfoItem}>
                      <span className="material-symbols-rounded" style={{ fontSize: '20px' }}>
                        apartment
                      </span>
                      {job.company_name}
                    </div>
                  )}
                  {/* Avatar row mimicking the pop-up design from image */}
                  <div style={styles.authorRow}>
                    <div style={styles.avatar}>
                      <span className="material-symbols-rounded" style={{ color: '#fff', fontSize: '20px' }}>person</span>
                    </div>
                    <div style={styles.authorInfo}>
                      <div style={styles.authorName}>
                        {job.company_name || "Bilinmeyen İşletme"} <span style={styles.authorBadge}>İşveren</span>
                      </div>
                      <div style={styles.authorDate}>
                        Oluşturulma: {new Date(job.created_at || Date.now()).toLocaleDateString("tr-TR", { day: 'numeric', month: 'short', year: 'numeric'})}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* General Grid from JobDetail.jsx */}
              <section style={styles.infoGrid}>
                <div style={styles.detailInfoCard}>
                  <div style={styles.infoLabel}>
                    <span className="material-symbols-rounded">payments</span>
                    ÜCRET
                  </div>
                  <div style={styles.infoValue}>
                    {job.salary || "Belirtilmedi"}
                  </div>
                </div>

                <div style={styles.detailInfoCard}>
                  <div style={styles.infoLabel}>
                    <span className="material-symbols-rounded">schedule</span>
                    ÇALIŞMA SAATLERİ
                  </div>
                  <div style={styles.infoValue}>
                    {job.work_schedule || "Belirtilmedi"}
                  </div>
                </div>

                <div style={styles.detailInfoCard}>
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

                <div style={styles.detailInfoCard}>
                  <div style={styles.infoLabel}>
                    <span className="material-symbols-rounded">person</span>
                    İLETİŞİM KİŞİSİ
                  </div>
                  <div style={styles.infoValue}>
                    {job.contact_person || "Belirtilmedi"}
                  </div>
                </div>
              </section>

              {/* Description */}
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  <span className="material-symbols-rounded">description</span>
                  İş Tanımı
                </h2>
                <p style={styles.paragraph}>
                  {job.description || "Açıklama bulunmuyor."}
                </p>
              </section>

              {/* Map View */}
              {job.lat && job.lng && (
                <section style={styles.section}>
                  <h2 style={styles.sectionTitle}>
                    <span className="material-symbols-rounded">map</span>
                    Konum
                  </h2>
                  <MapView lat={job.lat} lng={job.lng} popupText={job.company_name || job.title} />
                </section>
              )}

              {/* Contact Info */}
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

              {/* Action Buttons bar */}
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
                      WhatsApp ile Başvur
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
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(15, 23, 42, 0.4)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
  },
  modalBox: {
    width: "100%",
    maxWidth: "800px",
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    display: "flex",
    flexDirection: "column",
    maxHeight: "90vh",
    position: "relative",
    animation: "modalFadeIn 0.2s ease-out forwards",
  },
  modalHeaderIcons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    padding: "16px 24px",
    borderBottom: "1px solid #f1f5f9",
  },
  iconButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px",
    borderRadius: "6px",
    transition: "background 0.2s ease",
  },
  modalContent: {
    padding: "32px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  hero: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  title: {
    margin: 0,
    fontSize: "32px",
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
    color: "#0f172a",
    fontWeight: 800,
  },
  subInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  subInfoItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#6366f1",
    fontWeight: 600,
    fontSize: "16px",
  },
  authorRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "#3b82f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  authorInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  authorName: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#0f172a",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  authorBadge: {
    background: "#1e293b",
    color: "#fff",
    fontSize: "11px",
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: "999px",
  },
  authorDate: {
    fontSize: "13px",
    color: "#64748b",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  detailInfoCard: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "16px",
  },
  infoLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#94a3b8",
    marginBottom: "8px",
  },
  infoValue: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#0f172a",
    lineHeight: 1.5,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "20px",
    color: "#0f172a",
    fontWeight: 700,
    margin: 0,
  },
  paragraph: {
    lineHeight: 1.7,
    color: "#334155",
    whiteSpace: "pre-wrap",
    margin: 0,
    fontSize: "16px",
  },
  contactList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  contactRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#334155",
    background: "#f1f5f9",
    padding: "12px 16px",
    borderRadius: "8px",
    fontWeight: 500,
  },
  emptyText: {
    color: "#94a3b8",
  },
  bottomBar: {
    marginTop: "16px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
  },
  bottomTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#0f172a",
  },
  bottomMeta: {
    color: "#14b8a6",
    fontWeight: 600,
    marginTop: "4px",
  },
  actionButtons: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
};

export default JobDetailModal;
