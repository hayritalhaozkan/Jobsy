function UniversityFilterBar({ selectedUniversity, onChange }) {
  return (
    <div style={styles.wrapper}>
      <div>
        <div style={styles.label}>Seçili üniversite</div>
        <div style={styles.name}>
          {selectedUniversity
            ? selectedUniversity.display_name || selectedUniversity.name
            : "Üniversite seçilmedi"}
        </div>
      </div>

      <button onClick={onChange} style={styles.button}>
        Değiştir
      </button>
    </div>
  );
}

const styles = {
  wrapper: {
    background: "#fff",
    borderRadius: "16px",
    padding: "14px 16px",
    marginBottom: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  label: {
    fontSize: "12px",
    color: "#6b7280",
    marginBottom: "4px",
  },
  name: {
    fontWeight: 600,
  },
  button: {
    border: "none",
    background: "#111827",
    color: "#fff",
    borderRadius: "10px",
    padding: "10px 14px",
    cursor: "pointer",
  },
};

export default UniversityFilterBar;