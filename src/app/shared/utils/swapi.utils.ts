/**
 * Extracts the numeric ID from a SWAPI resource URL.
 */
// // export function extractSwapiId(url: string): string {
// //   const match = url.match(/\/(\d+)\/$/);
// //   return match ? match[1] : '';
// // }

// export function extractSwapiId(url: string): string {
//   const match = url.match(/\/(\d+)\/$/);
//   return match ? match[1] : '';
// }

export function extractSwapiId(url: string): string {
  return url
    ?.replace(/\/$/, '') // strip trailing slash
    ?.split('/')
    ?.pop() ?? '';
}