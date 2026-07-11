import { OrderStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

const createReviewIntoDb = async (
  userId: string,
  payload: { gearId: string; rating: number; comment: string },
) => {
  const { gearId, rating, comment } = payload;

  const completedOrder = await prisma.rentalOrder.findFirst({
    where: {
      userId,
      gearId,
      status: OrderStatus.RETURNED,
    },
  });

  if (!completedOrder) {
    throw new Error(
      "You can only review gear that you have rented and returned successfully.",
    );
  }

  return await prisma.reviews.create({
    data: {
      userId,
      gearId,
      rating,
      comment,
    },
  });
};

export const reviewService = { createReviewIntoDb };
