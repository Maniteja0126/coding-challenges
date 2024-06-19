import mongoose from 'mongoose';

const URI = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

export const connectToMongoDB = async () => {
    try {
        await mongoose.connect(URI, {
            //@ts-ignore
            useNewUrlParser: true,
            //@ts-ignore
            useUnifiedTopology: true,
            // Add other options as needed
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};
