import { prisma } from "../lib/prisma.js";
import { OrderStatus } from "@prisma/client";
import { IAddGearType, IUpdateType } from "./provider.interace.js";

const addCategoryIntoDb = async (tag: string) => {
  const newCategory = await prisma.categories.create({
    data: {
      tags: tag.toLowerCase().trim(),
    },
  });

  return newCategory;
};

const addGearIntoDb = async (ownerId: string, payload: IAddGearType) => {
  let categoryId;

  if (!categoryId) {
    const category = await prisma.categories.findUnique({
      where: {
        tags: payload.tag.toLowerCase().trim(),
      },
    });

    if (category) {
      categoryId = category.id;
    } else {
      const category = await addCategoryIntoDb(payload.tag);
      categoryId = category?.id;
    }
  }

  const { name, description, price, brand } = payload;

  const newGear = await prisma.gearInventory.create({
    data: {
      name,
      description,
      price,
      brand,
      ownerId,
      categories: categoryId
        ? {
            create: {
              categoryId: categoryId,
            },
          }
        : undefined,
    },
    include: {
      categories: {
        include: {
          categories: true,
        },
      },
    },
  });

  return newGear;
};

const updateGearIntoDb = async (
  ownerId: string,
  gearId: string,
  payload: Partial<IUpdateType>,
) => {
  const gear = await prisma.gearInventory.findUniqueOrThrow({
    where: { id: gearId },
  });

  if (gear.ownerId !== ownerId) {
    throw new Error("You are not allowed to update this gear");
  }

  const { tag, ...restOfPayload } = payload;
  let categoryId: string | undefined;

  if (tag) {
    const formattedTag = tag.toLowerCase().trim();

    let category = await prisma.categories.findUnique({
      where: { tags: formattedTag },
    });

    if (category) {
      categoryId = category.id;
    } else {
      category = await prisma.categories.create({
        data: { tags: formattedTag },
      });
      categoryId = category.id;
    }
  }

  const updatedGear = await prisma.gearInventory.update({
    where: { id: gearId },
    data: {
      ...restOfPayload,
      categories:
        tag && categoryId
          ? {
              deleteMany: {},
              create: {
                categoryId: categoryId,
              },
            }
          : undefined,
    },
    include: {
      categories: {
        include: {
          categories: true,
        },
      },
    },
  });

  return updatedGear;
};

const getOrdersFromDb = async (ownerId: string) => {
  const orders = await prisma.rentalOrder.findMany({
    where: {
      gear: {
        ownerId,
      },
    },
    include: {
      gear: true,
      user: true,
    },
  });

  return orders;
};

const updateOrderStatusIntoDb = async (ownerId: string, orderId: string) => {
  const order = await prisma.rentalOrder.findUniqueOrThrow({
    where: {
      id: orderId,
      gear: {
        ownerId,
      },
    },
  });

  const updatedOrder = await prisma.rentalOrder.update({
    where: {
      id: orderId,
    },
    data: {
      status: OrderStatus.CONFIRMED,
    },
  });

  return updatedOrder;
};

export const providerService = {
  addGearIntoDb,
  updateGearIntoDb,
  getOrdersFromDb,
  updateOrderStatusIntoDb,
};
