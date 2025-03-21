export class PokeCardMini {
	id: string;
	localId: string;
	name: string;
	image: {
		low: string | null;
		high: string | null;
	};

	constructor(
		id: string,
		localId: string,
		name: string,
		image: {
			low: string | undefined;
			high: string | undefined;
		},
	) {
		this.id = id;
		this.localId = localId;
		this.name = name;
		this.image = {
			low: image.low || null,
			high: image.high || null,
		};
	}
}
