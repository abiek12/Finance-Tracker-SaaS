import app from "./app";
import { connectDB } from "./config/db.config";
import logger from "./utils/logger.utils";

const PORT = process.env.PORT || 4006;

const start = async () => {
   try {
        app.listen(PORT, async () => {
            logger.info(`Server is running on port ${PORT}`);
        });
        // Connect to database
        await connectDB();
   } catch (error) {
        logger.error("Server startup failed!", error);
        process.exit(1);
   }
}

start();