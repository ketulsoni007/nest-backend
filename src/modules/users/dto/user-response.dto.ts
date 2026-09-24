import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../../../../generated/prisma/enums.js";

export class UserResponseDto {
    @ApiProperty({
        description:'User ID',
        example: 'user-id123'
    })
    id: string;

    @ApiProperty({
        description:'User email address',
        example:'john.doe@email.com'
    })
    email:string;

    @ApiProperty({
        description:'User first name',
        example: 'John',
        nullable:true
    })
    firstName:string | null;

    @ApiProperty({
        description:'User last name',
        example: 'Doe',
        nullable:true
    })
    lastName:string | null;

    @ApiProperty({
        description:'User role',
        enum:Role
    })
    role:Role;

    @ApiProperty({
        description:'Account creation date',
        example: '2026-10-01T12:34:56.789Z'
    })
    createdAt: Date;

    @ApiProperty({
        description:'Last account update date',
        example: '2026-10-01T12:50:24.789Z'
    })
    updatedAt: Date;

}