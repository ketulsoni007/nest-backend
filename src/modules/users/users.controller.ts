import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guard/jwt-auth-guard.js';
import { RolesGuard } from '../../common/guard/roles.guard.js';
import { UsersService } from './users.service.js';
import { UserResponseDto } from './dto/user-response.dto.js';
import type { RequestWithUser } from '../../common/interfaces/request-with-user.interface.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../../generated/prisma/enums.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { GetUser } from '../../common/decorators/get-user.decorator.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';

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

    //Change current user password
    @Patch('me/password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary:'Change current user password' })
    @ApiResponse({ status:401,description:'Password changes succesfully' })
    async changePassword(
        @GetUser('id') userId:string,
        @Body() changePasswordDto: ChangePasswordDto, 
    ): Promise<{message:string}>{
        return await this.userService.changePassword(userId, changePasswordDto)
    }

    @Delete('me')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary:'Delete current user account' })
    @ApiResponse({status:200, description:"user account deleted successfully"})
    @ApiResponse({status:401, description:'Unauthorized'})
    async deleteAccount(@GetUser('id') userId:string): Promise<{message:string}>{
        return await this.userService.remove(userId)
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status:200,
        description: 'User with the specific ID deleted successfully'
    })
    @ApiResponse({
        status:401,
        description: 'Unauthorized'  
    })
    async deleteUser(@Param('id') id:string):Promise<{message:string}>{
        return await this.userService.remove(id);
    }
}
