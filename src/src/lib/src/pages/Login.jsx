import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Barua pepe au nywila si sahihi!");
      setLoading(false);
      return;
    }

    // Angalia aina ya mtumiaji
    const user = data.user;
    const role = user.user_metadata?.role;

    if (role === "admin") {
      navigate("/admin");
    } else if (role === "technician") {
      navigate("/technician");
    } else {
      navigate("/customer");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.icon}>💧</div>
          <h2 style={styles.title}>Smart Water System</h2>
          <p style={styles.subtitle}>Mfumo wa Maji Tanzania</p>
        </div>

        {/* Error */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Form */}
        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Barua Pepe</label>
            <input
              style={styles.input}
              type="email"
              placeholder="mfano@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Nywila</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Weka nywila yako"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "⏳ Inaingia..." : "Ingia →"}
          </button>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Huna akaunti?{" "}
            <span
              style={styles.footerLink}
              onClick={() => navigate("/register")}
            >
              Jisajili hapa
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
    padding: "40px 20px",
    textAlign: "center",
  },
  icon: {
    fontSize: "48px",
    marginBottom: "10px",
  },
  title: {
    color: "white",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 0 6px 0",
  },
  subtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: "14px",
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
  form: {
    padding: "30px 30px 10px",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },
  footer: {
    padding: "20px 30px 30px",
    textAlign: "center",
  },
  footerText: {
    color: "#6b7280",
    fontSize: "14px",
  },
  footerLink: {
    color: "#0369a1",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
