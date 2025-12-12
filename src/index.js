import "dotenv/config";
import { app } from "./app.js";
import { prisma } from "./prismaClient.js";


const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to database
    await prisma.$connect();
    console.log("Database connected successfully");

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit if DB connection fails
  }
};

// Start the server
startServer();