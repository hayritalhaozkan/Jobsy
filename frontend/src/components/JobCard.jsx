import { Link } from "react-router-dom";

function JobCard({ job, requireAuth }) {
  const shortDescription =
    job.description && job.description.length > 140
      ? `${job.description.slice(0, 140)}...`
      : job.description || "Açıklama bulunmuyor.";

  const targetUrl = requireAuth ? "/login" : `/jobs/${job.id}`;

  return (
    <Link to={targetUrl} style={styles.linkWrap}>
      <article style={styles.card}>
        <div style={styles.topRow}>
          <div style={styles.badge}>
            <span className="material-symbols-rounded" style={styles.badgeIcon}>
              work
            </span>
            Aktif İlan
          </div>
        </div>

        <h3 style={styles.title}>{job.title}</h3>

        <p style={styles.description}>{shortDescription}</p>

        <div style={styles.metaList}>
          {job.address && (
            <div style={styles.metaItem}>
              <span className="material-symbols-rounded" style={styles.metaIcon}>
                location_on
              </span>
              <span>{job.address}</span>
            </div>
          )}

          {job.salary && (
            <div style={styles.metaItem}>
              <span className="material-symbols-rounded" style={styles.metaIcon}>
                payments
              </span>
              <span>{job.salary}</span>
            </div>
          )}

          {job.work_schedule && (
            <div style={styles.metaItem}>
              <span className="material-symbols-rounded" style={styles.metaIcon}>
                schedule
              </span>
              <span>{job.work_schedule}</span>
            </div>
          )}
        </div>

        <div style={styles.bottomRow}>
          <div style={styles.bottomLabel}>Detayları incele</div>

          <div style={styles.cta}>
            Görüntüle
            <span className="material-symbols-rounded" style={styles.ctaIcon}>
              chevron_right
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

const styles = {
  linkWrap: {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  },

  card: {
    background: "rgba(255,255,255,0.88)",
    border: "1px solid rgba(226,232,240,0.95)",
    borderRadius: "24px",
    padding: "22px",
    minHeight: "280px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.06)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    transition:
      "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
  },

  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "12px",
    marginBottom: "18px",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 12px",
    borderRadius: "999px",
    background: "rgba(79,70,229,0.10)",
    color: "#4338ca",
    fontSize: "13px",
    fontWeight: 700,
  },

  badgeIcon: {
    fontSize: "16px",
  },

  title: {
    margin: 0,
    fontSize: "24px",
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
    color: "#0f172a",
    marginBottom: "14px",
  },

  description: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.75,
    fontSize: "15px",
    marginBottom: "18px",
  },

  metaList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },

  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.5,
  },

  metaIcon: {
    fontSize: "18px",
    color: "#6366f1",
  },

  bottomRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginTop: "auto",
    paddingTop: "18px",
    borderTop: "1px solid rgba(226,232,240,0.8)",
  },

  bottomLabel: {
    fontSize: "14px",
    color: "#64748b",
    fontWeight: 600,
  },

  cta: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontWeight: 700,
    color: "#0f172a",
  },

  ctaIcon: {
    fontSize: "18px",
  },
};

export default JobCard;