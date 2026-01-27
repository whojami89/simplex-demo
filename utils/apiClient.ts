import { APIRequestContext } from '@playwright/test';

interface AuthResponse {
  token: string;
  adminUser: string;
}

export async function getAuthToken(request: APIRequestContext): Promise<string> {
  const response = await request.post(`${process.env.SYLIUS_API_URL || 'https://v2.demo.sylius.com'}/api/v2/admin/administrators/token`, {
    data: {
      "email": "api@example.com",
      "password": "sylius-api"
    },
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok()) {
    const errorBody = await response.text();
    throw new Error(`Failed to get token: ${response.status()} ${response.statusText()} - ${errorBody}`);
  }

  const body: AuthResponse = await response.json();
  return body.token;
}