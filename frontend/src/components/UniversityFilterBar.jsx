function UniversityFilterBar({
  universities,
  selectedUniversityId,
  onChange,
}) {
  return (
    <div style={styles.wrapper}>
      <div>
        <div style={styles.label}>Seçili üniversite</div>
        <div style={styles.name}>İlanları üniversiteye göre filtrele</div>
      </div>

      <select
        value={selectedUniversityId || ""}
        onChange={(e) => onChange(Number(e.target.value))}
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
  );
}

const styles = {
  wrapper: {
    background: "rgba(255,255,255,0.82)",
    border: "1px solid rgba(226,232,240,0.9)",
    borderRadius: "20px",
    padding: "16px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "18px",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
  },

  label: {
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "4px",
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },

  name: {
    fontWeight: 700,
    color: "#0f172a",
  },

  select: {
    minWidth: "260px",
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid #dbe2ea",
    background: "#fff",
    color: "#0f172a",
    outline: "none",
    fontWeight: 600,
  },
};

export default UniversityFilterBar;