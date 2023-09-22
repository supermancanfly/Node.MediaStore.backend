import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './src/config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';
import Routes from './src/router.js';
import cors from "cors";
import bodyParser from 'body-parser';
import morgan from 'morgan';

const port = process.env.PORT || 443;
const port1 = process.env.PORT1 || 80;

connectDB();

const app = express();

app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors());

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1",
    "http://104.142.122.231",
  ],
  credentials: true,
  exposedHeaders: ["set-cookie"],
};

app.use("/api", cors(corsOptions), Routes);

const __dirname = path.resolve();
app.use('/asset', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('360days Backend, RestFul API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
app.listen(port1, () => console.log(`Server started on port ${port1}`));
