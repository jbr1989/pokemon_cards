import TCGdex from "@tcgdex/sdk";

// Sistema de caché para reducir llamadas a la API
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

type CacheStore = {
  [key: string]: CacheEntry<unknown>;
};

const cache: CacheStore = {};
const CACHE_DURATION = 3600000 * 24; // 1 dia en milisegundos

// Función para obtener datos de la caché o de la API
export async function fetchWithCache(lang:string, type: string, value?: string): Promise<any> {
  const key = (value ? `${lang}_${type}_${value}` : `${lang}_${type}`) as keyof CacheStore;
  const now = Date.now();
  
  console.log("Cache", Buffer.byteLength(JSON.stringify(cache), "utf8"), Object.keys(cache));

  // Verificar si existe en caché y no ha expirado
  if (cache[key] && (now - cache[key].timestamp) < CACHE_DURATION) {
	  console.log("Cache HIT", key);
    return cache[key].data;
  }

  // console.log("MISS");
  
  let data = null;

  // Si no está en caché o expiró, hacer la petición
  try{
    const tcgdex = new TCGdex(lang);

    console.log("FETCHING", key);
    if (value == null) data = await tcgdex.fetch(type);
    else data = await tcgdex.fetch(type, value);
    // console.log("DONE");

     // Guardar en caché
    cache[key] = {
        data,
        timestamp: now
    };

  }catch(error){
    console.error("ERROR FETCHING", error);
    if (cache[key]) return cache[key].data; // Si hay error, devolver datos de cache aunque esten caducados
  }

  return data;
}