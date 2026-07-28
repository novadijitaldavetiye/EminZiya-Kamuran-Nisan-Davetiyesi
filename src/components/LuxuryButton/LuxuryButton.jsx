import "./LuxuryButton.css";

export default function LuxuryButton({ children, onClick }) {
  return (
    <button className="luxury-button" onClick={onClick}>
      {children}
    </button>
  );
}