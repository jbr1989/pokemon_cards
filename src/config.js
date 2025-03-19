import { z } from "zod";

const envSchema = z.object({
	POKEMONTCGIO_KEY: z.string(),
});

const { success, error, data } = envSchema.safeParse(process.env);

if (!success) {
	console.error("Error en las variables de entorno", error.format());
	process.exit(1);
} else {
	console.log("Variables de entorno cargadas correctamente");
}

export const { POKEMONTCGIO_KEY } = data;
