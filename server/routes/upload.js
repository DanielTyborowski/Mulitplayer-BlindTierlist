import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4} from 'uuid';
import { db } from '../db.js';
import fs from 'fs';

const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folderName = req.body.folderName || 'custom'; //vielleicht noch zu aktuell date umschreiben alternativ zu custom
        const dir = `./data/${folderName}`;
        fs.mkdirSync(dir, { recursive: true }); 
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    }
});

const upload = multer({storage});



router.post('/', upload.array('images'), async (req, res) => {
    const  { name, folderName} = req.body;
    const folder = folderName || 'custom';

    const pool = req.files.map((file, i) => ({
    name: req.body[`itemName_${i}`],
    img: `/data/${folder || 'custom'}/${file.filename}`
}));


    const doc = {
        _id: `tierlist:${folder}`,
        name,
        pool
    };

    try{
        await db.insert(doc);
        res.status(409).json({ ok: false, message: `Eine Tierlist mit dem Namen "${name}" existiert bereits.` });
    } catch (err) {
        
        req.files.forEach(file => fs.unlinkSync(file.path));
        
        if (err.statusCode === 409) {
            res.status(409).json({ ok: false, message: `Eine Tierlist mit dem Namen "${name}" existiert bereits.` });
        } else {
            res.status(500).json({ ok: false, message: err.message });
        }
    }
    
})

export default router