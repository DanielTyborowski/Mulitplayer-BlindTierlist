import express from 'express';
import { db } from '../db.js';

import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const doc = req._doc; 
        const folder = req.params.id.replace('tierlist:', '');
        const dir = `./data/${folder}`;
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    }
});

const upload = multer({ storage });

// Delete entire Tierlist
router.delete('/:id', async (req, res) => {
    const doc =  await db.get(req.params.id);
    await db.destroy(doc._id, doc._rev);
    res.json({ ok: true});
})


// remove item from tierlist
router.delete('/:id/item/:itemIndex', async (req, res) =>{
    const doc =  await db.get(req.params.id);
    const index = parseInt(req.params.itemIndex);
    doc.pool.splice(index, 1);
    await db.insert(doc);
    res.json({ok: true, pool: doc.pool});
})


// add item to tierlist
router.post('/:id/item', upload.single('image'), async(req, res) =>{
    const doc = await db.get(req.params.id);
    const folder =  req.params.id.replace('tierlist:', '');
    doc.pool.push({
        name: req.body.itemName,
        img: `/data/${folder}/${req.file.filename}`
    });
    await db.insert(doc);
    res.json({ ok: true, pool: doc.pool})
})




router.get('/', async (req, res) =>{
    const result = await db.list({
        include_docs: true,
        startkey: 'tierlist:',
        endkey: 'tierlist;\uffff'
    })
    const docs = result.rows.map(row => row.doc)
    res.json(docs)
})


router.get('/:id', async (req, res) =>{
    const doc = await db.get(req.params.id);

    res.json(doc);
})





export default router;