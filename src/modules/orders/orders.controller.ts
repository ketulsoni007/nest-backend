import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiTooManyRequestsResponse, getSchemaPath } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guard/jwt-auth-guard.js';
import { RolesGuard } from '../../common/guard/roles.guard.js';
import { OrdersService } from './orders.service.js';
import { ModerateThrottle, RelaxedThrottle } from '../../common/decorators/custom-throttler.decorator.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { GetUser } from '../../common/decorators/get-user.decorator.js';
import { OrderApiResponseDto, OrderResponseDto, PaginatedOrderResponseDto } from './dto/order-response.dto.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../../generated/prisma/enums.js';
import { QueryOrderDto } from './dto/query-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';

@ApiTags('orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
    constructor(private readonly orderService: OrdersService){}

    @Post()
    @ModerateThrottle()
    @ApiOperation({
        summary: "Create a new order"
    })
    @ApiBody({
        type: CreateOrderDto
    })
    @ApiCreatedResponse({
        description: "Order created successfully",
        type: OrderApiResponseDto
    })
    @ApiBadRequestResponse({
        description: "Invalid data or insufficient stock"
    })
    @ApiNotFoundResponse({
        description: "Cart not found or empty"
    })
    @ApiTooManyRequestsResponse({
        description: "Too many requests - rate limit exceeded"
    })
    async create(
        @Body() createOrderDto: CreateOrderDto, 
        @GetUser('id') userId: string
    ){
        return await this.orderService.create(userId, createOrderDto)
    }

    @Get('admin/all')
    @Roles(Role.ADMIN)
    @RelaxedThrottle()
    @ApiOperation({
        summary: "[ADMIN] Get all orders (paginated)"
    })
    @ApiQuery({
        name:'status',
        required:false,
        type: String
    })
    @ApiQuery({
        name:'page',
        required:false,
        type: Number
    })
    @ApiQuery({
        name:'limit',
        required:false,
        type: Number
    })
    @ApiResponse({
        description: 'List of orders',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { $ref:getSchemaPath(OrderResponseDto) }
                },
                total: { type:"number" },
                page: { type:"number" },
                limit: { type:"number" },
            }
        }
    })
    @ApiForbiddenResponse({
        description: 'Admin access required'
    })
    async findAllForAdmin(@Query() query:QueryOrderDto){
        return await this.orderService.findAllForAdmin(query)
    }

    @Get()
    @RelaxedThrottle()
    @ApiOperation({
        summary: 'Get all orders for current user (paginated)'
    })
    @ApiQuery({
        name: 'status',
        required: false,
        type: String
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number
    })
    @ApiOkResponse({
        description: "List of user orders",
        type: PaginatedOrderResponseDto
    })
    async findAll(@Query() query: QueryOrderDto, @GetUser('id') userId: string){
        return await this.orderService.findAll(userId, query)
    }

    @Get('admin/:id')
    @Roles(Role.ADMIN)
    @RelaxedThrottle()
    @ApiOperation({
        summary : "[ADMIN]: Get order by id"
    })
    @ApiParam({
        name: 'id',
        description: 'Order ID'
    })
    @ApiOkResponse({
        description: 'Order details',
        type: OrderApiResponseDto
    })
    @ApiNotFoundResponse({
        description: "Order not found"
    })
    @ApiForbiddenResponse({
        description: "Admin access required"
    })
    async findOneAdmin(@Param('id') id:string){
        return await this.orderService.findOne(id);
    }

    @Get(':id')
    @RelaxedThrottle()
    @ApiOperation({
        summary: 'Get an order by ID for current user'
    })
    @ApiParam({
        name: 'id',
        description: 'Order ID'
    })
    @ApiOkResponse({
        description: 'Order details',
        type: OrderApiResponseDto
    })
    @ApiNotFoundResponse({
        description: 'Order not found'
    })
    async findOne(@Param('id') id:string, @GetUser('id') userId:string){
        return await this.orderService.findOne(id, userId)
    }

    @Patch('admin/:id')
    @Roles(Role.ADMIN)
    @ModerateThrottle()
    @ApiOperation({
        summary: "[ADMIN] Update any order"
    })
    @ApiParam({
        name: 'id',
        description:"Order ID"
    })
    @ApiBody({
        type: UpdateOrderDto
    })
    @ApiOkResponse({
        description: 'Order updated successfully',
        type: OrderApiResponseDto
    })
    @ApiNotFoundResponse({
        description: 'Order not found'
    })
    @ApiForbiddenResponse({
        description: 'Admin access required'
    })
    async updateAdmin(@Param('id') id:string, @Body() dto: UpdateOrderDto){
        return await this.orderService.update(id, dto)
    }
}
