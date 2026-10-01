export default function ErrorMessage({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="state-block" role="alert">
      <div className="icon">⚠️</div>
      <h3>{title}</h3>
      <p>{message || 'Please try again.'}</p>
      {onRetry && (
        <div className="actions">
          <button className="btn btn-primary" onClick={onRetry}>Try Again</button>
        </div>
      )}
    </div>
  )
}
