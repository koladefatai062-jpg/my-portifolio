const BASE = '/api/orders';

export const placeOrder = async (data) => {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to place order');
  return res.json();
};

export const lookupOrders = async (email) => {
  const res = await fetch(`${BASE}/lookup?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};

export const getAdminOrders = async (token) => {
  const res = await fetch(BASE, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};

export const updateOrderStatus = async (id, status, token) => {
  const res = await fetch(`${BASE}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update order');
  return res.json();
};
