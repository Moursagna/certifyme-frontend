function StatsCard({ label, value, tone = 'primary' }) {
  return (
    <div className={`stats-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default StatsCard;
