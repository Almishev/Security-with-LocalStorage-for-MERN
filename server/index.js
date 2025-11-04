import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import route from './routes/employeeRoute.js';
import userRoute from './auth/userRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();

// CORS middleware
const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};



app.use(cors(corsOptions));

app.use(bodyParser.json());


const PORT = process.env.PORT || 7000;
const MONGO_URL = process.env.MONGO_URL;

app.use("/api/", route);
app.use("/api/auth", userRoute);

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });


