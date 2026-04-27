export function logClient(event, details = {}) {
  console.info(`[client] ${event}`, details)
}

export function logClientError(event, error) {
  console.error(`[client-error] ${event}`, error)
}
