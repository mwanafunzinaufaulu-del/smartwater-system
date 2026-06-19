import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Navbar({ title }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.navLeft}>
        <span style={{ fontSize: "24px" }}>💧</span>
        <span style={styles.navTitle}>{title || "Smart Water System"}</span>
      </div>
      <button style={styles.logoutBtn} onClick={handleLogout}>
        Toka
      </button>
    </div>
  );
}

const styles = {
  navbar: {
    background: "linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)",
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  navLeft: { display: "flex", alignItems: "center", gap: "10px" },
  navTitle: { color: "white", fontWeight: "bold", fontSize: "18px" },
  logoutBtn: {
    background: "rgba(255,255,255,0.2)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: "8px",
    padding: "6px 14px",
    cursor: "pointer",
    fontSize: "13px",
  },
};
