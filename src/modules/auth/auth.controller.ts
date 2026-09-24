import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { AuthResponseDto } from './dto/auth-response-dto.js';
import { RefreshTokenGuard } from './guards/refresh-token.guard.js';
import { GetUser } from '../../common/decorators/get-user.decorator.js';
import { JwtAuthGuard } from '../../common/guard/jwt-auth-guard.js';
import { LoginDto } from './dto/login-dto.js';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @HttpCode(201)
    @ApiOperation({summary: 'Register a new user',description:'Creates a new user account'})
    @ApiResponse({
        status:201,
        description:'User successfully registered',
        type:AuthResponseDto
    })
    @ApiResponse({
        status:400,
        description:'Bad Request. Validation failed or user already exists'
    })
    @ApiResponse({
        status:500,
        description: 'Internal Server Error'
    })
    @ApiResponse({
        status:429,
        description: 'Too Many Requests. Rate limit exceeded'
    })
    async register(@Body() registerDto: RegisterDto) : Promise<AuthResponseDto>{
        return this.authService.register(registerDto)
    }
    
    @Post('refresh')
    @ApiBearerAuth('JWT-refresh')
    @ApiOperation({summary: 'Refresh access token',description:'Generates new access token using a valid refresh token'})
    @ApiResponse({
        status:200,
        description:'New refresh token generated successfully',
        type:AuthResponseDto
    })
    @ApiResponse({
        status:401,
        description:'Unauthorized. Invalid or expired refresh token'
    })
    @ApiResponse({
        status:429,
        description: 'Too Many Requests. Rate limit exceeded'
    })
    @HttpCode(HttpStatus.OK)
    @UseGuards(RefreshTokenGuard)
    async refresh(@GetUser('id') userId:string):Promise<AuthResponseDto>{
        return await this.authService.refreshTokens(userId)
    }

    @Post('logout')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({summary: 'Logout User',description:'Logout a user and invalidates the refresh token'})
    @ApiResponse({
        status:200,
        description:'User successfully logged out'
    })
    @ApiResponse({
        status:401,
        description:'Unauthorized. Invalid or expired refresh token'
    })
    @ApiResponse({
        status:429,
        description: 'Too Many Requests. Rate limit exceeded'
    })
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async logout(@GetUser('id') userId:string): Promise<{message:string}>{
        await this.authService.logout(userId);
        return {message:'Successfully logged out'}
    }


    @Post('login')
    @ApiOperation({summary: 'User Login',description:'Authenticates a user and return access and refresh tokens'})
    @ApiResponse({
        status:200,
        description:'User successfully logged in',
        type: AuthResponseDto
    })
    @ApiResponse({
        status:401,
        description:'Unauthorized. Invalid credentials'
    })
    @ApiResponse({
        status:429,
        description: 'Too Many Requests. Rate limit exceeded'
    })
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto>{
        return this.authService.login(loginDto)
    }
}
