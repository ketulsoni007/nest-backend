import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../../../../generated/prisma/enums.js";

export class AuthResponseDto {
    @ApiProperty({
        description:'Access token for authentication',
        example: 'ec6c08e634b04700256842b7b42b95744041cfdd69de3114ccb8351c2a52dcc5d01b3a3c1b680436bd281e52837bb6bd3c7140f9e6e0106848be8e5a3da85e42'
    })
    accessToken: string;

    @ApiProperty({
        description:'Refresh token for obtaining new access token',
        example: '7156901d83c577260166ecbd2708cae3eadbfec1c2bd016444daa00f9695b6f7e0127a101b403c7029f22038476321385b0fa49dbb8a1f31c2397f537619bc1d'
    })
    refreshToken: string;

    @ApiProperty({
        description:'Authenticated user information',
        example: {
            id: 'user-123',
            email:'<EMAIL>',
            firstName: 'John',
            lastName: 'Doe',
            role: 'USER'
        }
    })
    user: {
        id:string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: Role
    }
}