import type { Review } from '../../types/product'
import { isArrayOf, isRecord } from './common'
import { isReview } from './product.guards'

/** shop_reviews: productId (as text) -> reviews written in this browser. */
export type ReviewsMap = Record<string, Review[]>

export function isReviewsMap(value: unknown): value is ReviewsMap {
  return isRecord(value) && Object.values(value).every((reviews) => isArrayOf(reviews, isReview))
}
