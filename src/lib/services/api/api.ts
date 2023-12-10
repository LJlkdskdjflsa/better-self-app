export async function makeRequest<T, B>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: B
): Promise<T> {
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    throw new Error('Error making the request');
  }

  return response.json() as Promise<T>;
}
