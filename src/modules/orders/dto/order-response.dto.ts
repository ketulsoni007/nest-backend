import { ApiProperty } from "@nestjs/swagger";

export class OrderApiResponseDto<T>{
    @ApiProperty({
        description: 'Indicates if the request was successfull'
    })
    success: boolean;

    @ApiProperty({
        description: "Returned data",
        type: Object
    })
    data: T;

    @ApiProperty({
        description: 'Optional message',
        nullable: true,
        required: false
    })
    message: string;
}

export class OrderItemResponseDto {
    @ApiProperty()
    id:string;

    @ApiProperty()
    productId: string;

    @ApiProperty()
    productName: string;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    price: number;

    @ApiProperty()
    subtotal: number;

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
export class OrderResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    status:string;

    @ApiProperty()
    total:number;

    @ApiProperty()
    shippingAddress: string;

    @ApiProperty({
        type: [OrderItemResponseDto]
    })
    items: OrderItemResponseDto[]

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

export class PaginatedOrderResponseDto {
    @ApiProperty({
        type: [OrderResponseDto]
    })
    data : OrderResponseDto[]

    @ApiProperty()
    total: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    limit: number;

}