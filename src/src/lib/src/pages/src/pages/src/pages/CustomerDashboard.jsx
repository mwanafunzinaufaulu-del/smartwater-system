import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Pata mtumiaji wa sasa
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      navigate("/");
      return;
    }
    setUser(userData.user);

    // Pata taarifa za mteja
    const { data: customerData } = await supabase
      .from("customers")
      .select("*")
      .eq("customer_id", userData.user.id)
      .single();
    setCustomer(customerData);

    // Pata malalamiko ya mteja
    const { data: complaintsData } = await supabase
      .from("complaints")
      .select("*")
      .eq("customer_id", userData.user.id)
      .order("created_at", { ascending: false });
    setComplaints(complaintsData || []);

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Submitted":
        return { bg: "#fef9c3", color: "#854d0e", label: "⏳ Imewasilishwa" };
      case "Assigned":
        return { bg: "#dbeafe", color: "#1e40af", label: "👷 Imepangiwa" };
      case "In Progress":
        return { bg: "#ffedd5", color: "#9a3412", label: "🔧 Inashughulikiwa" };
      case "Resolved":
        return { bg: "#dcfce7", color: "#166534", label: "✅ Imekamilika" };
      default:
        return { bg: "#f1f5f9", color: "#475569", label: status };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "No Water":
        return "🚱";
      case "Leakage":
        return "💧";
      case "Billing Issue":
        return "🧾";
      default:
        return "❓";
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("sw-TZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Takwimu
  const totalComplaints = complaints.length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;
  const pending = complaints.filter((c) => c.status !== "Resolved").length;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingIcon}>💧</div>
        <p style={styles.loadingText}>Inapakia...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.navLeft}>
          <span style={styles.navLogo}>💧</span>
          <span style={styles.navTitle}>Smart Water</span>
        </div>
        <div style={styles.navRight}>
          <span style={styles.navUser}>
            👤 {customer?.full_name || user?.email}
          </span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Toka
          </button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Welcome */}
        <div style={styles.welcomeCard}>
          <div>
            <h2 style={styles.welcomeTitle}>
              Habari, {customer?.full_name?.split(" ")[0] || "Mteja"}! 👋
            </h2>
            <p style={styles.welcomeSubtitle}>
              📍 {customer?.street}, {customer?.area}
            </p>
          </div>
          <button style={styles.reportBtn} onClick={() => navigate("/report")}>
            + Ripoti Tatizo
          </button>
        </div>

        {/* Takwimu */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{totalComplaints}</div>
            <div style={styles.statLabel}>Malalamiko Yote</div>
          </div>
          <div style={{ ...styles.statCard, background: "#fef9c3" }}>
            <div style={{ ...styles.statNumber, color: "#854d0e" }}>
              {pending}
            </div>
            <div style={styles.statLabel}>Yanayosubiri</div>
          </div>
          <div style={{ ...styles.statCard, background: "#dcfce7" }}>
            <div style={{ ...styles.statNumber, color: "#166534" }}>
              {resolved}
            </div>
            <div style={styles.statLabel}>Yaliyokamilika</div>
          </div>
        </div>

        {/* Malalamiko */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>📋 Malalamiko Yangu</h3>

          {complaints.length === 0 ? (
            <div style={styles.emptyCard}>
              <div style={styles.emptyIcon}>📭</div>
              <p style={styles.emptyText}>
                Hujawahi kuwasilisha malalamiko yoyote
              </p>
              <button
                style={styles.reportBtn}
                onClick={() => navigate("/report")}
              >
                + Ripoti Tatizo la Kwanza
              </button>
            </div>
          ) : (
            <div style={styles.complaintsList}>
              {complaints.map((complaint) => {
                const status = getStatusColor(complaint.status);
                return (
                  <div
                    key={complaint.complaint_id}
                    style={styles.complaintCard}
                  >
                    {/* Top */}
                    <div style={styles.complaintTop}>
                      <div style={styles.complaintType}>
                        <span style={styles.typeIcon}>
                          {getTypeIcon(complaint.complaint_type)}
                        </span>
                        <span style={styles.typeName}>
                          {complaint.complaint_type}
                        </span>
                      </div>
                      <div
                        style={{
                          ...styles.statusBadge,
                          background: status.bg,
                          color: status.color,
                        }}
                      >
                        {status.label}
                      </div>
                    </div>

                    {/* Location */}
                    <div style={styles.complaintLocation}>
                      📍 {complaint.location}
                    </div>

                    {/* Description */}
                    {complaint.description && (
                      <div style={styles.complaintDesc}>
                        {complaint.description}
                      </div>
                    )}

                    {/* Date */}
                    <div style={styles.complaintDate}>
                      🗓️ {formatDate(complaint.created_at)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f0f9ff",
  },
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f9ff",
  },
  loadingIcon: { fontSize: "48px", marginBottom: "16px" },
  loadingText: { color: "#0369a1", fontSize: "18px", fontWeight: "600" },
  navbar: {
    background: "linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)",
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  navLeft: { display: "flex", alignItems: "center", gap: "10px" },
  navLogo: { fontSize: "24px" },
  navTitle: { color: "white", fontWeight: "bold", fontSize: "18px" },
  navRight: { display: "flex", alignItems: "center", gap: "12px" },
  navUser: { color: "rgba(255,255,255,0.9)", fontSize: "14px" },
  logoutBtn: {
    background: "rgba(255,255,255,0.2)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: "8px",
    padding: "6px 14px",
    cursor: "pointer",
    fontSize: "13px",
  },
  content: { padding: "24px", maxWidth: "700px", margin: "0 auto" },
  welcomeCard: {
    background: "white",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
  },
  welcomeTitle: {
    margin: "0 0 6px 0",
    color: "#1e293b",
    fontSize: "20px",
    fontWeight: "bold",
  },
  welcomeSubtitle: { margin: 0, color: "#64748b", fontSize: "14px" },
  reportBtn: {
    background: "linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "12px 20px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "12px",
    marginBottom: "24px",
  },
  statCard: {
    background: "#dbeafe",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
  },
  statNumber: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: "4px",
  },
  statLabel: { fontSize: "12px", color: "#475569", fontWeight: "600" },
  section: { marginBottom: "24px" },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: "16px",
  },
  emptyCard: {
    background: "white",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  },
  emptyIcon: { fontSize: "48px", marginBottom: "12px" },
  emptyText: { color: "#64748b", marginBottom: "20px", fontSize: "15px" },
  complaintsList: { display: "flex", flexDirection: "column", gap: "12px" },
  complaintCard: {
    background: "white",
    borderRadius: "14px",
    padding: "18px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
    borderLeft: "4px solid #0ea5e9",
  },
  complaintTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  complaintType: { display: "flex", alignItems: "center", gap: "8px" },
  typeIcon: { fontSize: "20px" },
  typeName: { fontWeight: "bold", color: "#1e293b", fontSize: "15px" },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  complaintLocation: {
    color: "#0369a1",
    fontSize: "13px",
    marginBottom: "8px",
  },
  complaintDesc: {
    color: "#64748b",
    fontSize: "13px",
    marginBottom: "8px",
    fontStyle: "italic",
  },
  complaintDate: { color: "#94a3b8", fontSize: "12px" },
};
