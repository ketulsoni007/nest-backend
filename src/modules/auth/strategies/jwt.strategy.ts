import { PassportStrategy } from "@nestjs/passport";
import {ConfigService} from '@nestjs/config';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import {ExtractJwt,Strategy} from "passport-jwt";
import { PrismaService } from "../../../prisma/prisma.service.js";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma: PrismaService, private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') ?? "defaultsecret2026"
        })
    }

    async validate(payload: {sub:string; email:string}){
        const user = await this.prisma.user.findUnique({
            where:{id:payload.sub},
            select:{
                id:true,
                email:true,
                firstName:true,
                lastName:true,
                role:true,
                createdAt:true,
                updatedAt:true,
                password:false
            }
        });
        if(!user){
            throw new UnauthorizedException('User not found');
        }
        return user;
}
}