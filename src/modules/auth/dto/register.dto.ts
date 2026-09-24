import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsOptional  } from "class-validator";

export class RegisterDto {
    @ApiProperty({
        description:'User email address',
        example: 'john.doe@example.com'
    })
    @IsEmail({},{message:'Please provide a valid email address'})
    @IsNotEmpty({message:'Email is required'})
    email: string;

    @ApiProperty({
        description:'User password',
        example: 'StrongP@ssw0rd!'
    })
    @IsString()
    @IsNotEmpty({message:'Password is required'})
    @MinLength(8,{message : 'Password must be atleast 8 characters long'})
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'}) 
    password: string;

    @ApiProperty({
        description:'User First Name',
        example: 'John',
        required:false
    })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({
        description:'User Last Name',
        example: 'Doe',
        required:false
    })
    @IsOptional()
    @IsString()
    lastName?: string;
}