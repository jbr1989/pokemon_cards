import type { APIRoute } from 'astro';
import { UserListCardHandler } from '../../../handlers/db/UserList/UserListCardHandler';
import { getSession } from 'auth-astro/server';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const listCardId = formData.get('listCardId') as string;
    const listId = formData.get('listId') as string;

    if (!listCardId) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const session = await getSession(request);
    console.log("SESSION", session);

    console.log(`Removing card ${listCardId}`);

    const { success, error } = await UserListCardHandler.remove({
      userListCardId: listCardId,
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
      message: 'Card removed successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error removing card to list', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
