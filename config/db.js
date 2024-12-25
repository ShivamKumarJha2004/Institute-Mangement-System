import mongoose from "mongoose";

const connection = async () => {
    const url = process.env.URL || ""; // Fallback to empty string for debugging
    if (!url) {
        console.error("Database connection URL is missing. Check your .env file.");
        return;
    }

    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "Institute_Management_System",
    };

    try {
        const res = await mongoose.connect(url, options);
        if (res) {
            console.log("Database is connected");
        }
    } catch (error) {
        console.error("Error connecting to database:", error.message);
    }
};

export default connection;
