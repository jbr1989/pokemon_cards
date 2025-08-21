import type { APIRoute } from 'astro';
import { PokeCardMiniHandler } from '../../../../handlers/PokeCardMiniHandler';

export const GET: APIRoute = async ({ params, url }) => {
  try {
    const { setId } = params;
    const lang = url.searchParams.get('lang') || 'en';

    if (!setId) {
      return new Response(JSON.stringify({ 
        error: 'Set ID is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { cards, error } = await PokeCardMiniHandler.getAll({
      setId: setId,
      language: lang,
    });

    if (error) {
      return new Response(JSON.stringify({ 
        error: error
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true,
      cards: cards || [],
      set: setId,
      lang: lang
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error getting cards by set:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
