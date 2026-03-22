export function cn(
  ...parts: Array<string | boolean | null | undefined>
): string {
  return parts.filter(Boolean).join(' ')
}
