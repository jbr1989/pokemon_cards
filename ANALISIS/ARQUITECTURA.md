# DOCUMENTO DE ARQUITECTURA DE SOFTWARE

## PokéCards - Sistema de Exploración y Gestión de Cartas Pokémon TCG

**Versión:** 2.0
**Fecha:** 20 de Abril de 2026
**Estado:** Final

---

## 1. Descripción General del Sistema

PokéCards es una aplicación web progresiva (PWA) para explorar cartas del juego de cartas coleccionables de Pokémon (TCG) y gestionar colecciones personales. Permite a los usuarios registrados crear listas personalizadas de cartas y listas tipo Pokédex para tracking completo de su colección.

**URL de producción:** `https://pokecards.jbr1989.es`

---

## 2. Objetivos del Proyecto

| Código      | Descripción                                                                |
| ----------- | -------------------------------------------------------------------------- |
| **OBJ-001** | Explorar sets y cartas del Pokémon TCG con rendimiento óptimo              |
| **OBJ-002** | Permitir usuarios autenticados crear listas personales de cartas           |
| **OBJ-003** | Gestionar lista Pokédex para tracking de colección completa (1025 Pokémon) |
| **OBJ-004** | Autenticación segura con Google OAuth 2.0                                  |
| **OBJ-005** | Búsqueda y filtrado por nombre, set, rareza y tipo                         |
| **OBJ-006** | Caché de API para reducir latencia                                         |

---

## 3. Alcance

### INCLUYE

- Exploración de sets y cartas del Pokémon TCG
- Visualización detallada de cartas (imagen, descripción, rareza, variants)
- Búsqueda por nombre vía API TCGdex
- Filtrado por set, rareza y tipo
- Autenticación Google OAuth 2.0
- Creación, edición y eliminación de listas de usuario
- Adición/eliminación de cartas con atributos (idioma, variant, stamp, foil)
- **Lista tipo "pokedex": tracking completo de los 1025 Pokémon**
- PWA básica con manifest
- Caché API (24h TTL)
- Despliegue Vercel SSR

### NO INCLUYE

- Compra/venta de cartas
- Valoración económica
- Estadísticas de colección
- Exportación/importación de listas
- Chat o comunidad
- Notificaciones push
- Aplicación móvil nativa

---

## 4. Tipos de Usuarios

### Usuario Invitado

- Explorar sets y cartas públicamente
- Buscar cartas por nombre
- Ver detalles de cualquier carta
- Sin acceso a listas o colección

### Usuario Autenticado

- Hereda capacidades de invitado
- Crear/editar/eliminar listas propias
- Añadir/eliminar cartas de listas
- **Crear lista tipo "pokedex" (1-1025)**
- Editar atributos de cartas
- Acceso a perfil /you

---

## 5. Casos de Uso

### CU-001: Explorar Sets

**Actor:** Usuario Invitado/Autenticado
**Flujo:** Home → Popular Sets → Click set → `/set/{setId}`

1. Usuario navega a la página principal
2. Sistema carga PopularSets (sets más recientes/populares)
3. Usuario visualiza grid de sets con imagen, nombre y contador
4. Usuario hace clic en un set
5. Sistema carga página con todas las cartas del set

### CU-002: Ver Carta Detallada

**Actor:** Usuario Invitado/Autenticado
**Flujo:** `/set/{setId}` → Click carta → `/card/{cardId}`

1. Usuario está en página de set
2. Hace clic en una carta del grid
3. Sistema carga página de detalle con imagen, nombre, rareza, variants, ilustrador, set

### CU-003: Buscar Cartas por Nombre

**Actor:** Usuario Invitado/Autenticado
**Flujo:** Input búsqueda → `/search?name={query}` → Resultados

1. Usuario ingresa término en campo de búsqueda
2. Sistema consulta TCGdex
3. Muestra grid de cartas coincidentes

### CU-004: Iniciar Sesión con Google

**Actor:** Usuario Invitado
**Flujo:** Click Login → Google OAuth → Callback → Sesión activa

1. Usuario hace clic en 'Login'
2. Redirección a `/auth/signin`
3. Selección de Google
4. Consentimiento OAuth
5. Callback crea sesión JWT
6. Usuario creado en Turso si es nuevo

### CU-005: Crear Lista de Colección

**Actor:** Usuario Autenticado
**Flujo:** `/lists` → Add List → Formulario → API

1. Usuario navega a `/lists`
2. Sistema muestra listas existentes
3. Usuario hace clic en 'Add List'
4. Formulario pide nombre y tipo
5. API crea lista en BD

### CU-006: Añadir Carta a Lista

**Actor:** Usuario Autenticado
**Flujo:** Ver carta → Add to List → Atributos → API

1. Usuario autenticado ve carta
2. Hace clic en 'Add to List'
3. Selecciona lista, idioma, variant, stamp, foil
4. API crea registro

### CU-007: Eliminar Carta de Lista

**Actor:** Usuario Autenticado
**Flujo:** `/list/{listId}` → Eliminar carta → API

1. Usuario navega a su lista
2. Hace clic en eliminar de una carta
3. API elimina registro

### CU-008: Eliminar Lista Completa

**Actor:** Usuario Autenticado
**Flujo:** `/lists` → Eliminar lista → Confirmación → DELETE

1. Usuario está en página de listas
2. Hace clic en eliminar
3. Confirmación requerida
4. Sistema elimina lista y todos sus registros

### CU-009: Crear Lista Pokédex

**Actor:** Usuario Autenticado
**Flujo:** `/lists` → Add List → Type: "pokedex" → API

1. Usuario autenticado navega a `/lists`
2. Crea nueva lista seleccionando tipo "pokedex"
3. Sistema crea lista vacía
4. Al ver la lista, sistema:
   - Obtiene los 1025 Pokémon de la base de datos local
   - Compara con cartas almacenadas
   - Muestra grid completo con huecos donde faltan cartas

---

## 6. Arquitectura del Sistema

```
┌─────────────────────────────────────────────┐
│              CLIENTE (Browser)              │
│   Astro Pages + Tailwind CSS + JS mínimo   │
└────────────────────┬──────────────────────┘
                     │ HTTP
┌────────────────────┴──────────────────────┐
│            SERVIDOR (Vercel)              │
│  ┌─────────────────────────────────────┐  │
│  │         APLICACIÓN ASTRO            │  │
│  │  Pages → Handlers → Adapters        │  │
│  └─────────────────────────────────────┘  │
└──────────────┬──────────────────┬──────────┘
              │                  │
     ┌────────┴────────┐  ┌─────┴──────┐
     │  TCGdex API     │  │   Turso DB  │
     │ (api.tcgdex.net)│  │   (libSQL)  │
     └─────────────────┘  └─────────────┘
```

### Capas

| Capa         | Componentes                                                    |
| ------------ | -------------------------------------------------------------- |
| Presentación | `src/pages/`, `src/components/`, `src/layouts/`                |
| Lógica       | `src/handlers/` (PokeCardHandler, UserListHandler, etc.)       |
| Datos        | `src/adapters/cardApi/` (TCGdex), `src/adapters/bbdd/` (Turso) |
| Modelos      | `src/models/`                                                  |
| Utils        | `src/utils/UserListUtils.ts`                                   |

---

## 7. Tecnologías Utilizadas

| Tecnología       | Versión                | Justificación                               |
| ---------------- | ---------------------- | ------------------------------------------- |
| **Astro**        | 6.1.7                  | Framework híbrido SSR/SSG, alto rendimiento |
| **Tailwind CSS** | 4.2.2                  | Utilidades CSS, diseño responsivo           |
| **Vercel**       | adapter 10.0.4         | Deployment serverless, CDN global           |
| **Turso**        | @libsql/client 0.15.15 | SQLite cloud, serverless                    |
| **Auth-Astro**   | 4.2.0                  | Autenticación Google OAuth                  |
| **TCGdex SDK**   | 2.8.0                  | API datos Pokémon TCG                       |
| **Zod**          | 3.25.76                | Validación de datos                         |

