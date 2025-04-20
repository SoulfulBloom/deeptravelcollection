import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Check if queryKey is an array with multiple parts (e.g., ['/api/destinations', id, 'recommendations'])
    let url: string;
    if (Array.isArray(queryKey) && queryKey.length > 1) {
      // Handle array queryKey format
      url = queryKey.join('/').replace(/\/+/g, '/');
      if (!url.startsWith('/')) {
        url = '/' + url;
      }
    } else {
      // Default to first item as URL
      url = queryKey[0] as string;
    }
    
    console.log("Fetching URL:", url);
    
    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

// Helper function to invalidate specific queries
export function invalidateQueries(queryKeys: string[]) {
  queryKeys.forEach(key => {
    queryClient.invalidateQueries({ queryKey: [key] });
  });
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: true,
      staleTime: 60000, // 1 minute
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
