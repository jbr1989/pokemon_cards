import type { APIRoute } from 'astro';
import { PokeSetHandler } from '../../handlers/PokeSetHandler';

export const GET: APIRoute = async ({ params, url }) => {
  try {
    const lang = url.searchParams.get('lang') || 'en';

    const { sets, error } = await PokeSetHandler.getAll({ language: lang });
    // console.log("SETS", sets);

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
      sets: sets || [],
      lang: lang
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });


  } catch (error) {
    console.error('Error getting sets:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
