import express from 'express';
import { db } from '../db.js';


const router = express.Router();


router.get('/', async (req, res) =>{
    const result = await db.find({selector : {type: 'tierlist'}})
    res.json(result.docs)
})





export default router;