import express from 'express';
import session from 'express-session';
import routes from './routes/route.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Use session middleware
app.use(session({
  secret: 'tfrurrhifre',
  resave: false,
  saveUninitialized: true,
}));

app.use(routes);

const PORT =  4444;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

mongoose.connect(process.env.mongouri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });