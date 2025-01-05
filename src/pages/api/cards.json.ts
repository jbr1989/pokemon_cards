
import type { APIRoute } from 'astro';
import TCGdex from '@tcgdex/sdk'

export const GET: APIRoute = async ({ params, request }) => {
  console.log(request);
  console.log(params);

}


// export const GET: APIRoute = async ({ url }) => {
//   console.log(url);
//   const setId = url.searchParams.get('set');
//   console.log(setId);
  
//   if (!setId) {
//     return new Response(JSON.stringify({ error: 'Set ID is required' }), {
//       status: 400,
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
//   }

//   try {
//     const tcgdex = new TCGdex('es');
//     const selectedSet = await tcgdex.fetch('sets', setId);
//     const cards = selectedSet.cards;

//     return new Response(JSON.stringify(cards), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });

//   } catch (error) {
//     return new Response(JSON.stringify({ error: 'Failed to fetch cards' }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
//   }
// }
