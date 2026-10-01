import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guard/jwt-auth-guard.js';
import { PaymentsService } from './payments.service.js';
import { CreatePaymentIntentApiResponseDto, PaymentApiResponseDto } from './dto/payment-response.dto.js';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto.js';
import { GetUser } from '../../common/decorators/get-user.decorator.js';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto.js';

@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiTags('Payments')
@ApiBearerAuth('JWT-auth')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Post("create-intent")
    @ApiOperation({
        summary: "create payment intent",
        description: "create payment intent for an order"
    })
    @ApiCreatedResponse({
        description: "Payment intent created successfully",
        type: CreatePaymentIntentApiResponseDto
    })
    @ApiBadRequestResponse({
        description: "Invalid data or order not found"
    })
    async createPaymentIntent(@Body() createPaymentIntentDto: CreatePaymentIntentDto, @GetUser('id') userId: string) {
        return await this.paymentsService.createPaymentIntent(userId,createPaymentIntentDto);
    }

    @Post('confirm')
    @ApiOperation({
        summary: "confirm payment intent",
        description: "confirm payment intent for an order"
    })
    @ApiResponse({
        status:200,
        description: "Payment confirmed successfully",
        type: PaymentApiResponseDto
    })
    @ApiBadRequestResponse({
        description: "Payment not found or already completed"
    })
    async confirmPayment(@Body() confirmPaymentIntentDto: ConfirmPaymentDto, @GetUser('id') userId: string) {
        return await this.paymentsService.confirmPayment(userId,confirmPaymentIntentDto);
    }

    @Get()
    @ApiOperation({
        summary: "Get all payments",
        description: "Get all payments for the current user"
    })
    @ApiOkResponse({
        description: "Payments retrieved successfully",
        type: PaymentApiResponseDto
    })
    async findAll(@GetUser('id') userId: string) {
        return await this.paymentsService.findAll(userId);
    }

    @Get(':id')
    @ApiParam({
        name:'id',
        description:'Payment ID',
        example:'165468df-4d5f-4d5f-8d5f-4d5f4d5f4d5f'
    })
    @ApiOperation({
        summary: "Get payment by ID",
        description: "Get a specific payment by its ID"
    })
    @ApiOkResponse({
        description: "Payments retrieved successfully",
        type: PaymentApiResponseDto
    })
    @ApiNotFoundResponse({
        description: "Payment not found"
    })
    async findOne(@Param('id') id: string, @GetUser('id') userId: string) {
        return await this.paymentsService.findOne(id, userId);
    }

    @Get('order/:orderId')
    @ApiParam({
        name:'orderId',
        description:'Order ID',
        example: 'order-123'
    })
    @ApiOperation({
        summary: "Get payment by Order ID",
        description: "Get a specific payment by its associated Order ID"
    })
    @ApiOkResponse({
        description: "Payment retrieved successfully",
        type: PaymentApiResponseDto
    })
    @ApiNotFoundResponse({
        description: "Payment not found"
    })
    async findByOrderId(@Param('orderId') orderId: string, @GetUser('id') userId: string) {
        return await this.paymentsService.findByOrderId(orderId, userId);
    }
}