---

## 8. Modelo de Datos

### 8.1 Diagrama Entidad-Relación

```
┌─────────────┐       ┌─────────────┐       ┌──────────────┐
│    users    │       │    lists    │       │  lists_cards │
├─────────────┤       ├─────────────┤       ├──────────────┤
│ id (PK)     │──┐    │ id (PK)     │──┐    │ id (PK)      │
│ name        │  │    │ user_id(FK)│──┼────│ listId (FK)  │
│ email       │  └───►│ name        │  │    │ cardId       │
│ image       │       │ type        │  │    │ serieId      │
│ provider    │       │ created_at  │  │    │ setIdOther   │
│ provider_id │       └─────────────┘  │    │ lang         │
│ created_at  │                        │    │ variant      │
│ updated_at  │                        │    │ stamp        │
└─────────────┘                        │    │ foil         │
                                        │    │ created_at   │
                                        │    └──────────────┘
                                        │
                                        ▼
                    ┌─────────────┐       ┌──────────────┐
                    │   pokemon   │       │    cards     │
                    ├─────────────┤       ├──────────────┤
                    │ id (PK)     │       │ tcgId (PK)   │
                    │ name        │       │ card_name    │
                    └─────────────┘       │ dexId        │
                                         │ pokemon_name │
                                         │ created_at   │
                                         │ updated_at   │
                                         └──────────────┘
```

### 8.2 Definición de Tablas

#### Tabla: `users`

| Campo         | Tipo     | Constraints                | Descripción              |
| ------------- | -------- | -------------------------- | ------------------------ |
| `id`          | INTEGER  | PRIMARY KEY, AUTOINCREMENT | Identificador único      |
| `name`        | TEXT     | NOT NULL                   | Nombre del usuario       |
| `email`       | TEXT     | NOT NULL                   | Email del usuario        |
| `image`       | TEXT     | NULLABLE                   | URL de avatar            |
| `provider`    | TEXT     | NULLABLE                   | Proveedor OAuth (google) |
| `provider_id` | TEXT     | NULLABLE                   | ID en el provider        |
| `created_at`  | DATETIME | DEFAULT CURRENT_TIMESTAMP  | Fecha creación           |
| `updated_at`  | DATETIME | DEFAULT CURRENT_TIMESTAMP  | Última modificación      |

#### Tabla: `lists`

| Campo        | Tipo     | Constraints                      | Descripción                         |
| ------------ | -------- | -------------------------------- | ----------------------------------- |
| `id`         | INTEGER  | PRIMARY KEY, AUTOINCREMENT       | Identificador único                 |
| `user_id`    | INTEGER  | NOT NULL, FOREIGN KEY → users.id | Dueño de la lista                   |
| `name`       | TEXT     | NOT NULL                         | Nombre de la lista                  |
| `type`       | TEXT     | NOT NULL                         | Tipo (deck, set, pokedex, wishlist) |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP        | Fecha creación                      |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP        | Última modificación                 |

**Índices:** `idx_lists_user_id` ON (user_id)

#### Tabla: `lists_cards`

| Campo        | Tipo     | Constraints                      | Descripción                      |
| ------------ | -------- | -------------------------------- | -------------------------------- |
| `id`         | INTEGER  | PRIMARY KEY, AUTOINCREMENT       | Identificador único              |
| `listId`     | INTEGER  | NOT NULL, FOREIGN KEY → lists.id | Lista padre                      |
| `cardId`     | TEXT     | NOT NULL                         | ID TCGdex (ej: 'base1-1')        |
| `serieId`    | TEXT     | NOT NULL                         | Serie TCGdex                     |
| `setIdOther` | TEXT     | NULLABLE                         | Set alternativo                  |
| `lang`       | TEXT     | NOT NULL, DEFAULT 'en'           | Idioma de la carta               |
| `variant`    | TEXT     | NOT NULL                         | Variante (normal, reverse, holo) |
| `stamp`      | TEXT     | NULLABLE                         | Fecha de impresión               |
| `foil`       | TEXT     | NULLABLE                         | Tipo de foil                     |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP        | Fecha creación                   |

