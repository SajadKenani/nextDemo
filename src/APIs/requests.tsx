interface RequestOptions<TBody = unknown> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: TBody;
}

const fetchFromApi = async <TResponse = unknown, TBody = unknown>(
  path: string,
  { method, body }: RequestOptions<TBody>,
): Promise<TResponse> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      method,
      headers,
    };

    // Only add body for non-GET requests if body exists
    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`/${path}`, config);

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error(`API Error (${response.status}): ${errorDetails}`);
      throw new Error(`Error ${response.status}: ${errorDetails}`);
    }

    if (response.headers.get('Content-Type')?.includes('application/json')) {
      return await response.json();
    }

    return (await response.text()) as unknown as TResponse;
  } catch (error) {
    console.error(`Request failed (${method} ${path}):`, error);
    throw error;
  }
};

export const GET = async <TResponse = unknown>(path: string): Promise<TResponse> => {
  return fetchFromApi<TResponse>(path, { method: 'GET' });
};

export const POST = async <TResponse = unknown, TBody = unknown>(
  path: string,
  content: TBody,
): Promise<TResponse> => {
  return fetchFromApi<TResponse, TBody>(path, { method: 'POST', body: content });
};

export const PUT = async <TResponse = unknown, TBody = unknown>(
  path: string,
  content: TBody,
): Promise<TResponse> => {
  return fetchFromApi<TResponse, TBody>(path, { method: 'PUT', body: content });
};

export const DELETE = async <TResponse = unknown, TBody = unknown>(
  path: string,
  content?: TBody,
): Promise<TResponse> => {
  const options: RequestOptions<TBody> = { method: 'DELETE' };
  if (content !== undefined) {
    options.body = content;
  }
  return fetchFromApi<TResponse, TBody>(path, options);
};