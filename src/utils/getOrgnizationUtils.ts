/**
 * Gets the name based on the PLATFORM environment variable.
 * @returns {string} The name corresponding to the platform.
 */
export function getOrgnizationName(): string {
  const platform = process.env.NEXT_PUBLIC_PLATFORM;
  let name = 'Fuhai'; // Default name if PLATFORM is not TAIWAN

  if (platform === 'TAIWAN') {
    name = 'Jexecllent';
  }

  return name;
}

/**
 * Checks if the current platform is TAIWAN.
 * @returns {boolean} True if the platform is TAIWAN, false otherwise.
 */
export function isTaiwanPlatform(): boolean {
  return process.env.NEXT_PUBLIC_PLATFORM === 'TAIWAN';
}