**Índices:** `idx_lists_cards_list_id` ON (listId)

#### Tabla: `pokemon`

| Campo  | Tipo    | Constraints | Descripción             |
| ------ | ------- | ----------- | ----------------------- |
| `id`   | INTEGER | PRIMARY KEY | Número Pokédex (1-1025) |
| `name` | TEXT    | NOT NULL    | Nombre del Pokémon      |

#### Tabla: `cards` (Caché Local)

| Campo          | Tipo     | Constraints               | Descripción         |
| -------------- | -------- | ------------------------- | ------------------- |
| `tcgId`        | TEXT     | PRIMARY KEY               | ID en TCGdex        |
| `card_name`    | TEXT     | NOT NULL                  | Nombre de la carta  |
| `dexId`        | INTEGER  | NULLABLE                  | Número Pokédex      |
| `pokemon_name` | TEXT     | NULLABLE                  | Nombre del Pokémon  |
| `created_at`   | DATETIME | DEFAULT CURRENT_TIMESTAMP | Fecha creación      |
| `updated_at`   | DATETIME | DEFAULT CURRENT_TIMESTAMP | Última modificación |

---

## 9. Diseño de API

### 9.1 Endpoints de Página (SSR)

| Método | Ruta                   | Descripción                      | Auth |
| ------ | ---------------------- | -------------------------------- | ---- |
| GET    | `/`                    | Página principal con PopularSets | No   |
| GET    | `/sets`                | Listado de todos los sets        | No   |
| GET    | `/set/{setId}`         | Cartas de un set                 | No   |
| GET    | `/card/{cardId}`       | Detalle de carta                 | No   |
| GET    | `/search?name={query}` | Búsqueda por nombre              | No   |
| GET    | `/explore`             | Exploración avanzada             | No   |
| GET    | `/pokemon`             | Exploración Pokémon              | No   |
| GET    | `/lists`               | Listas del usuario               | Sí   |
| GET    | `/list/{listId}`       | Detalle de lista con cartas      | Sí   |
| GET    | `/you`                 | Perfil del usuario               | Sí   |

### 9.2 Endpoints de API (REST)

#### GET `/api/sets`

```typescript
// Input
Query: { lang?: string } // default: 'en'

// Output 200
{
  "sets": [
    {
      "id": "sv06",
      "name": "Twilight Masquerade",
      "logo": "https://assets.tcgdex.net/...",
      "symbol": "https://assets.tcgdex.net/...",
      "cardCount": { "total": 226, "official": 216 }
    }
  ]
}
```

#### GET `/api/cards/set/{setId}`

```typescript
// Input
Path: setId (ej: "base1")
Query: { lang?: string } // default: 'en'

// Output 200
{
  "cards": [
    {
      "id": "base1-1",
      "localId": "1",
      "name": "Bulbasaur",
      "image": {
        "low": "https://assets.tcgdex.net/.../low.webp",
        "high": "https://assets.tcgdex.net/.../high.webp"
      }
    }
  ]
}
```

#### GET `/api/cards/list/{listId}`

```typescript
// Input
Path: listId (ej: "123")
Auth: Session JWT (user.id)

// Output 200
{
  "cards": [
    {
      "id": 456,
      "cardId": "base1-1",
      "serieId": "base",
      "setIdOther": "base1",
      "lang": "en",
      "variant": "normal",
      "stamp": null,
      "foil": null,
      "listId": 123,
      "cardName": "Bulbasaur",
      "pokemonName": "Bulbasaur",
      "dexId": 1,
      "image": "https://assets.tcgdex.net/..."
    }
  ],
  "error": null
}

// Output 403
{ "cards": null, "error": "Access denied" }
```

#### POST `/api/list/add-list`

```typescript
// Input
Body: {
  "name": string,    // 1-100 caracteres
  "type": string    // "deck" | "set" | "pokedex" | "wishlist"
}
Auth: Session JWT

// Output 201
{ "success": true, "listId": 123 }

// Output 400
{ "success": false, "error": "Name is required" }

// Output 401
{ "success": false, "error": "Unauthorized" }
```

