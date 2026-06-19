import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ProtectedRoute({ children, allowedRole }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      navigate("/");
      return;
    }

    const role = userData.user.user_metadata?.role;

    if (allowedRole && role !== allowedRole) {
      navigate("/");
      return;
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ fontSize: "48px" }}>💧</div>
        <p style={{ color: "#0369a1", fontSize: "18px", fontWeight: "600" }}>
          Inapakia...
        </p>
      </div>
    );
  }

  return children;
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f9ff",
  },
};
