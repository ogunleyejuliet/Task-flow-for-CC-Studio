export type ClassValue = string | number | null | false | undefined

/**
 * Tiny class-name combiner. Filters falsy values and joins the rest with a
 * space so components can compose conditional classes cleanly.
 */
export function cx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ')
}