export const onRequest = async (context, next) => {
	// console.log("MIDDLEWARE");

	//const html = await response.text();
	//const redactedHtml = html.replaceAll("PRIVATE INFO", "REDACTED");

	const cookies = context.request.headers.get("cookie") || "";
	const langCookie = cookies.match(/lang=([a-z]{2})/)?.[1];
	// console.log("LANG COOKIE", langCookie);

	let preferredLanguage = "en";

	// Si ya hay una cookie de idioma, usarla
	if (langCookie) {
		context.locals.lang = langCookie;
	} else {
		// Detectar el idioma por el navegador
		const acceptLanguage =
			context.request.headers.get("accept-language") || "en";
		preferredLanguage = acceptLanguage.split(",")[0].split("-")[0]; // "es-ES" -> "es"

		// console.log("PREFERRED LANGUAGE", preferredLanguage);

		// Como fallback, podemos usar el país detectado por Vercel
		const country = context.request.headers.get("x-vercel-ip-country") || "US";

		context.locals.lang = preferredLanguage;
	}

	// console.log("LOCALs LANG", context.locals.lang);

	const response = await next();

	if (!langCookie && preferredLanguage) {
		response.headers.set(
			"Set-Cookie",
			`lang=${preferredLanguage}; Path=/; Max-Age=31536000; SameSite=Lax`,
		);
	}

	return response;
};
