/**
 * Square reports money as { amount, currency } where `amount` is the
 * smallest currency unit (cents for USD). Bigcapital expects decimal
 * dollars. Convert with cent-precision to avoid float drift.
 *
 * `centsToAmount(0)` → 0  (so division-free zero)
 * `centsToAmount(540)` → 5.4
 * `centsToAmount(undefined)` → 0
 */
export function centsToAmount(money: { amount?: number } | null | undefined): number {
  const cents = money?.amount;
  if (!cents || !Number.isFinite(cents)) return 0;
  return Math.round(cents) / 100;
}
