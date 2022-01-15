import { connect } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const mongoConnect = async () => {
    try {
        console.log('conectando ao mongo db...');
        await connect(process.env.MONGO_URL as string); 
        console.log('mongo db connectando com sucesso');
    } catch(error) {
        console.log('erro conexão mongo db:', error);
    }
    
}