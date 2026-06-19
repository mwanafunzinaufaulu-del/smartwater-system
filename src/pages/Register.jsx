import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    area: "",
    street: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setError("");

    // Validation
    if (!form.full_name || !form.email || !form.phone || !form.password) {
      setError("Tafadhali jaza sehemu zote!");
      return;
    }
    if (form.password !== form.confirm_password) {
      setError("Nywila hazifanani!");
      return;
    }
    if (form.password.length < 6) {
      setError("Nywila iwe na herufi 6 au zaidi!");
      return;
    }

    setLoading(true);

    // Unda akaunti kwenye Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.full_name,
          role: "customer",
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Hifadhi taarifa kwenye customers table
    const { error: dbError } = await supabase.from("customers").insert([
      {
        customer_id: data.user.id,
        full_name: form.full_name,
        phone: form.phone,
        email: form.email,
        street: form.street,
        area: form.area,
      },
    ]);

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    alert("✅ Umesajiliwa! Sasa ingia.");
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.icon}>💧</div>
          <h2 style={styles.title}>Jisajili</h2>
          <p style={styles.subtitle}>Unda akaunti yako</p>
        </div>

        {/* Error */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Form */}
        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Jina Kamili</label>
            <input
              style={styles.input}
              type="text"
              name="full_name"
              placeholder="Jina lako kamili"
              value={form.full_name}
              onChange={handleChange}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Barua Pepe</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="mfano@gmail.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Namba ya Simu</label>
            <input
              style={styles.input}
              type="tel"
              name="phone"
              placeholder="0712345678"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Mkoa</label>
            <select
              style={styles.input}
              name="area"
              value={form.area}
              onChange={handleChange}
            >
              <option value="">-- Chagua Mkoa --</option>
              <option value="Arusha">Arusha</option>
              <option value="Dar es Salaam">Dar es Salaam</option>
              <option value="Morogoro">Morogoro</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Mtaa</label>
            <input
              style={styles.input}
              type="text"
              name="street"
              placeholder="Jina la mtaa wako"
              value={form.street}
              onChange={handleChange}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Nywila</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Herufi 6 au zaidi"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Thibitisha Nywila</label>
            <input
              style={styles.input}
              type="password"
              name="confirm_password"
              placeholder="Rudia nywila yako"
              value={form.confirm_password}
              onChange={handleChange}
            />
          </div>

          <button
            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "⏳ Inasajili..." : "Jisajili →"}
          </button>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Una akaunti?{" "}
            <span style={styles.footerLink} onClick={() => navigate("/")}>
              Ingia hapa
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    background: "white",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "420px",
    overflow: "hidden",
  },
  header: {
    background: "linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)",
    padding: "30px 20px",
    textAlign: "center",
  },
  icon: { fontSize: "40px", marginBottom: "8px" },
  title: {
    color: "white",
    fontSize: "22px",
    fontWeight: "bold",
    margin: "0 0 4px 0",
  },
  subtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: "13px",
    margin: 0,
  },
  errorBox: {
    background: "#fee2e2",
    color: "#dc2626",
    padding: "12px 16px",
    margin: "20px 30px 0",
    borderRadius: "8px",
    fontSize: "14px",
    textAlign: "center",
  },
  form: { padding: "24px 30px 10px" },
  inputGroup: { marginBottom: "16px" },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "13px",
    background: "linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "6px",
  },
  footer: { padding: "16px 30px 28px", textAlign: "center" },
  footerText: { color: "#6b7280", fontSize: "14px" },
  footerLink: {
    color: "#0369a1",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
