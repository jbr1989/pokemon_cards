import type { APIRoute } from 'astro';
import { UserListCardHandler } from '../../../handlers/db/UserList/UserListCardHandler';
import { UserListHandler } from '../../../handlers/db/UserList/UserListHandler';
import { getSession } from 'auth-astro/server';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const listId = formData.get('listId') as string;
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;

    if (!listId || !name || !type) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const session = await getSession(request);
    console.log("SESSION", session);

    console.log(`Adding list ${name} with type ${type}`);

    const { success, error } = await UserListHandler.add({
      userListId: listId,
      name: name,
      type: type,
      userId: parseInt(session?.user?.id?.toString() || "0"),
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
