// Shared document store for chatbot
// In production, replace with a database

const documentStore = new Map<string, string>();

export function getDocumentText(sessionId: string): string {
  return documentStore.get(sessionId) || '';
}

export function setDocumentText(sessionId: string, text: string): void {
  const existing = documentStore.get(sessionId) || '';
  documentStore.set(sessionId, existing + '\n\n---\n\n' + text);
}

export function clearDocumentText(sessionId: string): void {
  documentStore.delete(sessionId);
}

