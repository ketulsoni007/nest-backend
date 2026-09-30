import { IsEnum, IsOptional, IsString } from "class-validator";
import { OrderStatus } from "../../../../generated/prisma/enums.js";


export class UpdateOrderDto {
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;

    @IsOptional()
    @IsString()
    trackingNumber?:string;

    @IsOptional()
    @IsString()
    notes?: string;
}