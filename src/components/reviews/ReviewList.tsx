import type { Review } from '../../types/product'
import { formatDate } from '../../utils/format'
import StarRating from '../ui/StarRating'

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-muted">No reviews yet. Be the first to write one.</p>
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li
          key={`${review.date}-${review.reviewerName}-${review.comment}`}
          className="rounded-xl border border-line bg-surface p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold">{review.reviewerName}</p>
            <time dateTime={review.date} className="text-sm text-muted">
              {formatDate(review.date)}
            </time>
          </div>
          <div className="mt-1">
            <StarRating value={review.rating} />
          </div>
          <p className="mt-2 text-ink">{review.comment}</p>
        </li>
      ))}
    </ul>
  )
}
