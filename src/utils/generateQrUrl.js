export function generateQrUrl(carId, origin) {
  const baseUrl = origin || (typeof window !== 'undefined' ? window.location.origin : 'https://scandrive.com');

  return `${baseUrl.replace(/\/$/, '')}/car/${carId}`;
}