import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UserResponseDto } from './dto/user-response.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
    constructor(private prisma:PrismaService){}

    async findOne(userId:string): Promise<UserResponseDto>{
        const user = await this.prisma.user.findUnique({
            where: { id:userId },
            select: {
                id:true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                password: false
            }
        })
        if(!user){
            throw new NotFoundException('User not found')
        }

        return user;
    }

    async findAll():Promise<UserResponseDto[]>{
        return this.prisma.user.findMany({
            select:{
                id:true,
                email:true,
                firstName:true,
                lastName:true,
                role:true,
                createdAt: true,
                updatedAt:true,
                password:false
            },
            orderBy: { createdAt: 'desc' }
        })
    }

    async update(userId:string, updateUserDto:UpdateUserDto): Promise<UserResponseDto>{
        const existingUser = await this.prisma.user.findUnique({
            where: {id:userId}
        })
        if(!existingUser){
            throw new NotFoundException('User not found');
        }
        if(updateUserDto?.email && updateUserDto.email !== existingUser?.email){
            const emailTaken = await this.prisma.user.findUnique({
                where: {email:updateUserDto.email}
            })
            if(emailTaken){
                throw new NotFoundException('Email is already taken')
            }
        }
    }
}
