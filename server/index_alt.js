'use strict';

import express from 'express';
import cors from 'cors';
import nano from 'nano';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';

dotenv.config();

const port = process.env.port || 2500;

const server = express();

server.use(express.static('public', { extensions: ['html'] }));

server.use(cors());
server.use(express.json());









const couchUrl = process.env.dbURL;

const dbNames = ['tierlist', 'user'];

const connection = nano(couchUrl);

const init = async () => {
    connection.db.list().then(
        list => Promise.all(
            dbNames.map(dbName => {
                if (!list.includes(dbName)) {
                    return connection.db.create(dbName);
                }
            })
        )
    ).then(
        server.listen(port, err => {
            if (err) console.log(err);
            else console.log(`Server läuft auf Port ${port}`);
        })
    ).catch(
        err => console.log(err)
    );
};

init();