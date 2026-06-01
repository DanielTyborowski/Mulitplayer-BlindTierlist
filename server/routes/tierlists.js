import express from 'express';
import { db } from '../db.js';


const router = express.Router();

/*
router.get('/', async (req, res) =>{
    const result = await db.find({selector : {
        id: { $gt: 'tierlist:', $lt:'tierlist;'}

        })
    res.json(result.docs)
})
*/

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