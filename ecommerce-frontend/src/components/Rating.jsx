export default function Rating({ value = 0, reviewCount, size = 'sm' }) {
  const full = Math.round(value)
  const stars = '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5 - full)
  return (
    <div className="rating-row" aria-label={`Rated ${value} out of 5${reviewCount != null ? `, ${reviewCount} reviews` : ''}`}>
      <span className="stars" aria-hidden="true">{stars}</span>
      <span>{value.toFixed ? value.toFixed(1) : value}</span>
      {reviewCount != null && <span>({reviewCount})</span>}
    </div>
  )
}
