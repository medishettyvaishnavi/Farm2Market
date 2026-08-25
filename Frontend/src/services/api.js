const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}), ...(localStorage.getItem('farm2market_token') ? { Authorization: `Bearer ${localStorage.getItem('farm2market_token')}` } : {}) },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'Request failed');
  return body;
}

export const api = {
  register: data => request('/buyers/register', { method: 'POST', body: JSON.stringify(data) }),
  login: data => request('/buyers/login', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request('/buyers/me'),
  updateMe: data => request('/buyers/me', { method: 'PATCH', body: JSON.stringify(data) }),
  verification: id => request(`/buyers/${id}/verification`),
  listings: params => request(`/marketplace/listings?${new URLSearchParams(params)}`),
  demands: () => request('/demands'),
  createDemand: data => request('/demands', { method: 'POST', body: JSON.stringify(data) }),
  updateDemand: (id, data) => request(`/demands/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteDemand: id => request(`/demands/${id}`, { method: 'DELETE' }),
  matches: id => request(`/marketplace/matches/${id}`),
  offers: () => request('/offers'),
  deals: () => request('/deals'),
  createOffer: data => request('/offers', { method: 'POST', body: JSON.stringify(data) }),
  counterOffer: (id, data) => request(`/offers/${id}/counter`, { method: 'POST', body: JSON.stringify(data) }),
  acceptOffer: id => request(`/offers/${id}/accept`, { method: 'POST' }),
  rejectOffer: id => request(`/offers/${id}/reject`, { method: 'POST' }),
  withdrawOffer: id => request(`/offers/${id}/withdraw`, { method: 'POST' }),
  conversations: () => request('/conversations'),
  messages: id => request(`/conversations/${id}/messages`),
  sendMessage: (id, data) => request(`/conversations/${id}/messages`, { method: 'POST', body: JSON.stringify(data) }),
};

export function saveSession(result) { localStorage.setItem('farm2market_token', result.token); localStorage.setItem('farm2market_buyer', JSON.stringify(result.buyer)); }
export function clearSession() { localStorage.removeItem('farm2market_token'); localStorage.removeItem('farm2market_buyer'); }
