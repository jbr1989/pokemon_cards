import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/cards/set/[setId] - Get cards by set',
      '/api/list/add-card - Add card to list',
      '/api/test - This test endpoint'
    ]
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
