import { createServer } from "http";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";

const main = async () => {
  try {
    const server = createServer(app);

    const port = process.env.PORT || 5000;

    await prisma.$connect();
    console.log("Database connected successfully");

    server.listen(port, () => {
      console.log(`Server is runnig on http://localhost:${port}`);
    });
  } catch (error) {
    await prisma.$disconnect();
    console.log("Database connection failed:", error);
    process.exit(1);
  }
};

main();
