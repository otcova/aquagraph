import Box2D from "box2dweb";

export type ContactType = "screen" | "box" | "coin" | "lake" | "player" | "frameBox";

export class UserData {
    beginContactType?: (type: ContactType) => void;
    endContactType?: (type: ContactType) => void;

    contactCount = new Map<ContactType, number>();

    constructor(public type: ContactType, listeners: {
        beginContactType?: (type: ContactType) => void,
        endContactType?: (type: ContactType) => void,
    } = {}) {
        this.beginContactType = listeners.beginContactType;
        this.endContactType = listeners.endContactType;
    }
}

export class ContactListener extends Box2D.Dynamics.b2ContactListener {
    constructor() {
        super();
    }

    public BeginContact(contact: Box2D.Dynamics.Contacts.b2Contact): void {
        const dataA = contact.GetFixtureA().GetBody().GetUserData() as UserData | undefined;
        const dataB = contact.GetFixtureB().GetBody().GetUserData() as UserData | undefined;

        if (dataA && dataB) {
            this.addContact(dataA, dataB);
            this.addContact(dataB, dataA);
        }
    }

    public EndContact(contact: Box2D.Dynamics.Contacts.b2Contact): void {
        const dataA = contact.GetFixtureA().GetBody().GetUserData() as UserData | undefined;
        const dataB = contact.GetFixtureB().GetBody().GetUserData() as UserData | undefined;

        if (dataA && dataB) {
            this.removeContact(dataA, dataB);
            this.removeContact(dataB, dataA);
        }
    }
    
    private addContact(user: UserData, other: UserData) {
        const count = user.contactCount.get(other.type) ?? 0;
        user.contactCount.set(other.type, count + 1);

        if (count == 0) {
            user.beginContactType?.(other.type);
        }
    }

    private removeContact(user: UserData, other: UserData) {
        const count = (user.contactCount.get(other.type) || 1) - 1;
        user.contactCount.set(other.type, count);

        if (count == 0) {
            user.endContactType?.(other.type);
        }
    }
}

