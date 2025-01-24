import { TursoAdapter } from "../../adapters/TursoAdapter";
import type { User } from "../../models/User";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class UserHandler {

    static async getIdUser(provider: string, providerAccountId: string): Promise<number | null> {

        // FIND USER in DB
        const userId = await TursoAdapter.getIdUser(provider, providerAccountId);
        if (userId!=null) return userId;

        return null;
    }

    static async createUser(name: string, email: string, image: string | undefined, provider: string | undefined, providerAccountId: string | undefined): Promise<boolean> {
        // CREATE USER in DB

        const createdUser = await TursoAdapter.createUser(name, email, image, provider, providerAccountId);
        return createdUser;
    }

}