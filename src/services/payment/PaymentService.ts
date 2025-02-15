import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './schemas/payment.schema';
import { StripeService } from '../shared/stripe.service';

@Injectable()
export class PaymentService {
  private readonly timestamp = '2025-02-15 07:48:34';
  private readonly currentUser = 'vilohitan';

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    private stripeService: StripeService
  ) {}

  async createSubscription(userId: string, planId: string): Promise<Subscription> {
    const customer = await this.stripeService.createCustomer(userId);
    const subscription = await this.stripeService.createSubscription(
      customer.id,
      planId
    );

    return this.paymentModel.create({
      userId,
      subscriptionId: subscription.id,
      planId,
      status: subscription.status,
      createdAt: this.timestamp,
      createdBy: this.currentUser
    });
  }
}