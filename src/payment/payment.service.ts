import Stripe from "stripe";
import { PaymentStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27" as any,
});

const createPaymentIntentInDb = async (rentalOrderId: string) => {
  const order = await prisma.rentalOrder.findUniqueOrThrow({
    where: { id: rentalOrderId },
  });

  const amountInCents = Math.round(Number(order.total_price) * 100);

  // স্ট্রাইপ ইনটেন্ট তৈরি
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    payment_method_types: ["card"],
    metadata: { rentalOrderId: order.id },
  });

  // ডাটাবেসে পেন্ডিং পেমেন্ট রেকর্ড
  const paymentRecord = await prisma.payments.create({
    data: {
      rentalOrderId: order.id,
      amount: order.total_price,
      transactionId: paymentIntent.id,
      method: "Stripe",
      status: PaymentStatus.PENDING,
    },
  });

  return {
    paymentRecord,
    clientSecret: paymentIntent.client_secret,
  };
};

const confirmPaymentInDb = async (transactionId: string) => {
  // পোস্টম্যান ফ্রেন্ডলি টেস্টিংয়ের জন্য আমরা সরাসরি ডাটাবেস ট্রানজেকশনে স্ট্যাটাস আপডেট করছি
  return await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payments.update({
      where: { transactionId },
      data: {
        status: PaymentStatus.COMPLETED,
        paidAt: new Date(),
      },
    });

    await tx.rentalOrder.update({
      where: { id: updatedPayment.rentalOrderId },
      data: {
        status: "CONFIRMED",
      },
    });

    return updatedPayment;
  });
};

const getPaymentHistoryFromDb = async (userId: string) => {
  return await prisma.payments.findMany({
    where: {
      rentalOrder: {
        userId: userId,
      },
    },
    include: {
      rentalOrder: true,
    },
  });
};

const getPaymentDetailsFromDb = async (id: string) => {
  return await prisma.payments.findUniqueOrThrow({
    where: { id },
    include: {
      rentalOrder: true,
    },
  });
};

export const paymentService = {
  createPaymentIntentInDb,
  confirmPaymentInDb,
  getPaymentHistoryFromDb,
  getPaymentDetailsFromDb,
};
