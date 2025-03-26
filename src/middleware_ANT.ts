import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(({ request, locals, redirect }) => {
	const cookies = request.headers.get("cookie") || "";
	const langCookie = cookies.match(/lang=([a-z]{2})/)?.[1];

	console.log("LANG COOKIE", langCookie);

	// Si ya hay una cookie de idioma, usarla
	if (langCookie) {
		locals.lang = langCookie;
		return;
	}

	// Detectar el idioma por el navegador
	const acceptLanguage = request.headers.get("accept-language") || "en";
	let preferredLanguage = acceptLanguage.split(",")[0].split("-")[0]; // "es-ES" -> "es"

	// Como fallback, podemos usar el país detectado por Vercel
	const country = request.headers.get("x-vercel-ip-country") || "US";
	if (!preferredLanguage && country === "ES") {
		preferredLanguage = "es";
	}

	// Guardar el idioma en `locals` para usarlo en la app
	locals.lang = preferredLanguage;

	// Configurar la cookie para recordar la preferencia del usuario
	const response = redirect();
	response.headers.set(
		"Set-Cookie",
		`lang=${preferredLanguage}; Path=/; Max-Age=31536000; SameSite=Lax`,
	);

	return response;
});
