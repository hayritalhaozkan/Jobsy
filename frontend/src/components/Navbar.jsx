import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={styles.nav}>
      <Link to="/feed" style={styles.brand}>
        Jobsy
      </Link>

      <div style={styles.links}>
        <Link to="/feed">İlanlar</Link>
        <Link to="/login">Giriş</Link>
        <Link to="/employer/jobs">İşveren</Link>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    height: "64px",
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  brand: {
    fontWeight: 700,
    fontSize: "20px",
  },
  links: {
    display: "flex",
    gap: "16px",
    fontSize: "14px",
  },
};

export default Navbar;