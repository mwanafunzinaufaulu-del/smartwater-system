import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function TechnicianDashboard() {
  const [technician, setTechnician] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      navigate("/");
      return;
    }

    // Pata taarifa za mfundi
    const { data: techData } = await supabase
      .from("technicians")
      .select("*")
      .eq("tech_id", userData.user.id)
      .single();
    setTechnician(techData);

    // Pata kazi zilizopangiwa pamoja na malalamiko
    const { data: assignData } = await supabase
      .from("assignments")
      .select(
        `
        *,
        complaints (
          complaint_id,
          complaint_type,
          description,
          location,
          status,
          created_at
        )
      `
      )
      .eq("tech_id", userData.user.id)
      .order("assigned_date", { ascending: false });

    setAssignments(assignData || []);
    setLoading(false);
  };

  const handleUpdateStatus = async (assignId, complaintId, newStatus) => {
    // Badilisha status ya assignment
    await supabase
      .from("assignments")
      .update({
        status: newStatus === "Resolved" ? "Completed" : "In Progress",
        completion_date:
          newStatus === "Resolved" ? new Date().toISOString() : null,
      })
      .eq("assign_id", assignId);

    // Badilisha status ya complaint
    await supabase
      .from("complaints")
      .update({ status: newStatus })
      .eq("complaint_id", complaintId);

    // Kama imekamilika, fanya mfundi awe available tena
    if (newStatus === "Resolved") {
      await supabase
        .from("technicians")
        .update({ is_available: true })
        .eq("tech_id", technician.tech_id);
    }

    fetchData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("sw-TZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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

  // Gawanya kazi
  const activeJobs = assignments.filter(
    (a) => a.status === "Assigned" || a.status === "In Progress"
  );
  const completedJobs = assignments.filter((a) => a.status === "Completed");

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={{ fontSize: "48px" }}>🔧</div>
        <p style={{ color: "#0369a1", fontSize: "18px", fontWeight: "600" }}>
          Inapakia...
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.navLeft}>
          <span style={{ fontSize: "24px" }}>💧</span>
          <span style={styles.navTitle}>Smart Water — Mfundi</span>
        </div>
        <div style={styles.navRight}>
          <span style={styles.navUser}>
            👷 {technician?.full_name || "Mfundi"}
          </span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Toka
          </button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Welcome Card */}
        <div style={styles.welcomeCard}>
          <div>
            <h2 style={styles.welcomeTitle}>
              Habari, {technician?.full_name?.split(" ")[0]}! 👋
            </h2>
            <p style={styles.welcomeSubtitle}>
              🔧 {technician?.specialization}
            </p>
          </div>
          <div
            style={{
              ...styles.availBadge,
              background: technician?.is_available ? "#dcfce7" : "#fee2e2",
              color: technician?.is_available ? "#166534" : "#dc2626",
            }}
          >
            {technician?.is_available ? "✅ Ninapatikana" : "🔴 Sina nafasi"}
          </div>
        </div>

        {/* Takwimu */}
        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, background: "#dbeafe" }}>
            <div style={{ ...styles.statNumber, color: "#1e40af" }}>
              {assignments.length}
            </div>
            <div style={styles.statLabel}>Kazi Zote</div>
          </div>
          <div style={{ ...styles.statCard, background: "#ffedd5" }}>
            <div style={{ ...styles.statNumber, color: "#9a3412" }}>
              {activeJobs.length}
            </div>
            <div style={styles.statLabel}>Zinazosubiri</div>
          </div>
          <div style={{ ...styles.statCard, background: "#dcfce7" }}>
            <div style={{ ...styles.statNumber, color: "#166534" }}>
              {completedJobs.length}
            </div>
            <div style={styles.statLabel}>Zilizokamilika</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {[
            { key: "active", label: `🔧 Kazi Zangu (${activeJobs.length})` },
            {
              key: "completed",
              label: `✅ Zilizokamilika (${completedJobs.length})`,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              style={{
                ...styles.tab,
                background: activeTab === tab.key ? "#0369a1" : "white",
                color: activeTab === tab.key ? "white" : "#374151",
              }}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Kazi Zinazoendelea */}
        {activeTab === "active" && (
          <div style={styles.list}>
            {activeJobs.length === 0 ? (
              <div style={styles.emptyCard}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>😴</div>
                <p style={{ color: "#64748b" }}>
                  Hakuna kazi zilizopangiwa kwako sasa hivi
                </p>
              </div>
            ) : (
              activeJobs.map((assignment) => {
                const complaint = assignment.complaints;
                return (
                  <div key={assignment.assign_id} style={styles.card}>
                    {/* Header ya Kazi */}
                    <div style={styles.cardTop}>
                      <div style={styles.cardType}>
                        <span style={{ fontSize: "20px" }}>
                          {getTypeIcon(complaint?.complaint_type)}
                        </span>
                        <span style={styles.cardTypeName}>
                          {complaint?.complaint_type}
                        </span>
                      </div>
                      <div
                        style={{
                          ...styles.badge,
                          background:
                            assignment.status === "In Progress"
                              ? "#ffedd5"
                              : "#dbeafe",
                          color:
                            assignment.status === "In Progress"
                              ? "#9a3412"
                              : "#1e40af",
                        }}
                      >
                        {assignment.status === "In Progress"
                          ? "🔧 Inaendelea"
                          : "📋 Imepangiwa"}
                      </div>
                    </div>

                    {/* Eneo */}
                    <div style={styles.cardLocation}>
                      📍 {complaint?.location}
                    </div>

                    {/* Maelezo */}
                    {complaint?.description && (
                      <div style={styles.cardDesc}>
                        💬 {complaint.description}
                      </div>
                    )}

                    {/* Tarehe */}
                    <div style={styles.cardDate}>
                      🗓️ Imepangiwa: {formatDate(assignment.assigned_date)}
                    </div>

                    {/* Vitendo */}
                    <div style={styles.actionBtns}>
                      {assignment.status === "Assigned" && (
                        <button
                          style={styles.btnOrange}
                          onClick={() =>
                            handleUpdateStatus(
                              assignment.assign_id,
                              complaint.complaint_id,
                              "In Progress"
                            )
                          }
                        >
                          🔧 Anza Kazi
                        </button>
                      )}
                      {assignment.status === "In Progress" && (
                        <button
                          style={styles.btnGreen}
                          onClick={() =>
                            handleUpdateStatus(
                              assignment.assign_id,
                              complaint.complaint_id,
                              "Resolved"
                            )
                          }
                        >
                          ✅ Kazi Imekamilika
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Kazi Zilizokamilika */}
        {activeTab === "completed" && (
          <div style={styles.list}>
            {completedJobs.length === 0 ? (
              <div style={styles.emptyCard}>
                <p style={{ color: "#64748b" }}>
                  Bado hujakamilisha kazi yoyote
                </p>
              </div>
            ) : (
              completedJobs.map((assignment) => {
                const complaint = assignment.complaints;
                return (
                  <div
                    key={assignment.assign_id}
                    style={{ ...styles.card, borderLeftColor: "#16a34a" }}
                  >
                    <div style={styles.cardTop}>
                      <div style={styles.cardType}>
                        <span style={{ fontSize: "20px" }}>
                          {getTypeIcon(complaint?.complaint_type)}
                        </span>
                        <span style={styles.cardTypeName}>
                          {complaint?.complaint_type}
                        </span>
                      </div>
                      <div
                        style={{
                          ...styles.badge,
                          background: "#dcfce7",
                          color: "#166534",
                        }}
                      >
                        ✅ Imekamilika
                      </div>
                    </div>
                    <div style={styles.cardLocation}>
                      📍 {complaint?.location}
                    </div>
                    <div style={styles.cardDate}>
                      🗓️ Imekamilika:{" "}
                      {assignment.completion_date
                        ? formatDate(assignment.completion_date)
                        : "—"}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#f0f9ff" },
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f9ff",
  },
  navbar: {
    background: "linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)",
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navLeft: { display: "flex", alignItems: "center", gap: "10px" },
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
  availBadge: {
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "12px",
    marginBottom: "24px",
  },
  statCard: { borderRadius: "12px", padding: "20px", textAlign: "center" },
  statNumber: { fontSize: "32px", fontWeight: "bold", marginBottom: "4px" },
  statLabel: { fontSize: "12px", color: "#475569", fontWeight: "600" },
  tabs: { display: "flex", gap: "8px", marginBottom: "20px" },
  tab: {
    padding: "10px 20px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  list: { display: "flex", flexDirection: "column", gap: "12px" },
  card: {
    background: "white",
    borderRadius: "14px",
    padding: "18px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
    borderLeft: "4px solid #0ea5e9",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  cardType: { display: "flex", alignItems: "center", gap: "8px" },
  cardTypeName: { fontWeight: "bold", color: "#1e293b", fontSize: "15px" },
  badge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  cardLocation: { color: "#0369a1", fontSize: "13px", marginBottom: "6px" },
  cardDesc: { color: "#64748b", fontSize: "13px", marginBottom: "6px" },
  cardDate: { color: "#94a3b8", fontSize: "12px", marginBottom: "12px" },
  actionBtns: { display: "flex", gap: "8px" },
  btnOrange: {
    flex: 1,
    padding: "10px",
    background: "#ffedd5",
    color: "#9a3412",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },
  btnGreen: {
    flex: 1,
    padding: "10px",
    background: "#dcfce7",
    color: "#166534",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },
  emptyCard: {
    background: "white",
    borderRadius: "14px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
  },
};
