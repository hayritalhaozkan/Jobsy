import { Link } from "react-router-dom";

function JobCard({ job, requireAuth, onClick }) {
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
       onClick(job.id);
    } else {
       if (requireAuth) window.location.href = "/login";
       else window.location.href = `/jobs/${job.id}`;
    }
  };

  return (
    <div onClick={handleClick} style={{...styles.cardLink, cursor: "pointer"}}>
      <article style={styles.card}>
        <div style={styles.leftSection}>
          <div style={styles.logoBox}>
            <span className="material-symbols-rounded" style={styles.placeholderLogo}>business</span>
          </div>
          <div style={styles.infoBox}>
            <h3 style={styles.title}>{job.title}</h3>
            <div style={styles.companyInfo}>
              <span style={styles.companyName}>{"Şirket Adı"}</span>
              {job.address && (
                <span style={styles.location}>{job.address}</span>
              )}
            </div>
          </div>
        </div>

        <div style={styles.rightSection}>
          <button style={styles.applyBtn}>Başvur &gt;</button>
          <div style={styles.daysLeft}>Son 15 Gün</div>
        </div>
      </article>
    </div>
  );
}

const styles = {
  cardLink: {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  },
  card: {
    background: "#fff",
    border: "1px solid #f1f5f9",
    borderRadius: "12px",
    padding: "20px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
    transition: "box-shadow 0.2s, transform 0.2s",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  logoBox: {
    width: "70px",
    height: "70px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
  },
  placeholderLogo: {
    fontSize: "32px",
    color: "#cbd5e1",
  },
  infoBox: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e293b",
  },
  companyInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "14px",
    color: "#64748b",
  },
  companyName: {
    fontWeight: "500",
    color: "#475569",
  },
  location: {
    color: "#94a3b8",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  applyBtn: {
    background: "var(--secondary)",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    padding: "10px 24px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  daysLeft: {
    border: "1px solid var(--secondary)",
    color: "var(--secondary)",
    borderRadius: "999px",
    padding: "8px 16px",
    fontSize: "12px",
    fontWeight: "600",
    background: "rgba(74, 222, 128, 0.05)",
  }
};

export default JobCard;