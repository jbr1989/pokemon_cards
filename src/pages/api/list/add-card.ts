import type { APIRoute } from 'astro';
import { UserListCardHandler } from '../../../handlers/db/UserList/UserListCardHandler';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const listId = formData.get('listId') as string;
    const cardId = formData.get('cardId') as string;
    const lang = formData.get('lang') as string;

    if (!listId || !cardId || !lang) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`Adding card ${cardId} to list ${listId} with lang ${lang}`);

    const { success, error } = await UserListCardHandler.add({
      userListId: listId,
      cardId: cardId,
      lang: lang
    });

    if (!success) {
      return new Response(JSON.stringify({ 
        error: error 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Card added successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error adding card to list:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
