// src/components/ui/LoadingSpinner.jsx
export default function LoadingSpinner({ size = 24, color = 'var(--color-accent)' }) {
  return (
    <span style={{
      display: 'inline-block',
      width: size,
      height: size,
      border: `2px solid ${color}33`,
      borderTop: `2px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  );
}