#### POST `/api/list/add-card`

```typescript
// Input
Body: {
  "listId": string,
  "cardId": string,    // TCGdex ID (ej: "base1-1")
  "serieId": string,  // Serie TCGdex (ej: "base")
  "lang": string,      // "en" | "es" | "fr" | etc.
  "variant": string,   // "normal" | "reverse" | "holo" | etc.
  "stamp": string | null,
  "foil": string | null
}
Auth: Session JWT

// Output 201
{ "success": true }

// Output 400
{ "success": false, "error": "Invalid variant" }

// Output 403
{ "success": false, "error": "List not found or access denied" }
```

#### DELETE `/api/list/remove-card`

```typescript
// Input
Body: {
  "id": string  // ID del registro en lists_cards
}
Auth: Session JWT

// Output 200
{ "success": true }

// Output 403
{ "success": false, "error": "Card not found or access denied" }
```

---

## 10. Reglas de Negocio

| Código     | Descripción                                                                                                                                                                  |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RN-001** | Un usuario solo puede acceder a sus propias listas. Las consultas de listas sempre filtran por userId de la sesión activa.                                                   |
| **RN-002** | Los datos de cartas se obtienen exclusivamente de la API externa TCGdex. Solo se almacenan localmente datos de seguimiento de colección (listas y relaciones usuario-carta). |
| **RN-003** | Los idiomas soportados para cartas son los disponibles en TCGdex (en, es, fr, de, it, ja, ko, pt, zh). El idioma por defecto es 'en'.                                        |
| **RN-004** | Las variants de carta válidas son: normal, reverse, holo, reverse-holo, first-edition, promo. El sistema debe validar que el valor proporcionado esté en esta lista.         |
| **RN-005** | El nombre de lista debe tener entre 1 y 100 caracteres. El tipo de lista debe ser no vacío.                                                                                  |
| **RN-006** | Un usuario puede tener un número ilimitado de listas, pero cada lista puede tener un máximo práctico de 1000 cartas para rendimiento.                                        |
| **RN-007** | **Tipo "pokedex": La lista debe mostrar todos los Pokémon del 1 al 1025. Las cartas no poseídas se muestran como huecos vacíos.**                                            |
| **RN-008** | Los datos de API se cachean en memoria para evitar llamadas repetitivas. El caché tieneTTL de 24 horas.                                                                      |
| **RN-009** | La autenticación es obligatoria para cualquier operación de creación/edición/eliminación de listas y cartas. Los endpoints de lectura son públicos.                          |
| **RN-010** | Las imágenes de cartas se sirven desde el CDN de TCGdex (assets.tcgdex.net) en formatos webp optimizados (low/high).                                                         |

---

## 11. Flujos de Usuario

### Flujo 1: Exploración de Cartas

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  HOME   │────►│ SETS    │────►│ CARDS   │────►│ CARD   │
│   /     │     │ /sets   │     │ /set/   │     │ /card/ │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
     │                                    │            │
     │  1. Load PopularSets               │ 5. Click   │
     │     (API /api/sets)               │    card    │
     │                                    │            │
     ▼                                    ▼            │
┌─────────┐                               │            │
│ SEARCH  │◄──────────────────────────────┘            │
│ /search │  3. Enter search term                       │
└─────────┘                                             │
     │  2. Click search icon                            │
     ▼                                                  │
┌─────────┐                                            │
│ RESULTS │◄────────────────────────────────────────────┘
│         │  4. Display matching cards
└─────────┘
```

### Flujo 2: Inicio de Sesión

```
┌─────────┐     ┌─────────────┐     ┌──────────┐
│  USER   │────►│  SIGN IN    │────►│  GOOGLE  │
│  LOGIN │     │ /auth/signin│     │  AUTH    │
└─────────┘     └─────────────┘     └──────────┘
     │                                     │
     │ 1. Click login button              │
     │                                     │
     ▼                                     │
