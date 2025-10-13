export async function makeRequest<T, B>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: B
): Promise<T> {
  const token = localStorage.getItem('token');

  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  // Only add body for methods that support it
  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error('Error making the request');
  }

  // Handle void responses (like DELETE)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
