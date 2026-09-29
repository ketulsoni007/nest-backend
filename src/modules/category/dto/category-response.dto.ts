import { ApiProperty } from "@nestjs/swagger";

export class CategoryResponseDto {
    @ApiProperty({
        example: 'CAT-123',
        description: 'The unique identifier of the category'
    })
    id: string

    @ApiProperty({
        example: 'Electronics',
        description: 'The name of the category'
    })
    name: string

    @ApiProperty({
        example: 'Device and gadgets including phones, laptops, and accessories',
        description: 'A brief description of the category',
        nullable: true
    })
    description: string | null

    @ApiProperty({
        example: 'electronics',
        description: 'The URL-friendly slug for the category',
        nullable: false
    })
    slug?: string

    @ApiProperty({
        example: 'https://example.com/images/electronics.png',
        description: 'URL of the category image',
        nullable: true
    })
    imageUrl: string | null;

    @ApiProperty({
        example: true,
        description: 'Indicates if the category is active',
        required: false
    })
    isActive?: boolean;

    @ApiProperty({
        example: 150,
        description: 'Number of products in this category'
    })
    productCount: number;

    @ApiProperty({
        description:'The date and time when the category was created',
        example: '2026-10-01T12:34:56.789Z'
    })
    createdAt: Date;

    @ApiProperty({
        description:'The date and time when the category last updated',
        example: '2026-10-01T12:50:24.789Z'
    })
    updatedAt: Date;
}