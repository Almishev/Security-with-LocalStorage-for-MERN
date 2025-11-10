import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import route from './routes/employeeRoute.js';
import userRoute from './auth/userRoutes.js';
import paymentRoute from './payment/stripeRoutes.js';
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

// Stripe webhook endpoint трябва да използва raw body, не JSON
// Затова го добавяме ПРЕД bodyParser.json()
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// За всички останали endpoints използваме JSON parser
app.use(bodyParser.json());


const PORT = process.env.PORT || 7000;
const MONGO_URL = process.env.MONGO_URL;

app.use("/api/", route);
app.use("/api/auth", userRoute);
app.use("/api/payment", paymentRoute);

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