┌─────────┐     ┌─────────────┐             │
│ YOU     │◄────│  SESSION    │◄────────────┘
│ /you    │     │  CREATED    │   4. OAuth callback
└─────────┘     └─────────────┘
                      │
                      │ 2. Select Google
                      ▼
               ┌─────────────┐
               │  CONSENT    │
               │  SCREEN     │
               └─────────────┘
                      │
                      │ 3. Approve access
                      ▼
```

### Flujo 3: Crear Lista y Añadir Carta

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  LISTS  │────►│  ADD    │────►│ CONFIRM │────►│  LIST   │
│ /lists  │     │  FORM   │     │  API    │     │ CREATED │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
     │                │                                    │
     │ 1. Navigate    │ 2. Fill name & type                │
     │                                                        │
     ▼                                                        │
┌─────────┐                                                   │
│ CARD    │◄──────────────────────────────────────────────────┘
│ /card/  │                    6. Navigate to card
└─────────┘
     │
     │ 3. Click "Add to List"
     ▼
┌─────────┐     ┌─────────┐     ┌─────────┐
│  ADD    │────►│ CONFIRM │────►│  CARD   │
│  FORM   │     │  API    │     │ ADDED   │
└─────────┘     └─────────┘     └─────────┘
```

### Flujo 4: Lista Pokédex (NUEVO)

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌──────────┐
│  LISTS  │────►│  ADD    │────►│ POKEDEX │────►│ COMPLETE │
│ /lists  │     │  LIST   │     │  TYPE   │     │  LIST    │
└─────────┘     └─────────┘     └─────────┘     └──────────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │ 1. Fetch     │
                                    │ Pokemon 1-   │
                                    │ 1025 from DB │
                                    ├──────────────┤
                                    │ 2. Compare   │
                                    │ with cards   │
                                    ├──────────────┤
                                    │ 3. Render    │
                                    │ complete grid│
                                    │ with gaps    │
                                    └──────────────┘

