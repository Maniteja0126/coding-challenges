import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURL = process.env.URL;

export const connectionToDB = () => {
    //@ts-ignore
    mongoose.connect(mongoURL,{ retryWrites: true, w: 'majority' })
    .then(() => {
        console.log("Connected to MongoDB successfully");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
        console.error('Mongoose connection error:', err);
    });

};
