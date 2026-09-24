import { Role } from "../../../generated/prisma/enums.js";

export class CommonUserDto {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: Role;
    password:any
}