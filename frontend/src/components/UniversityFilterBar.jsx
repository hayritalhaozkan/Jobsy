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
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "16px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "18px",
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.03)",
  },

  label: {
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "4px",
    fontWeight: 600,
    textTransform: "uppercase",
  },

  name: {
    fontWeight: 700,
    color: "#0f172a",
    fontSize: "15px",
  },

  select: {
    minWidth: "260px",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #dbe2ea",
    background: "#f8fafc",
    color: "#0f172a",
    outline: "none",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default UniversityFilterBar;