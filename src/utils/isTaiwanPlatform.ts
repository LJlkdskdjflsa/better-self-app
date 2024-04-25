export function isTaiwanPlatform(): boolean {
  return process.env.NEXT_PUBLIC_PLATFORM === 'TAIWAN';
}
