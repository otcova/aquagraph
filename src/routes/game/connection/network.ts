import Peer, { DataConnection } from "peerjs";

export class NetworkDataChannel {
	messageQueue: any[] = [];
	promiseReceivers: { resolve: (msg: any) => void, reject: (e: any) => void }[] = [];
	handles: ((msg: any) => void)[] = [];

	constructor(protected connection: DataConnection) {
		connection.on("data", this.handleMessage.bind(this));
	}

	private handleMessage(msg: any) {
		this.messageQueue.push(msg);
		this.distributeMessage();
	}

	private distributeMessage() {
		if (this.messageQueue.length > 0) {
			const handle = this.promiseReceivers.shift();
			if (handle) handle.resolve(this.messageQueue.shift());
			if (this.handles.length > 0) {
				for (const message of this.messageQueue) {
					for (const handle of this.handles) handle(message);
				}
				this.messageQueue = [];
			}
		}
	}

	/// Intercepts the next message
	nextMessage(): Promise<any> {
		const handle = new Promise((resolve, reject) => {
			this.promiseReceivers.push({ resolve, reject });
		});
		this.distributeMessage();
		return handle;
	}

	handleMessages(handle: (msg: any) => void) {
		this.handles.push(handle);
		this.distributeMessage();
	}
	
	send(message: any) {
		this.connection.send(message);
	}

	destroy() {
		this.connection.close();
	}
}

export class NetworkHost {
	handleGuest?: ((guest: NetworkDataChannel) => void);

	private constructor(private peer: Peer) {
		peer.on("connection", (connection) => {
			if (this.handleGuest) this.handleGuest(new NetworkDataChannel(connection));
			else throw Error("Missing guest handle");
		});
	}

	static createParty(): Promise<NetworkHost> {
		const peer = new Peer();
		return new Promise((resolve, error) => {
			peer.on("open", () => resolve(new NetworkHost(peer)));
			peer.on("error", (...args) => error(args));
		});
	}

	getPartyId(): string {
		return this.peer.id;
	}

	destroy() {
		this.peer.destroy();
	}
}


export class NetworkGuest extends NetworkDataChannel {

	private constructor(private peer: Peer, connection: DataConnection) {
		super(connection);
	}

	static joinParty(partyId: string): Promise<NetworkGuest> {
		const peer = new Peer();
		return new Promise((resolve, reject) => {
			peer.on("open", () => {
				const conn = peer.connect(partyId);
				const net = new NetworkGuest(peer, conn);
				conn.on("open", () => resolve(net));
				conn.on("error", (...args) => reject(args));
			});
			peer.on("error", (...args) => reject(args));
		});
	}

	destroy() {
		this.connection.close();
		this.peer.destroy();
	}
}


