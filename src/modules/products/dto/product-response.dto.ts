import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class ProductResponseDto {
    @ApiProperty({
        description:'Product ID',
        example: '6dfhujgfr7-9ofcffhjgh'
    })
    id:string;

    @ApiProperty({
        description: 'Product name',
        example: 'Wireless Headphones'
    })
    name: string;

    @ApiProperty({
        description: 'Product description',
        example: 'High-quality wireless headphones with noise cancellations'
    })
    description: string | null;

    @ApiProperty({
        description: "Product price",
        example: 99.99
    })
    price: number;

    @ApiProperty({
        description: 'Product stock',
        example: 100
    })
    stock: number;

    @ApiProperty({
        description: 'Stock keeping Unit (Sku) - Unique identifier',
        example: 'WH-001'
    })
    sku: string;

    @ApiProperty({
        description: "Product image url",
        example: "https://example.com/image.jpg"
    })
    imageUrl: string | null;

    @ApiProperty({
        description: 'Product category',
        example: 'Electronics'
    })
    category: string | null;

    @ApiProperty({
        description: "Whether product is active and available for purchase",
        example: true
    })
    isActive: boolean

    @ApiProperty({
        description:'The date and time when the product was created',
        example: '2026-10-01T12:34:56.789Z'
    })
    createdAt: Date;

    @ApiProperty({
        description:'The date and time when the product last updated',
        example: '2026-10-01T12:50:24.789Z'
    })
    updatedAt: Date;
}