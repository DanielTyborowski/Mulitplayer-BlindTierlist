'use strict';

import express from 'express';
import { WebSocketServer } from 'ws';
import path from 'path';
import cors from 'cors';
import nano from 'nano';
import dotenv from 'dotenv';
import { initDB } from './db.js';
//import { promises as fs } from 'fs';

import tierlistRouter from './routes/tierlists.js'


dotenv.config();

const port = process.env.port || 2500;

const server = express();


server.use(cors());
server.use(express.json());
server.use('/data', express.static(path.join('.', 'data')))
server.use('/tierlists', tierlistRouter);



await initDB();





const init = async () => {
    server.listen(port, err => {
        if(err) console.log(err);
        else console.log(`Server läuft auf Port: ${port}`);
    })

};

init();