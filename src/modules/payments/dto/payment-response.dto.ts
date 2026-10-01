import { ApiProperty } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty({ example: '1243gyunght8-454cd' })
  id: string;

  @ApiProperty({ example: 'ORDER-123' })
  orderId: string;

  @ApiProperty({ example: 99.99 })
  amount: number;

  @ApiProperty({ example: 'user-456' })
  userId: string;

  @ApiProperty({ example: 'INR' })
  currency: string;

  @ApiProperty({
    example: 'COMPLETED',
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'],
  })
  status: string;

  @ApiProperty({
    example: 'STRIPE',
    nullable: true,
  })
  paymentMethod: string | null;

  @ApiProperty({
    example: 'pi_34567890',
    nullable: true,
  })
  transactionId: string | null;

  @ApiProperty({ example: '2026-10-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-10-01T10:00:00.000Z' })
  updatedAt: Date;
}

export class PaymentApiResponseDto {
  @ApiProperty({
    example: 'pi_766666',
    description: 'Stripe client secret for payment confirmations',
  })
  clientSecret: string;

  @ApiProperty({
    example: '2165745-454-sds5s678',
    description: 'Payment ID for the created payment intent',
  })
  paymentId: string;
}

export class CreatePaymentIntentApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({
    type: PaymentApiResponseDto,
  })
  data: PaymentApiResponseDto;

  @ApiProperty({
    example: 'Payment intent created successfully',
    required: false,
  })
  message?: string;
}