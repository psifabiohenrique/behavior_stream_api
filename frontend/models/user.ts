import { RoleChoices } from "././roleChoices";

export class User {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
    is_active?: boolean;

    constructor(data?: any) {
        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.email = data.email;
            this.role = data.role;
            this.is_active = data.is_active;
        }
    }
}