import client from './client';

export async function createOrder(orderData) {
  const { data } = await client.post('/orders', orderData);
  return data;
}

export async function getMyOrders() {
  const { data } = await client.get('/orders');
  return data;
}

export async function getOrderById(id) {
  const { data } = await client.get(`/orders/${id}`);
  return data;
}
