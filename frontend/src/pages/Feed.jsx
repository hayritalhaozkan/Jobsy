import { useEffect, useState, useMemo } from "react";
import { fetchJobsByUniversity } from "../api/jobs";
import { fetchUniversities } from "../api/universities";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import FilterSidebar from "../components/FilterSidebar";
import JobDetailModal from "../components/JobDetailModal";

/* ── Varsayılan filtre değerleri ── */
const DEFAULT_FILTERS = {
  universityId: null,   // Kullanıcının üniversitesi
  category: "all",
  search: "",
  sortOrder: "newest",
};

function Feed() {
  /* ─── State ─── */
  const [universities, setUniversities] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      return { ...DEFAULT_FILTERS, universityId: u?.universityId ?? 3 };
    } catch {
      return { ...DEFAULT_FILTERS, universityId: 3 };
    }
  });
  const [selectedJobId, setSelectedJobId] = useState(null);

  /* ─── Üniversiteleri yükle ─── */
  useEffect(() => {
    fetchUniversities()
      .then(setUniversities)
      .catch((err) => console.error("Universities fetch error:", err));
  }, []);

  /* ─── İlanları yükle (üniversite değişince) ─── */
  useEffect(() => {
    if (!filters.universityId) return;
    setLoading(true);
    fetchJobsByUniversity(filters.universityId)
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, [filters.universityId]);

  /* ─── Frontend filtreleme + sıralama (useMemo) ─── */
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // 1) Kategori filtresi
    if (filters.category !== "all") {
      result = result.filter((j) => j.category === filters.category);
    }

    // 2) Arama (başlık)
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(
        (j) =>
          j.title?.toLowerCase().includes(q) ||
          j.company_name?.toLowerCase().includes(q)
      );
    }

    // 3) Sıralama
    result.sort((a, b) => {
      if (filters.sortOrder === "newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (filters.sortOrder === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      if (filters.sortOrder === "az") {
        return (a.title || "").localeCompare(b.title || "", "tr");
      }
      return 0;
    });

    return result;
  }, [jobs, filters.category, filters.search, filters.sortOrder]);

  /* ─── Filtre değiştir ─── */
  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  /* ─── Sıfırla ─── */
  function handleClearFilters() {
    setFilters((prev) => ({
      ...prev,
      category: "all",
      search: "",
      sortOrder: "newest",
    }));
  }

  /* ─── Render ─── */
  return (
    <div style={styles.page}>
      <Navbar />

      <main style={styles.main}>
        <div style={styles.container}>

          {/* Sayfa başlığı */}
          <div style={styles.headerBlock}>
            <h1 style={styles.title}>İş İlanları</h1>
            <p style={styles.subtitle}>
              Kampüsüne yakın yarı zamanlı fırsatları keşfet
            </p>
          </div>

          {/* Sidebar + İlan listesi */}
          <div style={styles.layout}>

            {/* Sol — FilterSidebar (kendi scroll'u) */}
            <div style={styles.sidebarScroll}>
              <FilterSidebar
                universities={universities}
                filters={filters}
                onChange={handleFilterChange}
                totalCount={jobs.length}
                filteredCount={filteredJobs.length}
                onClear={handleClearFilters}
              />
            </div>

            {/* Sağ — İlan listesi (kendi scroll'u) */}
            <div style={styles.contentScroll}>
              {loading ? (
                /* Yükleniyor skeleton */
                <div style={styles.stateWrapper}>
                  <span
                    className="material-symbols-rounded"
                    style={{ ...styles.stateIcon, animation: "spin 1s linear infinite" }}
                  >
                    refresh
                  </span>
                  <h3 style={styles.stateTitle}>Yükleniyor...</h3>
                  <p style={styles.stateText}>İlanlar getiriliyor, lütfen bekleyin.</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                /* Sonuç yok */
                <div style={styles.stateWrapper}>
                  <span className="material-symbols-rounded" style={styles.stateIcon}>
                    search_off
                  </span>
                  <h3 style={styles.stateTitle}>Sonuç Bulunamadı</h3>
                  <p style={styles.stateText}>
                    {jobs.length === 0
                      ? "Seçili üniversite için aktif ilan bulunmuyor."
                      : "Arama veya filtre kriterlerinize uyan ilan bulunamadı. Filtreleri değiştirmeyi deneyin."}
                  </p>
                  {jobs.length > 0 && (
                    <button
                      onClick={handleClearFilters}
                      style={styles.clearBtn}
                    >
                      Filtreleri Temizle
                    </button>
                  )}
                </div>
              ) : (
                <div style={styles.grid}>
                  {filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onClick={(id) => setSelectedJobId(id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {selectedJobId && (
        <JobDetailModal
          jobId={selectedJobId}
          onClose={() => setSelectedJobId(null)}
        />
      )}
    </div>
  );
}

/* ── Styles ── */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
  },

  main: {
    paddingTop: "70px",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },

  container: {
    maxWidth: "1320px",
    margin: "0 auto",
    padding: "0 24px",
    width: "100%",
    flex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },

  headerBlock: {
    paddingTop: "24px",
    marginBottom: "20px",
    flexShrink: 0,
  },

  title: {
    margin: "0 0 6px",
    fontSize: "26px",
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: "-0.02em",
  },

  subtitle: {
    margin: 0,
    fontSize: "15px",
    color: "#64748b",
  },

  layout: {
    display: "flex",
    gap: "24px",
    flex: 1,
    minHeight: 0,          /* flex child'ın shrink edebilmesi için kritik */
    overflow: "hidden",
    paddingBottom: "24px",
  },

  sidebarScroll: {
    width: "272px",
    flexShrink: 0,
    height: "100%",
    overflowY: "auto",
    /* gizli scrollbar ama scroll aktif */
    scrollbarWidth: "thin",
    scrollbarColor: "#e2e8f0 transparent",
  },

  contentScroll: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "#e2e8f0 transparent",
    paddingRight: "2px",   /* scrollbar'ın içeriğe basmaması için */
  },

  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  stateWrapper: {
    background: "rgba(255,255,255,0.85)",
    border: "2px dashed #cbd5e1",
    borderRadius: "20px",
    padding: "80px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  stateIcon: {
    fontSize: "56px",
    color: "#94a3b8",
    marginBottom: "20px",
    background: "#f1f5f9",
    padding: "20px",
    borderRadius: "50%",
  },

  stateTitle: {
    margin: "0 0 10px",
    fontSize: "22px",
    fontWeight: 700,
    color: "#334155",
  },

  stateText: {
    margin: 0,
    fontSize: "15px",
    color: "#64748b",
    maxWidth: "380px",
    lineHeight: 1.6,
  },

  clearBtn: {
    marginTop: "20px",
    padding: "10px 24px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "inherit",
  },
};

export default Feed;