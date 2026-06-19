import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("complaints");
  const [assigningId, setAssigningId] = useState(null);
  const [selectedTech, setSelectedTech] = useState({});
  const navigate = useNavigate();

  useEffect(() => { // eslint-disable-line
    fetchAll();
  }, []);

  const fetchAll = async () => {
    // Angalia kama ni admin
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      navigate("/");
      return;
    }

    // Pata malalamiko yote
    const { data: complaintsData } = await supabase
      .from("complaints")
      .select("*")
      .order("created_at", { ascending: false });
    setComplaints(complaintsData || []);

    // Pata mafundi
    const { data: techData } = await supabase.from("technicians").select("*");
    setTechnicians(techData || []);

    // Pata hotspots
    const { data: hotspotData } = await supabase
      .from("hotspot_reports")
      .select("*")
      .order("complaint_count", { ascending: false });
    setHotspots(hotspotData || []);

    setLoading(false);
  };

  const handleAssign = async (complaintId) => {
    const techId = selectedTech[complaintId];
    if (!techId) {
      alert("Chagua mfundi kwanza!");
      return;
    }

    setAssigningId(complaintId);

    // Unda assignment
    await supabase.from("assignments").insert([
      {
        complaint_id: complaintId,
        tech_id: techId,
        status: "Assigned",
      },
    ]);

    // Badilisha status ya complaint
    await supabase
      .from("complaints")
      .update({ status: "Assigned" })
      .eq("complaint_id", complaintId);

    // Badilisha availability ya mfundi
    await supabase
      .from("technicians")
      .update({ is_available: false })
      .eq("tech_id", techId);

    setAssigningId(null);
    fetchAll();
  };

  const handleUpdateStatus = async (complaintId, newStatus) => {
    await supabase
      .from("complaints")
      .update({ status: newStatus })
      .eq("complaint_id", complaintId);
    fetchAll();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Submitted":
        return { bg: "#fef9c3", color: "#854d0e" };
      case "Assigned":
        return { bg: "#dbeafe", color: "#1e40af" };
      case "In Progress":
        return { bg: "#ffedd5", color: "#9a3412" };
      case "Resolved":
        return { bg: "#dcfce7", color: "#166534" };
      default:
        return { bg: "#f1f5f9", color: "#475569" };
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
    return new Date(dateStr).toLocaleDateString("sw-TZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Takwimu
  const total = complaints.length;
  const submitted = complaints.filter((c) => c.status === "Submitted").length;
  const inProgress = complaints.filter(
    (c) => c.status === "In Progress" || c.status === "Assigned"
  ).length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={{ fontSize: "48px" }}>💧</div>
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
          <span style={styles.navTitle}>Smart Water — Admin</span>
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Toka
        </button>
      </div>

      <div style={styles.content}>
        {/* Takwimu */}
        <div style={styles.statsGrid}>
          {[
            {
              label: "Malalamiko Yote",
              value: total,
              bg: "#dbeafe",
              color: "#1e40af",
            },
            {
              label: "Mapya",
              value: submitted,
              bg: "#fef9c3",
              color: "#854d0e",
            },
            {
              label: "Yanashughulikiwa",
              value: inProgress,
              bg: "#ffedd5",
              color: "#9a3412",
            },
            {
              label: "Yamekamilika",
              value: resolved,
              bg: "#dcfce7",
              color: "#166534",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{ ...styles.statCard, background: stat.bg }}
            >
              <div style={{ ...styles.statNumber, color: stat.color }}>
                {stat.value}
              </div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {[
            { key: "complaints", label: "📋 Malalamiko" },
            { key: "technicians", label: "👷 Mafundi" },
            { key: "hotspots", label: "🔥 Hotspots" },
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

        {/* Tab: Malalamiko */}
        {activeTab === "complaints" && (
          <div style={styles.list}>
            {complaints.length === 0 ? (
              <div style={styles.emptyCard}>
                <p>Hakuna malalamiko yoyote bado</p>
              </div>
            ) : (
              complaints.map((c) => {
                const status = getStatusColor(c.status);
                return (
                  <div key={c.complaint_id} style={styles.card}>
                    <div style={styles.cardTop}>
                      <div style={styles.cardType}>
                        <span>{getTypeIcon(c.complaint_type)}</span>
                        <span style={styles.cardTypeName}>
                          {c.complaint_type}
                        </span>
                      </div>
                      <div
                        style={{
                          ...styles.badge,
                          background: status.bg,
                          color: status.color,
                        }}
                      >
                        {c.status}
                      </div>
                    </div>

                    <div style={styles.cardLocation}>📍 {c.location}</div>
                    {c.description && (
                      <div style={styles.cardDesc}>{c.description}</div>
                    )}
                    <div style={styles.cardDate}>
                      🗓️ {formatDate(c.created_at)}
                    </div>

                    {/* Panga Mfundi */}
                    {c.status === "Submitted" && (
                      <div style={styles.assignBox}>
                        <select
                          style={styles.assignSelect}
                          value={selectedTech[c.complaint_id] || ""}
                          onChange={(e) =>
                            setSelectedTech({
                              ...selectedTech,
                              [c.complaint_id]: e.target.value,
                            })
                          }
                        >
                          <option value="">-- Chagua Mfundi --</option>
                          {technicians
                            .filter((t) => t.is_available)
                            .map((t) => (
                              <option key={t.tech_id} value={t.tech_id}>
                                {t.full_name} — {t.specialization}
                              </option>
                            ))}
                        </select>
                        <button
                          style={styles.assignBtn}
                          onClick={() => handleAssign(c.complaint_id)}
                          disabled={assigningId === c.complaint_id}
                        >
                          {assigningId === c.complaint_id ? "⏳" : "Panga →"}
                        </button>
                      </div>
                    )}

                    {/* Badilisha Status */}
                    {c.status !== "Resolved" && c.status !== "Submitted" && (
                      <div style={styles.statusBtns}>
                        {c.status !== "In Progress" && (
                          <button
                            style={styles.statusBtnOrange}
                            onClick={() =>
                              handleUpdateStatus(c.complaint_id, "In Progress")
                            }
                          >
                            🔧 Inashughulikiwa
                          </button>
                        )}
                        <button
                          style={styles.statusBtnGreen}
                          onClick={() =>
                            handleUpdateStatus(c.complaint_id, "Resolved")
                          }
                        >
                          ✅ Imekamilika
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab: Mafundi */}
        {activeTab === "technicians" && (
          <div style={styles.list}>
            <button
              style={styles.addTechBtn}
              onClick={() => navigate("/add-technician")}
            >
              + Ongeza Mfundi
            </button>
            {technicians.length === 0 ? (
              <div style={styles.emptyCard}>
                <p>Hakuna mafundi waliosajiliwa bado</p>
              </div>
            ) : (
              technicians.map((t) => (
                <div key={t.tech_id} style={styles.card}>
                  <div style={styles.cardTop}>
                    <div style={styles.cardType}>
                      <span>👷</span>
                      <span style={styles.cardTypeName}>{t.full_name}</span>
                    </div>
                    <div
                      style={{
                        ...styles.badge,
                        background: t.is_available ? "#dcfce7" : "#fee2e2",
                        color: t.is_available ? "#166534" : "#dc2626",
                      }}
                    >
                      {t.is_available ? "✅ Yupo" : "❌ Hayupo"}
                    </div>
                  </div>
                  <div style={styles.cardLocation}>📞 {t.phone}</div>
                  <div style={styles.cardDesc}>🔧 {t.specialization}</div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Hotspots */}
        {activeTab === "hotspots" && (
          <div style={styles.list}>
            {hotspots.length === 0 ? (
              <div style={styles.emptyCard}>
                <p>Hakuna hotspots bado</p>
              </div>
            ) : (
              hotspots.map((h) => (
                <div key={h.hotspot_id} style={styles.card}>
                  <div style={styles.cardTop}>
                    <div style={styles.cardType}>
                      <span>🔥</span>
                      <span style={styles.cardTypeName}>{h.area}</span>
                    </div>
                    <div
                      style={{
                        ...styles.badge,
                        background: "#fee2e2",
                        color: "#dc2626",
                      }}
                    >
                      {h.complaint_count} Malalamiko
                    </div>
                  </div>
                  <div style={styles.cardDesc}>Aina: {h.complaint_type}</div>
                  <div style={styles.cardDate}>
                    🗓️ {formatDate(h.last_reported)}
                  </div>
                </div>
              ))
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
  logoutBtn: {
    background: "rgba(255,255,255,0.2)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: "8px",
    padding: "6px 14px",
    cursor: "pointer",
    fontSize: "13px",
  },
  content: { padding: "24px", maxWidth: "800px", margin: "0 auto" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gap: "12px",
    marginBottom: "24px",
  },
  statCard: { borderRadius: "12px", padding: "16px", textAlign: "center" },
  statNumber: { fontSize: "28px", fontWeight: "bold", marginBottom: "4px" },
  statLabel: { fontSize: "11px", color: "#475569", fontWeight: "600" },
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
  cardDate: { color: "#94a3b8", fontSize: "12px" },
  assignBox: { display: "flex", gap: "8px", marginTop: "12px" },
  assignSelect: {
    flex: 1,
    padding: "8px 12px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "13px",
    outline: "none",
  },
  assignBtn: {
    padding: "8px 16px",
    background: "#0369a1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },
  statusBtns: { display: "flex", gap: "8px", marginTop: "12px" },
  statusBtnOrange: {
    flex: 1,
    padding: "8px",
    background: "#ffedd5",
    color: "#9a3412",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },
  statusBtnGreen: {
    flex: 1,
    padding: "8px",
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
    color: "#64748b",
  },
  addTechBtn: {
    padding: "12px 20px",
    background: "linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
};
