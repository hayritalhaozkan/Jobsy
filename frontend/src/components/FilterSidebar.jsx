import { useMemo } from "react";
import { JOB_CATEGORIES } from "../constants/categories";

/**
 * FilterSidebar
 * Props:
 *  - universities   : [{id, display_name}]
 *  - filters        : { universityId, category, search, sortOrder }
 *  - onChange(key, value) : callback
 *  - totalCount     : number — toplam ilan sayısı
 *  - filteredCount  : number — filtrelenmiş ilan sayısı
 *  - onClear()      : tüm filtreleri sıfırla
 */
function FilterSidebar({
  universities,
  filters,
  onChange,
  totalCount,
  filteredCount,
  onClear,
}) {
  const hasActiveFilters =
    filters.category !== "all" ||
    filters.search.trim() !== "" ||
    filters.sortOrder !== "newest";

  const categoryCounts = useMemo(() => {
    // Gerçek sayımı sidebar sadece server-side'da yapabilir.
    // Frontend'de bunu dolduruyoruz; boş bırakalım (opsiyonel için).
    return {};
  }, []);

  return (
    <aside style={s.sidebar}>
      {/* ── Sonuç sayacı ── */}
      <div style={s.resultBadge}>
        <span className="material-symbols-rounded" style={{ fontSize: "16px", color: "#4F46E5" }}>
          work
        </span>
        <span style={s.resultText}>
          <strong style={{ color: "#0f172a" }}>{filteredCount}</strong>
          {" "}/ {totalCount} ilan gösteriliyor
        </span>
      </div>

      {/* ── Arama ── */}
      <div style={s.section}>
        <h3 style={s.sectionTitle}>
          <span className="material-symbols-rounded" style={s.sectionIcon}>search</span>
          Arama
        </h3>
        <div style={s.searchWrap}>
          <span className="material-symbols-rounded" style={s.searchIcon}>search</span>
          <input
            type="text"
            placeholder="İlan başlığında ara..."
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            style={s.searchInput}
          />
          {filters.search && (
            <button onClick={() => onChange("search", "")} style={s.clearBtn}>
              <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>close</span>
            </button>
          )}
        </div>
      </div>

      <div style={s.divider} />

      {/* ── Üniversite ── */}
      <div style={s.section}>
        <h3 style={s.sectionTitle}>
          <span className="material-symbols-rounded" style={s.sectionIcon}>school</span>
          Üniversite
        </h3>
        <select
          value={filters.universityId}
          onChange={(e) => onChange("universityId", Number(e.target.value))}
          style={s.select}
        >
          {universities.map((uni) => (
            <option key={uni.id} value={uni.id}>
              {uni.display_name || uni.name}
            </option>
          ))}
        </select>
      </div>

      <div style={s.divider} />

      {/* ── Kategori ── */}
      <div style={s.section}>
        <h3 style={s.sectionTitle}>
          <span className="material-symbols-rounded" style={s.sectionIcon}>category</span>
          Kategori
        </h3>
        <div style={s.catList}>
          {/* "Tümü" seçeneği */}
          <button
            style={{
              ...s.catBtn,
              ...(filters.category === "all" ? s.catBtnActive : {}),
            }}
            onClick={() => onChange("category", "all")}
          >
            <span
              className="material-symbols-rounded"
              style={{
                ...s.catIcon,
                color: filters.category === "all" ? "#fff" : "#4F46E5",
              }}
            >
              apps
            </span>
            Tümü
          </button>

          {JOB_CATEGORIES.map((cat) => {
            const active = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                style={{ ...s.catBtn, ...(active ? s.catBtnActive : {}) }}
                onClick={() =>
                  onChange("category", active ? "all" : cat.id)
                }
              >
                <span
                  className="material-symbols-rounded"
                  style={{ ...s.catIcon, color: active ? "#fff" : "#4F46E5" }}
                >
                  {cat.icon}
                </span>
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={s.divider} />

      {/* ── Sıralama ── */}
      <div style={s.section}>
        <h3 style={s.sectionTitle}>
          <span className="material-symbols-rounded" style={s.sectionIcon}>sort</span>
          Sıralama
        </h3>
        <div style={s.sortGroup}>
          {[
            { value: "newest", label: "En Yeni", icon: "schedule" },
            { value: "oldest", label: "En Eski", icon: "history" },
            { value: "az",     label: "A → Z",   icon: "sort_by_alpha" },
          ].map((opt) => (
            <button
              key={opt.value}
              style={{
                ...s.sortBtn,
                ...(filters.sortOrder === opt.value ? s.sortBtnActive : {}),
              }}
              onClick={() => onChange("sortOrder", opt.value)}
            >
              <span
                className="material-symbols-rounded"
                style={{
                  fontSize: "16px",
                  color: filters.sortOrder === opt.value ? "#4F46E5" : "#94a3b8",
                }}
              >
                {opt.icon}
              </span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Filtreleri Temizle ── */}
      {hasActiveFilters && (
        <>
          <div style={s.divider} />
          <button style={s.clearAllBtn} onClick={onClear}>
            <span className="material-symbols-rounded" style={{ fontSize: "16px" }}>
              filter_list_off
            </span>
            Filtreleri Temizle
          </button>
        </>
      )}
    </aside>
  );
}

/* ── Styles ── */
const s = {
  sidebar: {
    width: "272px",
    flexShrink: 0,
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(15,23,42,0.04)",
    display: "flex",
    flexDirection: "column",
    gap: "0px",
    boxSizing: "border-box",
    minHeight: "100%",
  },

  resultBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(79,70,229,0.06)",
    borderRadius: "10px",
    padding: "10px 14px",
    marginBottom: "16px",
  },

  resultText: {
    fontSize: "13px",
    color: "#64748b",
  },

  section: {
    paddingTop: "4px",
    paddingBottom: "4px",
  },

  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    margin: "0 0 12px 0",
  },

  sectionIcon: {
    fontSize: "16px",
    color: "#94a3b8",
  },

  searchWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  searchIcon: {
    position: "absolute",
    left: "12px",
    fontSize: "18px",
    color: "#94a3b8",
    pointerEvents: "none",
  },

  searchInput: {
    width: "100%",
    padding: "10px 36px 10px 38px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },

  clearBtn: {
    position: "absolute",
    right: "8px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#94a3b8",
    padding: "2px",
    display: "flex",
    alignItems: "center",
  },

  select: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    color: "#0f172a",
    fontSize: "14px",
    outline: "none",
    fontWeight: 600,
    cursor: "pointer",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },

  catList: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  catBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid transparent",
    background: "transparent",
    color: "#334155",
    fontSize: "13.5px",
    fontWeight: 500,
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
    transition: "background 0.15s, color 0.15s",
  },

  catBtnActive: {
    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
    color: "#fff",
    fontWeight: 700,
  },

  catIcon: {
    fontSize: "18px",
  },

  sortGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  sortBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    color: "#475569",
    fontSize: "13.5px",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "border-color 0.15s, background 0.15s",
  },

  sortBtnActive: {
    background: "rgba(79,70,229,0.06)",
    border: "1px solid #4F46E5",
    color: "#4F46E5",
    fontWeight: 700,
  },

  divider: {
    height: "1px",
    background: "#f1f5f9",
    margin: "12px 0",
  },

  clearAllBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #fca5a5",
    background: "#fff1f2",
    color: "#dc2626",
    fontSize: "13.5px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};

export default FilterSidebar;
