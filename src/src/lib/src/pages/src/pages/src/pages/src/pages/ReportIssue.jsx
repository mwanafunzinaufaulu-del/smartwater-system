import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const maeneo = {
  Arusha: {
    "Arusha Mjini": [
      "Kaloleni",
      "Kati",
      "Elerai",
      "Kimandolu",
      "Lemara",
      "Levolosi",
      "Moshono",
      "Muriet",
      "Ngarenaro",
      "Olmoti",
      "Pangani",
      "Sekei",
      "Sokon1",
      "Sokon2",
      "Themi",
      "Tululusia",
      "Unga Limited",
      "Engutoto",
      "Baraa",
      "Daraja Mbili",
      "Kijenge",
      "Kinawani",
      "Koingoni",
      "Mianzini",
      "Mlangarini",
      "Naura",
      "Oloirien",
      "Rojorojo",
      "Sombetini",
      "Terrat",
    ],
    Arumeru: [
      "Bangata",
      "Karangai",
      "Leguruki",
      "Malula",
      "Mbuguni",
      "Mererani",
      "Mkuru",
      "Mlangarini",
      "Nambala",
      "Nduruma",
      "Ng'iresi",
      "Nkoaranga",
      "Nkwait",
      "Olmolog",
      "Poli",
      "Tengeru",
      "Usa River",
      "Kikwe",
      "Kivesi",
      "Kwakuchinja",
    ],
    Monduli: [
      "Esilalei",
      "Lolkisale",
      "Makuyuni",
      "Mererani",
      "Monduli Juu",
      "Monduli Mjini",
      "Moivo",
      "Ngarenairobi",
      "Olkung'wado",
      "Engaruka",
    ],
    Karatu: [
      "Ayalabe",
      "Bashay",
      "Endabash",
      "Endamarariek",
      "Karatu Mjini",
      "Kansay",
      "Mbulumbulu",
      "Rhotia",
      "Tloma",
      "Qdundushi",
    ],
    Ngorongoro: [
      "Endulen",
      "Kakesio",
      "Loliondo",
      "Nainokanoka",
      "Ngorongoro",
      "Olbalbal",
      "Oloipiri",
      "Piyaya",
      "Sale",
      "Soitsambu",
    ],
  },
  "Dar es Salaam": {
    Ilala: [
      "Buguruni",
      "Changombe",
      "Gerezani",
      "Ilala",
      "Jangwani",
      "Kariakoo",
      "Kisutu",
      "Kitambaa",
      "Kivukoni",
      "Mchikichini",
      "Msimbazi",
      "Mtambo",
      "Upanga Magharibi",
      "Upanga Mashariki",
      "Ukonga",
      "Segerea",
      "Sinza",
      "Tabata",
      "Temeke",
      "Vingunguti",
      "Kipawa",
      "Kitunda",
      "Majohe",
      "Pugu",
      "Chanika",
    ],
    Kinondoni: [
      "Bunju",
      "Goba",
      "Kawe",
      "Kibamba",
      "Kigogo",
      "Kijitonyama",
      "Kinondoni",
      "Kunduchi",
      "Magomeni",
      "Makango",
      "Makuburi",
      "Mbezi",
      "Mburahati",
      "Mikocheni",
      "Msasani",
      "Mtoni",
      "Mwananyamala",
      "Mzimuni",
      "Ndugumbi",
      "Tandale",
      "Ukwamani",
      "Wazo",
      "Hananasif",
      "Hananasifu",
      "Kimara",
    ],
    Temeke: [
      "Azimio",
      "Chamazi",
      "Charambe",
      "Keko",
      "Kibondemaji",
      "Kilakala",
      "Kimbiji",
      "Kisarawe II",
      "Kurasini",
      "Makangarawe",
      "Mbagala",
      "Miburani",
      "Mjimwema",
      "Mtoni",
      "Pembamnazi",
      "Sandali",
      "Temeke",
      "Toangoma",
      "Yombo Vituka",
      "Somangila",
    ],
    Ubungo: [
      "Goba",
      "Kibamba",
      "Kimara",
      "Kwembe",
      "Mbezi Luis",
      "Msigwa",
      "Ubungo",
      "Makoka",
      "Kiluvya",
      "Limakuni",
    ],
    Kigamboni: [
      "Kigamboni",
      "Kibada",
      "Kisarawe",
      "Mjimwema",
      "Somangira",
      "Tungi",
      "Vijibweni",
      "Pembamnazi",
      "Ng'ombe",
      "Chamazi",
    ],
  },
  Morogoro: {
    "Morogoro Mjini": [
      "Boma",
      "Bustani",
      "Chamwino",
      "Kichangani",
      "Kihonda",
      "Kilakala",
      "Kingolwira",
      "Kiwanja",
      "Lukobe",
      "Mafiga",
      "Magomeni",
      "Mazimbu",
      "Mbuyuni",
      "Mji Mpya",
      "Msufini",
      "Mtaa wa Nne",
      "Mwembesongo",
      "Nzuguni",
      "Sabasaba",
      "Soweto",
      "Thamani",
      "Uwanja wa Ndege",
      "Msamvu",
      "Bigwa",
      "Mlimani",
    ],
    Mvomero: [
      "Doma",
      "Hembeti",
      "Kibati",
      "Kifumbu",
      "Kinda",
      "Lubungo",
      "Magome",
      "Maskati",
      "Mbigiri",
      "Mgeta",
      "Mhonda",
      "Mikese",
      "Mlali",
      "Msongozi",
      "Mvomero",
      "Pangawe",
      "Sigi",
      "Tankari",
      "Turiani",
      "Zombo",
    ],
    Kilosa: [
      "Berega",
      "Chakwale",
      "Gairo",
      "Kidodi",
      "Kilosa Mjini",
      "Kimamba",
      "Kisanga",
      "Lumuma",
      "Malangali",
      "Masanze",
      "Mikumi",
      "Msowero",
      "Rudewa",
      "Ulaya",
      "Uleling'ombe",
    ],
    Gairo: [
      "Gairo Mjini",
      "Idifu",
      "Imagi",
      "Kidete",
      "Kilangali",
      "Maguha",
      "Makutupora",
      "Malolo",
      "Nongwe",
      "Nzasa",
    ],
    Kilombero: [
      "Ifakara",
      "Itete",
      "Lupiro",
      "Malinyi",
      "Mchombe",
      "Mkangawalo",
      "Mngeta",
      "Mofu",
      "Mutumba",
      "Namawala",
      "Sanje",
      "Signali",
      "Utengule",
      "Viwanja Stesheni",
      "Mlimba",
    ],
  },
};

