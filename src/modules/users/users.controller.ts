import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guard/jwt-auth-guard.js';
import { RolesGuard } from '../../common/guard/roles.guard.js';
import { UsersService } from './users.service.js';
import { UserResponseDto } from './dto/user-response.dto.js';
import type { RequestWithUser } from '../../common/interfaces/request-with-user.interface.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../../generated/prisma/enums.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('users')

export class UsersController {
    constructor(private readonly userService:UsersService){}

    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({
        status:200,
        description: 'The current user profile',
        type: UserResponseDto
    })
    @ApiResponse({
        status:401,
        description: 'Unauthorized'
    })
    async getProfile(@Req() req:RequestWithUser): Promise<UserResponseDto>{
        return await this.userService.findOne(req.user.id)
    }

    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({
        status:200,
        description: 'List of all users',
        type: [UserResponseDto]
    })
    @ApiResponse({
        status:401,
        description: 'Unauthorized'
    })
    async findAll(): Promise<UserResponseDto[]>{
        return await this.userService.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary:'Get user by ID' })
    @ApiResponse({
        status:200,
        description: 'The user with the specific ID',
        type: UserResponseDto
    })
    @ApiResponse({ status:401, description:'Unauthorized' })
    @ApiResponse({ status:404, description: 'User not found' })
    async findOne(@Param('id') id:string): Promise<UserResponseDto> {
        return await this.userService.findOne(id);
    }

    @Patch('me')
    @ApiOperation({ summary: 'Update current user profile' })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({
        status:200,
        description: 'The update user profile',
        type: UserResponseDto
    })
    @ApiResponse({
        status:409,
        description: 'Email already in use'
    })
    async updateProfile(
        userId:string,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<UserResponseDto>{
        return await this.userService.update(userId,updateUserDto)
    }

}
