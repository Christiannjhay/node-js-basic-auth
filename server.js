import express from "express";
import cors from 'cors';
import user from './routes/user.js';
import cookieParser from 'cookie-parser'; 
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.use('/api/user', user);

app.listen(port, () => console.log(`Server is running on port ${port}`));
