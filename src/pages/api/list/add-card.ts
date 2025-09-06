import type { APIRoute } from 'astro';
import { UserListCardHandler } from '../../../handlers/db/UserList/UserListCardHandler';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const listCardId = formData.get('listCardId') as string;
    const listId = formData.get('listId') as string;
    const cardId = formData.get('cardId') as string;
    const cardName = formData.get('cardName') as string;
    const lang = formData.get('lang') as string;
    const variant = formData.get('variant') as string;

    if (!listId || !cardId || !lang) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let successAction = false as boolean;
    let errorAction = "" as string | null;

    if (listCardId=="0") {

      console.log(`Adding card ${cardId} to list ${listId} with lang ${lang}`);

      const { success, error } = await UserListCardHandler.add({
        userListId: listId,
        cardId: cardId,
        cardName: cardName,
        lang: lang,
        variant: variant,
      });

      successAction = success;
      errorAction = error;

    }else{

      console.log(`Updating card ${cardId} to list ${listId} with lang ${lang}`);

      const { success, error } = await UserListCardHandler.update({
        userListCardId: listCardId,
        userListId: listId,
        cardId: cardId,
        cardName: cardName,
        lang: lang,
        variant: variant,
      });

      successAction = success;
      errorAction = error;
    }

    if (!successAction) {
      return new Response(JSON.stringify({ 
        error: errorAction 
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