const ainaMatatizo = [
  { value: "No Water", label: "🚱 Maji Hayafiki", color: "#dc2626" },
  { value: "Leakage", label: "💧 Uvujaji wa Bomba", color: "#2563eb" },
  { value: "Billing Issue", label: "🧾 Tatizo la Bili", color: "#d97706" },
  { value: "Other", label: "❓ Tatizo Lingine", color: "#6b7280" },
];

export default function ReportIssue() {
  const [form, setForm] = useState({
    mkoa: "",
    wilaya: "",
    mtaa: "",
    complaint_type: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const wilayaList =
    form.mkoa && maeneo[form.mkoa] ? Object.keys(maeneo[form.mkoa]) : [];

  const mtaaList =
    form.mkoa && form.wilaya && maeneo[form.mkoa][form.wilaya]
      ? maeneo[form.mkoa][form.wilaya]
      : [];

  const handleChange = (field, value) => {
    if (field === "mkoa") {
      setForm((prev) => ({ ...prev, mkoa: value, wilaya: "", mtaa: "" }));
    } else if (field === "wilaya") {
      setForm((prev) => ({ ...prev, wilaya: value, mtaa: "" }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.mkoa || !form.wilaya || !form.mtaa || !form.complaint_type) {
      setError("Tafadhali jaza sehemu zote muhimu!");
      return;
    }
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      navigate("/");
      return;
    }

    const location = `${form.mtaa}, ${form.wilaya}, ${form.mkoa}`;

    const { error: dbError } = await supabase.from("complaints").insert([
      {
        customer_id: userData.user.id,
        complaint_type: form.complaint_type,
        description: form.description,
        location: location,
        status: "Submitted",
      },
    ]);

    if (dbError) {
      setError("Imeshindwa kutuma. Jaribu tena!");
      setLoading(false);
      return;
    }

    await supabase.from("hotspot_reports").insert([
      {
        area: `${form.wilaya}, ${form.mkoa}`,
        complaint_type: form.complaint_type,
      },
    ]);

    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>✅</div>
          <h2 style={styles.successTitle}>Imetumwa!</h2>
          <p style={styles.successText}>
            Malalamiko yako yametumwa kwa mafanikio. Tutashughulikia haraka!
          </p>
          <button style={styles.button} onClick={() => navigate("/customer")}>
            Rudi Dashboard →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.icon}>📋</div>
          <h2 style={styles.title}>Ripoti Tatizo</h2>
          <p style={styles.subtitle}>Tujulishe tatizo la maji</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.form}>
          {/* Aina ya Tatizo */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Aina ya Tatizo *</label>
            <div style={styles.typeGrid}>
              {ainaMatatizo.map((aina) => (
                <div
                  key={aina.value}
                  style={{
                    ...styles.typeCard,
                    borderColor:
                      form.complaint_type === aina.value
                        ? aina.color
                        : "#e5e7eb",
                    background:
                      form.complaint_type === aina.value
                        ? aina.color + "15"
                        : "white",
                  }}
                  onClick={() => handleChange("complaint_type", aina.value)}
                >
                  <span style={{ fontSize: "24px" }}>
                    {aina.label.split(" ")[0]}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#374151",
                      textAlign: "center",
                    }}
                  >
                    {aina.label.split(" ").slice(1).join(" ")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mkoa */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Mkoa *</label>
            <select
              style={styles.select}
              value={form.mkoa}
              onChange={(e) => handleChange("mkoa", e.target.value)}
            >
              <option value="">-- Chagua Mkoa --</option>
              {Object.keys(maeneo).map((mkoa) => (
                <option key={mkoa} value={mkoa}>
                  {mkoa}
                </option>
              ))}
            </select>
          </div>

          {/* Wilaya */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Wilaya *</label>
            <select
              style={styles.select}
              value={form.wilaya}
              onChange={(e) => handleChange("wilaya", e.target.value)}
              disabled={!form.mkoa}
            >
              <option value="">
                {form.mkoa ? "-- Chagua Wilaya --" : "-- Chagua Mkoa Kwanza --"}
              </option>
              {wilayaList.map((wilaya) => (
                <option key={wilaya} value={wilaya}>
                  {wilaya}
                </option>
              ))}
            </select>
          </div>

          {/* Mtaa */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Mtaa *</label>
            {form.wilaya ? (
              <div style={styles.mtaaGrid}>
                {mtaaList.map((mtaa) => (
                  <div
                    key={mtaa}
                    style={{
                      ...styles.mtaaChip,
                      background: form.mtaa === mtaa ? "#0369a1" : "#f1f5f9",
                      color: form.mtaa === mtaa ? "white" : "#374151",
                    }}
                    onClick={() => handleChange("mtaa", mtaa)}
                  >
                    {mtaa}
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.disabledBox}>
                {form.mkoa
                  ? "-- Chagua Wilaya Kwanza --"
                  : "-- Chagua Mkoa Kwanza --"}
              </div>
            )}
          </div>

          {/* Eneo lililochaguliwa */}
          {form.mtaa && (
            <div style={styles.summaryBox}>
              <p style={styles.summaryText}>
                📍 <strong>Eneo:</strong> {form.mtaa}, {form.wilaya},{" "}
                {form.mkoa}
              </p>
            </div>
          )}

          {/* Maelezo */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Maelezo Zaidi (hiari)</label>
            <textarea
              style={styles.textarea}
              placeholder="Elezea tatizo kwa undani zaidi..."
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <button
            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "⏳ Inatuma..." : "📤 Tuma Ripoti →"}
          </button>

          <button
            style={styles.backButton}
            onClick={() => navigate("/customer")}
          >
            ← Rudi Nyuma
          </button>
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
    maxWidth: "480px",
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
    margin: "20px 24px 0",
    borderRadius: "8px",
    fontSize: "14px",
    textAlign: "center",
  },
  form: { padding: "24px" },
  inputGroup: { marginBottom: "20px" },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
  },
  select: {
    width: "100%",
    padding: "12px 14px",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    background: "white",
    cursor: "pointer",
  },
  disabledBox: {
    padding: "12px 14px",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    color: "#9ca3af",
    fontSize: "14px",
    background: "#f9fafb",
  },
  typeGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  typeCard: {
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    padding: "14px 10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
  },
  mtaaGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    maxHeight: "200px",
    overflowY: "auto",
    padding: "4px",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
  },
  mtaaChip: {
    padding: "8px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },
  textarea: {
    width: "100%",
    padding: "12px 14px",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "inherit",
  },
  summaryBox: {
    background: "#f0f9ff",
    border: "1px solid #bae6fd",
    borderRadius: "10px",
    padding: "12px 16px",
    marginBottom: "16px",
  },
  summaryText: { margin: 0, fontSize: "14px", color: "#0369a1" },
  button: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "10px",
  },
  backButton: {
    width: "100%",
    padding: "12px",
    background: "transparent",
    color: "#6b7280",
    border: "2px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "14px",
    cursor: "pointer",
  },
  successCard: {
    background: "white",
    borderRadius: "20px",
    padding: "50px 40px",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
  },
  successIcon: { fontSize: "60px", marginBottom: "16px" },
  successTitle: {
    color: "#16a34a",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 0 12px 0",
  },
  successText: {
    color: "#6b7280",
    fontSize: "15px",
    marginBottom: "24px",
  },
};
