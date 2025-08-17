import Google from '@auth/core/providers/google'
import { defineConfig } from 'auth-astro'
import { UserHandler } from './src/handlers/db/UserHandler';

export default defineConfig({
	providers: [
        Google({
            clientId: import.meta.env.AUTH_GOOGLE_ID,
            clientSecret: import.meta.env.AUTH_GOOGLE_SECRET,
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {

            //console.log(user, account, profile);

            if (account == null) return false;

            const userId = await UserHandler.getIdUser(account.provider, account.providerAccountId);
            if (userId != null) return true; // Usuario Ya existe

            // Crea un nuevo usuario si no existe
            const userCreated = await UserHandler.createUser(
                user.name, 
                user.email, 
                user.image, 
                account.provider, 
                account.providerAccountId);

            return userCreated;
           
        },

        async jwt({ token, user, account }) {

            if (user) {

                if (account != null){

                    // Incluye el ID del usuario en el token para identificarlo
                    const userId = await UserHandler.getIdUser(account.provider, account.providerAccountId);
                    token.id = userId;
                }

            }

            return token;
        },
        async session({ session, token }) {
            // Incluye el ID del usuario en la sesión
            session.user.id = token.id;
            return session;
        },
    },
})