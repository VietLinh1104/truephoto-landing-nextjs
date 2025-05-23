// Hàm fetchAPI này hỗ trợ đầy đủ các phương thức HTTP: GET, POST, PUT, DELETE
// Sử dụng:
// - GET:   fetchAPI('endpoint') hoặc fetchAPI('endpoint', { method: 'GET' })
// - POST:  fetchAPI('endpoint', { method: 'POST', body: { ... } })
// - PUT:   fetchAPI('endpoint', { method: 'PUT', body: { ... } })
// - DELETE:fetchAPI('endpoint', { method: 'DELETE' })

interface FetchAPIOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  revalidateSeconds?: number;
}

interface APIResponse<T = unknown> {
  data?: T;
  error?: string;
}

const API_BASE_URL = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api`;

export async function fetchAPI<T = unknown>(
  endpoint: string,
  { method = 'GET', body, headers, revalidateSeconds = 60 }: FetchAPIOptions = {}
): Promise<APIResponse<T>> {
  const url = `${API_BASE_URL}/${endpoint}`;
  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      next: { revalidate: revalidateSeconds },
    });

    if (!res.ok) throw new Error(`API Error: ${res.status}`);

    const json = await res.json();
    return { data: json.data };
  } catch (error) {
    console.error('Fetch API Error:', error);
    return { error: 'Không thể kết nối đến API hoặc có lỗi xảy ra.' };
  }
} 