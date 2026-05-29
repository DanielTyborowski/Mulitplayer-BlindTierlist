import Nano from 'nano';
import dotenv from 'dotenv';

dotenv.config();


const couchUrl = process.env.dbURL;

const nano = Nano(couchUrl);

export const db = nano.db.use('tierlist')



export const initDB = async () => {
    try{
        await nano.db.create('tierlist')
        console.log('DB erstellt')
    } catch (error) {
        if (error.statusCode === 412) console.log('DB exisitert bereits');
        else throw error
    }
}

