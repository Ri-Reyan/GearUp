import { createServer } from "http";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";

const main = async () => {
  try {
    const server = createServer(app);

    const port = Number(process.env.PORT) || 5000;

    await prisma.$connect();
    console.log("Database connected successfully");

    server.listen(port, "0.0.0.0", () => {
      console.log(`Server is running on http://0.0.0.0:${port}`);
    });
  } catch (error) {
    await prisma.$disconnect();
    console.log("Database connection failed:", error);
    process.exit(1);
  }
};

main();
