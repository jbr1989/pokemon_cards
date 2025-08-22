import type { APIRoute } from 'astro';
import { PokeCardMiniHandler } from '../../../../handlers/PokeCardMiniHandler';
import { UserListCardHandler } from '../../../../handlers/db/UserList/UserListCardHandler';
import { UserListHandler } from '../../../../handlers/db/UserList/UserListHandler';

export const GET: APIRoute = async ({ params, url }) => {
  try {
    const { listId } = params;
    const lang = url.searchParams.get('lang') || 'en';

    if (!listId) {
      return new Response(JSON.stringify({ 
        error: 'List ID is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { list, error } = await UserListHandler.get({
        userListId: parseInt(listId as string, 0),
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
      cards: list?.cards || [],
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
