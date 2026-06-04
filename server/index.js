import express from 'express';
import { createServer } from 'http';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './db.js';
import { initWss } from './wss.js';
import tierlistRouter from './routes/tierlists.js';
import uploadRouter from './routes/upload.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/data', express.static(path.join('.', 'data')));
app.use('/tierlist', tierlistRouter);
app.use('/upload', uploadRouter);

const httpServer = createServer(app);
initWss(httpServer);
await initDB();

httpServer.listen(process.env.port || 2500, err => {
    if (err) console.error(err);
    else console.log(`Server läuft auf Port: ${process.env.port || 2500}`);
});