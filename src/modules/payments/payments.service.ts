import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto.js';
import { PaymentStatus } from '../../../generated/prisma/enums.js';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto.js';
import { PaymentResponseDto } from './dto/payment-response.dto.js';
import { Prisma } from '../../../generated/prisma/client.js';

@Injectable()
export class PaymentsService {
    private stripe: Stripe;
    constructor(private prisma: PrismaService) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2026-09-30.endive'
        });
    }

    async createPaymentIntent(userId: string, createPaymentIntentDto: CreatePaymentIntentDto): Promise<{
        success: boolean;
        data: {
            clientSecret: string;
            paymentId: string;
        };
        message: string;
    }> {
        const { orderId, amount, currency = 'INR' } = createPaymentIntentDto;
        const order = await this.prisma.order.findFirst({
            where: {
                id: orderId,
                userId: userId,
            },
        });
        if (!order) {
            throw new NotFoundException(`Order with ID ${orderId} not found`);
        }

        const existingPayment = await this.prisma.payment.findFirst({
            where: {
                orderId: orderId,
            },
        })
        if (existingPayment && existingPayment.status === PaymentStatus.COMPLETED) {
            throw new BadRequestException(`Payment for order with ID ${orderId} has already been completed`);
        }
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to smallest currency unit
            currency: currency,
            metadata: { orderId: orderId, userId: userId },
        })
        const payment = await this.prisma.payment.create({
            data: {
                orderId: orderId,
                userId: userId,
                amount: amount,
                currency: currency,
                status: PaymentStatus.PENDING,
                paymentMethod: 'STRIPE',
                transactionId: paymentIntent.id,
            }
        })
        return {
            success: true,
            data: {
                clientSecret: paymentIntent.client_secret!,
                paymentId: payment.id,
            },
            message: 'Payment intent created successfully'
        }
    }

    async confirmPayment(userId: string, confirmPaymentDto: ConfirmPaymentDto): Promise<{
        success: boolean;
        data: PaymentResponseDto;
        message: string;
    }> {
        const { paymentIntentId, orderId } = confirmPaymentDto;
        const payment = await this.prisma.payment.findFirst({
            where: {
                orderId: orderId,
                userId: userId,
                transactionId: paymentIntentId,
            },
        });
        if (!payment) {
            throw new NotFoundException('Payment not found');
        }
        if (payment.status === PaymentStatus.COMPLETED) {
            throw new BadRequestException('Payment has already been completed');
        }
        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
           throw new BadRequestException('Payment not successfull');
        }
        const [updatedPayment] = await this.prisma.$transaction([
            this.prisma.payment.update({
                where: { id: payment.id },
                data: { status: PaymentStatus.COMPLETED },
            }),
            this.prisma.order.update({
                where: { id: orderId },
                data: { status: 'PROCESSING' },
            }),
        ]);
        const order = await this.prisma.order.findFirst({
            where: { id: orderId },
        })
        if(order?.cartId){
            await this.prisma.cart.update({
                where: { id: order.cartId },
                data: { checkedOut: true },
            })
        }

        return {
            success: true,
            data: this.mapToPaymentResponse(updatedPayment),
            message: 'Payment confirmed successfully'
        }
    }

    async findAll(userId: string): Promise<{
        success: boolean;
        data: PaymentResponseDto[];
        message: string;
    }> {
        const payments = await this.prisma.payment.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return {
            success: true,
            data: payments.map((payment) => this.mapToPaymentResponse(payment)),
            message: 'Payments retrieved successfully'
        };
    }

    async findOne(id: string, userId: string): Promise<{
        success: boolean;
        data: PaymentResponseDto;
        message: string;
    }> {
        const payment = await this.prisma.payment.findFirst({
            where: {
                id: id,
                userId: userId
            }
        });
        if (!payment) {
            throw new NotFoundException(`Payment with ID ${id} not found`);
        }
        return {
            success: true,
            data: this.mapToPaymentResponse(payment),
            message: 'Payment retrieved successfully'
        };
    }

    async findByOrderId(orderId: string, userId: string): Promise<{
        success: boolean;
        data: PaymentResponseDto | null;
        message: string;
    }>{
        const payment = await this.prisma.payment.findFirst({
            where: {
                orderId: orderId,
                userId: userId
            }
        });
        return {
            success: true,
            data: payment ? this.mapToPaymentResponse(payment) : null,
            message: 'Payment retrieved successfully'
        };
    }

    private mapToPaymentResponse(payment: {
        id: string;
        orderId: string;
        userId: string;
        amount: Prisma.Decimal;
        currency: string;
        status: PaymentStatus;
        paymentMethod: string | null;
        transactionId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }): PaymentResponseDto {
        return {
            id: payment.id,
            orderId: payment.orderId,
            userId: payment.userId,
            currency: payment.currency,
            amount: payment.amount.toNumber(),
            status: payment.status,
            paymentMethod: payment.paymentMethod,
            transactionId: payment.transactionId,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt
        };
    }
}