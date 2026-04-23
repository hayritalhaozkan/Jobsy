import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchUniversities } from "../api/universities";
import { fetchJobDetail, updateJob } from "../api/jobs";
import { useToast } from "../context/ToastContext";
import { JOB_CATEGORIES } from "../constants/categories";
import { MapPicker } from "../components/Map";

function EmployerEditJob() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();

  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    companyName: "",
    description: "",
    universityId: "",
    salary: "",
    workSchedule: "",
    address: "",
    contactPerson: "",
    contactWhatsapp: "",
    contactPhone: "",
    contactEmail: "",
    contactUrl: "",
    contactNote: "",
    category: "",
    lat: null,
    lng: null,
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [uniData, jobData] = await Promise.all([
          fetchUniversities(),
          fetchJobDetail(id),
        ]);

        setUniversities(uniData || []);

        setForm({
          title: jobData.title || "",
          companyName: jobData.company_name || "",
          description: jobData.description || "",
          universityId: jobData.university_id || "",
          salary: jobData.salary || "",
          workSchedule: jobData.work_schedule || "",
          address: jobData.address || "",
          contactPerson: jobData.contact_person || "",
          contactWhatsapp: jobData.contact_whatsapp || "",
          contactPhone: jobData.contact_phone || "",
          contactEmail: jobData.contact_email || "",
          contactUrl: jobData.contact_url || "",
          contactNote: jobData.contact_note || "",
          category: jobData.category || "",
          lat: jobData.lat || null,
          lng: jobData.lng || null,
        });
      } catch (err) {
        console.error("Edit job load error:", err);

        showToast({
          type: "error",
          title: "İlan verileri alınamadı",
        });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, showToast]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.title ||
      !form.companyName ||
      !form.description ||
      !form.universityId ||
      !form.contactPerson
    ) {
      showToast({
        type: "warning",
        title: "Eksik bilgi",
        message: "Lütfen zorunlu alanları doldur.",
      });
      return;
    }

    if (
      !form.contactWhatsapp &&
      !form.contactPhone &&
      !form.contactEmail &&
      !form.contactUrl
    ) {
      showToast({
        type: "warning",
        title: "İletişim bilgisi gerekli",
        message: "En az bir iletişim yöntemi girmen gerekiyor.",
      });
      return;
    }

    try {
      setSaving(true);

      await updateJob(id, {
        title: form.title,
        companyName: form.companyName,
        description: form.description,
        universityId: Number(form.universityId),
        salary: form.salary,
        workSchedule: form.workSchedule,
        address: form.address,
        contactPerson: form.contactPerson,
        contactWhatsapp: form.contactWhatsapp,
        contactPhone: form.contactPhone,
        contactEmail: form.contactEmail,
        contactUrl: form.contactUrl,
        contactNote: form.contactNote,
        category: form.category || null,
        lat: form.lat,
        lng: form.lng,
      });

      showToast({
        type: "success",
        title: "İlan güncellendi",
        message: "Değişiklikler başarıyla kaydedildi.",
      });

      navigate("/employer/jobs");
    } catch (err) {
      console.error("Update job error:", err);

      showToast({
        type: "error",
        title: "İlan güncellenemedi",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={styles.page}>
      <Navbar />

      <main style={styles.main}>
        <div style={styles.container}>
          <div style={styles.headerBlock}>
            <h1 style={styles.title}>İlanı Düzenle</h1>
            <p style={styles.subtitle}>
              Mevcut ilan detaylarını güncelleyerek daha doğru adaylara ulaş.
            </p>
          </div>

          {loading ? (
            <div style={styles.stateBox}>İlan verileri yükleniyor...</div>
          ) : (
            <form onSubmit={handleSubmit} style={styles.formCard}>
              <div style={styles.grid}>
                <div style={styles.fullWidth}>
                  <label style={styles.label}>İşletme Adı *</label>
                  <input
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Örn: Kampüs Kafe"
                  />
                </div>

                <div style={styles.fullWidth}>
                  <label style={styles.label}>İlan Başlığı *</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Örn: Part-Time Kafe Çalışanı"
                  />
                </div>

                <div style={styles.fullWidth}>
                  <label style={styles.label}>Açıklama *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    style={styles.textarea}
                    placeholder="İş tanımı, beklentiler, görevler..."
                  />
                </div>

                <div>
                  <label style={styles.label}>Üniversite *</label>
                  <select
                    name="universityId"
                    value={form.universityId}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="">Üniversite seç</option>
                    {universities.map((uni) => (
                      <option key={uni.id} value={uni.id}>
                        {uni.display_name || uni.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={styles.label}>Kategori</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="">Kategori seç</option>
                    {JOB_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={styles.label}>Ücret</label>
                  <input
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Örn: Saatlik 180 TL"
                  />
                </div>

                <div>
                  <label style={styles.label}>Çalışma Saatleri</label>
                  <input
                    name="workSchedule"
                    value={form.workSchedule}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Örn: Hafta içi 16:00 - 21:00"
                  />
                </div>

                <div>
                  <label style={styles.label}>Adres</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Örn: Selçuklu / Konya"
                  />
                </div>

                <div style={styles.fullWidth}>
                  <label style={styles.label}>Harita Konumu</label>
                  <MapPicker 
                    lat={form.lat} 
                    lng={form.lng} 
                    onChange={(lat, lng) => setForm((prev) => ({ ...prev, lat, lng }))} 
                  />
                </div>

                <div>
                  <label style={styles.label}>İletişim Kişisi *</label>
                  <input
                    name="contactPerson"
                    value={form.contactPerson}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Örn: Ahmet Yılmaz"
                  />
                </div>

                <div>
                  <label style={styles.label}>WhatsApp</label>
                  <input
                    name="contactWhatsapp"
                    value={form.contactWhatsapp}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="+90555..."
                  />
                </div>

                <div>
                  <label style={styles.label}>Telefon</label>
                  <input
                    name="contactPhone"
                    value={form.contactPhone}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="+90555..."
                  />
                </div>

                <div>
                  <label style={styles.label}>E-posta</label>
                  <input
                    name="contactEmail"
                    value={form.contactEmail}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="ornek@mail.com"
                  />
                </div>

                <div>
                  <label style={styles.label}>Başvuru Linki</label>
                  <input
                    name="contactUrl"
                    value={form.contactUrl}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="https://..."
                  />
                </div>

                <div style={styles.fullWidth}>
                  <label style={styles.label}>İletişim Notu</label>
                  <textarea
                    name="contactNote"
                    value={form.contactNote}
                    onChange={handleChange}
                    style={styles.textareaSmall}
                    placeholder="Örn: 09:00 - 17:00 arası iletişime geçin."
                  />
                </div>
              </div>

              <div style={styles.actions}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => navigate("/employer/jobs")}
                >
                  Vazgeç
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8fafc 0%, #eef4ff 35%, #ffffff 100%)",
  },

  main: {
    paddingTop: "110px",
    paddingBottom: "60px",
  },

  container: {
    maxWidth: "1320px",
    margin: "0 auto",
    padding: "0 24px",
  },

  headerBlock: {
    marginBottom: "24px",
  },

  title: {
    margin: 0,
    fontSize: "clamp(34px, 5vw, 56px)",
    lineHeight: 1.04,
    letterSpacing: "-0.03em",
    color: "#0f172a",
  },

  subtitle: {
    marginTop: "12px",
    marginBottom: 0,
    color: "#64748b",
    fontSize: "17px",
    lineHeight: 1.7,
    maxWidth: "720px",
  },

  stateBox: {
    background: "rgba(255,255,255,0.82)",
    border: "1px solid rgba(226,232,240,0.9)",
    borderRadius: "20px",
    padding: "24px",
    color: "#475569",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
  },

  formCard: {
    background: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(226,232,240,0.95)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.06)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
  },

  fullWidth: {
    gridColumn: "1 / -1",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#334155",
    fontWeight: 700,
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid #dbe2ea",
    background: "#fff",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  select: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid #dbe2ea",
    background: "#fff",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    minHeight: "140px",
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid #dbe2ea",
    background: "#fff",
    outline: "none",
    fontSize: "15px",
    resize: "vertical",
    boxSizing: "border-box",
  },

  textareaSmall: {
    width: "100%",
    minHeight: "100px",
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid #dbe2ea",
    background: "#fff",
    outline: "none",
    fontSize: "15px",
    resize: "vertical",
    boxSizing: "border-box",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "24px",
  },
};

export default EmployerEditJob;