Función: completeUserList() en src/utils/UserListUtils.ts
Parámetros: minId=1, maxId=1025
Retorna: Array de 1025 elementos con cartas poseídas y huecos vacíos
```

---

## 12. Manejo de Errores

### 12.1 Errores de Autenticación

| Código | Condición                                    | Respuesta                    |
| ------ | -------------------------------------------- | ---------------------------- |
| 401    | Usuario no autenticado en ruta protegida     | Redirect → `/auth/signin`    |
| 403    | Usuario intentando acceder a recurso de otro | "Acceso denegado" + Redirect |

### 12.2 Errores de API Externa

| Condición               | Respuesta UI                                 |
| ----------------------- | -------------------------------------------- |
| TCGdex timeout (>10s)   | "Error al cargar datos. Intenta más tarde."  |
| Carta/set no encontrado | Página 404 personalizada                     |
| Rate limiting           | "Demasiadas solicitudes. Espera un momento." |

### 12.3 Errores de Base de Datos

| Condición             | Manejo                                                                   |
| --------------------- | ------------------------------------------------------------------------ |
| Error conexión Turso  | Log + "Error de base de datos"                                           |
| Query fallida         | 500 + mensaje genérico                                                   |
| Violación constraints | Mensaje específico ('No puedes eliminar esta lista porque tiene cartas') |

### 12.4 Errores de Validación

| Tipo                 | Manejo                        |
| -------------------- | ----------------------------- |
| Input inválido (Zod) | Errores inline junto al campo |
| Parámetros faltantes | 400 + descripción del error   |

### 12.5 Códigos de Estado HTTP

| Código | Significado    | Uso                |
| ------ | -------------- | ------------------ |
| 200    | OK             | Lecturas exitosas  |
| 201    | Created        | Recursos creados   |
| 400    | Bad Request    | Validación fallida |
| 401    | Unauthorized   | No autenticado     |
| 403    | Forbidden      | Sin permisos       |
| 404    | Not Found      | Recurso no existe  |
| 500    | Internal Error | Error servidor     |

---

## 13. Consideraciones de Rendimiento

### 13.1 Optimizaciones de Carga

| Técnica       | Implementación                         |
| ------------- | -------------------------------------- |
| HTML Estático | Astro genera donde es posible          |
| Lazy Loading  | `loading="lazy"` en todas las imágenes |
| Formato WebP  | Imágenes en low/high .webp             |
| CDN Global    | Vercel Edge para assets estáticos      |

### 13.2 Estrategia de Caché

```
┌─────────────────────────────────────────────────────────────┐
│                      API CACHE (In-Memory)                   │
├─────────────────┬───────────────────┬───────────────────────┤
│   Tipo          │   TTL             │   Estrategia          │
├─────────────────┼───────────────────┼───────────────────────┤
│ Sets            │   24 horas        │   Refresh on demand   │
│ Series          │   24 horas        │   Refresh on demand   │
│ Cards           │   24 horas        │   LRU eviction        │
│ Card Details    │   24 horas        │   Key-based invalid.  │
└─────────────────┴───────────────────┴───────────────────────┘
```

### 13.3 Optimizaciones de Base de Datos

| Optimización          | Detalle                                        |
| --------------------- | ---------------------------------------------- |
| Índices               | `idx_lists_user_id`, `idx_lists_cards_list_id` |
| Prepared Statements   | Prevención SQL injection                       |
| Consultas específicas | Nunca `SELECT *`                               |
| Conexión singleton    | Una conexión por request                       |

### 13.4 Métricas Objetivo (Core Web Vitals)

| Métrica                        | Objetivo |
| ------------------------------ | -------- |
| LCP (Largest Contentful Paint) | < 2.5s   |
| FID (First Input Delay)        | < 100ms  |
| TTI (Time to Interactive)      | < 3.5s   |

---

## 14. Limitaciones y Supuestos

### 14.1 Limitaciones Conocidas

| Limitación         | Impacto                                  |
| ------------------ | ---------------------------------------- |
| Solo Pokémon TCG   | No soporte para Magic, Yu-Gi-Oh!, etc.   |
| Dependencia TCGdex | Imágenes y datos dependen de API externa |
| Solo Google OAuth  | No email/password ni otros providers     |
| Offline parcial    | Solo caché de páginas visitadas          |
| Sin app nativa     | Solo PWA web                             |
| Límites Turso      | Storage limitado en plan gratuito        |

### 14.2 Supuestos del Sistema

| Código | Supuesto                                                     |
| ------ | ------------------------------------------------------------ |
| SU-001 | Usuarios tienen acceso a internet                            |
| SU-002 | Navegadores modernos (Chrome, Firefox, Safari, Edge)         |
| SU-003 | Volumen moderado (cientos, no millones de usuarios)          |
| SU-004 | Datos TCGdex están actualizados y son precisos               |
| SU-005 | Dominio `pokecards.jbr1989.es` estará disponible             |
| SU-006 | Variables de entorno (TURSO*\*, AUTH_GOOGLE*\*) configuradas |
| SU-007 | Idioma predominante: inglés (default), soporte español       |
| SU-008 | Imágenes bajo licencia de TCGdex/API pública                 |
| SU-009 | Sin requisitos GDPR específicos adicionales                  |
| SU-010 | No requiere escalabilidad horizontal inmediata               |
| SU-011 | **Pokédex: 1025 Pokémon (sin Legendaries futuros >1025)**    |

---

## Anexo: Estructura de Proyecto

```
pokemon_cards/
├── public/
│   └── img/                    # Assets estáticos PWA
├── src/
│   ├── adapters/
│   │   ├── bbdd/
│   │   │   ├── BBDDInterface.ts
│   │   │   └── TursoAdapter.ts
│   │   ├── cardApi/
│   │   │   ├── ApiInterface.ts      # Contrato
│   │   │   ├── ApiCache.ts          # Caché 24h
│   │   │   ├── TCGdex.ts            # Adaptador principal
│   │   │   └── TCGio.ts            # Adaptador alternativo (sin uso)
│   │   └── pokemonApi/
│   │       └── PokemonApiAdapter.ts
│   ├── components/
│   │   ├── card/
│   │   │   ├── Card.astro
│   │   │   ├── CardActions.astro
│   │   │   ├── CardGrid.astro
│   │   │   └── CardGridItem.astro
│   │   ├── list/
│   │   │   ├── ListCardActions.astro
│   │   │   ├── ListCardFilter.astro
│   │   │   ├── ListCardForm.astro
│   │   │   ├── ListCardGrid.astro
│   │   │   ├── ListCardGridItem.astro
│   │   │   ├── ListFind.astro
│   │   │   ├── ListForm.astro
│   │   │   └── ListListGrid.astro
│   │   ├── set/
│   │   │   ├── PopularSets.astro
│   │   │   └── SetGrid.astro
│   │   ├── login/
│   │   │   └── login.astro
│   │   └── LanguageSelector.astro
│   ├── config.js
│   ├── constants/
│   │   ├── languages.ts
│   │   └── variants.ts
│   ├── handlers/
│   │   ├── db/
│   │   │   ├── User/
│   │   │   │   └── UserHandler.ts
│   │   │   ├── UserList/
│   │   │   │   ├── UserListHandler.ts
│   │   │   │   └── UserListCardHandler.ts
│   │   │   └── Pokemon/
│   │   │       └── PokemonHandler.ts
│   │   ├── PokeCardHandler.ts
│   │   ├── PokeCardMiniHandler.ts
│   │   ├── PokeHandler.ts
│   │   ├── PokeSetHandler.ts
│   │   └── PokeSerieHandler.ts
│   ├── layouts/
│   │   ├── Layout.astro
│   │   └── components/
│   │       ├── Footer.astro
│   │       ├── Header.astro
│   │       ├── LanguageSelector.astro
│   │       ├── Nav.astro
│   │       └── Search.astro
│   ├── middleware.js
│   ├── models/
│   │   ├── PokeCard.ts
│   │   ├── PokeCardMini.ts
│   │   ├── PokeCardList copy.ts
│   │   ├── PokeSet.ts
│   │   ├── PokeSetMini.ts
│   │   ├── PokeSerie.ts
│   │   ├── PokeSerieList.ts
│   │   ├── Pokemon.ts
│   │   ├── User.ts
│   │   ├── UserList.ts
│   │   └── UserListCard.ts
│   ├── pages/
│   │   ├── index.astro
│   │   ├── sets.astro
│   │   ├── search.astro
│   │   ├── explore.astro
│   │   ├── pokemon.astro
│   │   ├── lists.astro
│   │   ├── you.astro
│   │   ├── card.astro
│   │   ├── card/
│   │   │   └── [cardId].astro
│   │   ├── set/
│   │   │   └── [setId].astro
│   │   ├── list/
│   │   │   └── [listId].astro
│   │   ├── [setId]/
│   │   │   └── [cardId].astro
│   │   ├── api/
│   │   │   ├── sets.ts
│   │   │   ├── test.ts
│   │   │   ├── cards/
│   │   │   │   ├── list/
│   │   │   │   │   └── [listId].ts
│   │   │   │   └── set/
│   │   │   │       └── [setId].ts
│   │   │   └── list/
│   │   │       ├── add-card.ts
│   │   │       ├── add-list.ts
│   │   │       └── remove-card.ts
│   │   └── partials/
│   │       ├── CardGridPartial.astro
│   │       ├── ListCardFormPartial.astro
│   │       └── ListGridPartial.astro
│   ├── styles/
│   │   └── global.css
│   ├── utils/
│   │   └── UserListUtils.ts      # Función completeUserList
│   └── assets/
│       ├── ui/ (add.svg, delete.svg, edit.svg, filter.svg, search.svg)
│       ├── add.svg, del.svg, mod.svg
│       └── background.svg
├── auth.config.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## Historial de Versiones

| Versión | Fecha       | Cambios                                                  |
| ------- | ----------- | -------------------------------------------------------- |
| 1.0     | 17 Abr 2026 | Versión inicial                                          |
| 2.0     | 20 Abr 2026 | Añadida funcionalidad Pokédex, actualizada documentación |

---

**FIN DEL DOCUMENTO**
