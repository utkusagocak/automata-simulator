// Simple delay/pause function for async functions
export function delay(delay = 100) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
