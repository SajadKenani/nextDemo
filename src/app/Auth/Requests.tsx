interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
}

const LINK_URL = 'https://dev.crm.newyolk.io/api';

const fetchFromApi = async (
  path: string, 
  { method, body }: RequestOptions
): Promise<any> => {
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

    const response = await fetch(`${LINK_URL}/${path}`, config);

    
    if (!response.ok) {
      const errorDetails = await response.text();
      console.error(`API Error (${response.status}): ${errorDetails}`);
      throw new Error(`Error ${response.status}: ${errorDetails}`);
    } 

    if (response.headers.get('Content-Type')?.includes('application/json')) {
      return await response.json();
    }

    return await response.text() || null;
  } catch (error) {
    console.error(`Request failed (${method} ${path}):`, error);
    throw error;
  }
};

export const GET = async (path: string): Promise<any> => {
  return fetchFromApi(path, { method: 'GET' });
};

export const POST = async (path: string, content: any = {}): Promise<any> => {
  return fetchFromApi(path, { method: 'POST', body: content });
};

export const PUT = async (path: string, content: any = {}): Promise<any> => {
  return fetchFromApi(path, { method: 'PUT', body: content });
};

export const DELETE = async (path: string, content: any = null): Promise<any> => {
  const options: RequestOptions = { method: 'DELETE' };
  if (content !== null) {
    options.body = content;
  }
  return fetchFromApi(path, options);
};