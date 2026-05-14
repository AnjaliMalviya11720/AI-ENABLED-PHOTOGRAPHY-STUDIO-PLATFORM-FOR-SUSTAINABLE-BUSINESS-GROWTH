type GenericFeaturePageProps = {
  title: string;
  subtitle: string;
  points: string[];
};

export default function GenericFeaturePage({
  title,
  subtitle,
  points,
}: GenericFeaturePageProps) {
  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>{title}</h1>
      <p style={{ color: "#4f5687", marginBottom: 16 }}>{subtitle}</p>
      <div
        style={{
          border: "1px solid rgba(17, 20, 57, 0.12)",
          borderRadius: 12,
          padding: 16,
          background: "rgba(255,255,255,0.94)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Implemented in this phase</h3>
        <ul>
          {points.map((point) => (
            <li key={point} style={{ marginBottom: 8 }}>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
