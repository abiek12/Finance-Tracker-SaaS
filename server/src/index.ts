import app from "./app";

const PORT = process.env.PORT || 4006;

const start = async () => {
   try {
    app.listen(PORT, async () => {
        console.log(`Server is running on port ${PORT}`);
    });

    // Connect to database
    
   } catch (error) {
        console.log(error);
        process.exit(1);
   }
}

start();