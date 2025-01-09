export class PokeCardMini {
    id: string;
    localId: string;
    name: string;
    image: string | null;

    constructor(id: string, localId: string, name: string, image: string | undefined) {
        this.id = id;
        this.localId = localId;
        this.name = name;
        this.image = (image || null);
    }
    
}