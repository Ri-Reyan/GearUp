import { prisma } from "../lib/prisma.js";

const searchGearFromDb = async (search: string) => {
  return await prisma.gearInventory.findMany({
    where: {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          brand: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },

    include: {
      categories: {
        include: {
          categories: true,
        },
      },
    },
  });
};

const filterGearFromDb = async (category: string) => {
  return await prisma.gearInventory.findMany({
    where: {
      categories: {
        some: {
          categories: {
            tags: category,
          },
        },
      },
    },

    include: {
      categories: {
        include: {
          categories: true,
        },
      },
    },
  });
};

export const publicService = {
  searchGearFromDb,
  filterGearFromDb,
};
