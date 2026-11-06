import type { Category, Product, ProductsResponse, Review } from '../../types/product'
import { isArrayOf, isOptionalString, isRecord } from './common'

export function isReview(value: unknown): value is Review {
  return (
    isRecord(value) &&
    typeof value.rating === 'number' &&
    typeof value.comment === 'string' &&
    typeof value.date === 'string' &&
    typeof value.reviewerName === 'string'
  )
}

export function isProduct(value: unknown): value is Product {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    typeof value.category === 'string' &&
    isOptionalString(value.brand) &&
    typeof value.price === 'number' &&
    typeof value.discountPercentage === 'number' &&
    typeof value.rating === 'number' &&
    typeof value.stock === 'number' &&
    typeof value.thumbnail === 'string' &&
    isArrayOf(value.images, (image): image is string => typeof image === 'string') &&
    isArrayOf(value.reviews, isReview)
  )
}

export function isProductsResponse(value: unknown): value is ProductsResponse {
  return (
    isRecord(value) &&
    isArrayOf(value.products, isProduct) &&
    typeof value.total === 'number' &&
    typeof value.skip === 'number' &&
    typeof value.limit === 'number'
  )
}

export function isCategory(value: unknown): value is Category {
  return (
    isRecord(value) &&
    typeof value.slug === 'string' &&
    typeof value.name === 'string' &&
    typeof value.url === 'string'
  )
}

export function isCategoryList(value: unknown): value is Category[] {
  return isArrayOf(value, isCategory)
}
