export default function ErrorBanner({ error }) {
  if (!error) return null
  return (
    <div className="error-banner">
      <strong>{error.message || error}</strong>
      {error.details && Array.isArray(error.details) && (
        <ul>
          {error.details.map((detail) => <li key={detail}>{detail}</li>)}
        </ul>
      )}
    </div>
  )
}
