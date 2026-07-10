import { prisma } from "../lib/prisma.js";
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

export const providerService = {
  addGearIntoDb,
  // updateGearIntoDb,
};
