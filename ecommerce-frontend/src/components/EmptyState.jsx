import { Link } from 'react-router-dom'

export default function EmptyState({ icon = '🛍️', title, message, actionLabel, actionTo, onAction }) {
  return (
    <div className="state-block">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {(actionLabel && (actionTo || onAction)) && (
        <div className="actions">
          {actionTo ? (
            <Link to={actionTo} className="btn btn-primary">{actionLabel}</Link>
          ) : (
            <button className="btn btn-primary" onClick={onAction}>{actionLabel}</button>
          )}
        </div>
      )}
    </div>
  )
}
