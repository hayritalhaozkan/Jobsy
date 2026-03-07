import { Link } from "react-router-dom";

function JobCard({ job }) {
  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <h3 style={styles.title}>{job.title}</h3>
        <span style={styles.badge}>Aktif</span>
      </div>

      <p style={styles.description}>
        {job.description?.length > 120
          ? `${job.description.slice(0, 120)}...`
          : job.description}
      </p>

      <div style={styles.meta}>{job.university_name}</div>

      <Link to={`/jobs/${job.id}`} style={styles.link}>
        Detayı Gör
      </Link>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "16px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  title: {
    margin: 0,
    fontSize: "18px",
  },
  badge: {
    fontSize: "12px",
    background: "#dcfce7",
    color: "#166534",
    padding: "4px 8px",
    borderRadius: "999px",
  },
  description: {
    margin: 0,
    color: "#4b5563",
    lineHeight: 1.5,
  },
  meta: {
    fontSize: "13px",
    color: "#6b7280",
  },
  link: {
    marginTop: "4px",
    fontWeight: 600,
  },
};

export default JobCard;