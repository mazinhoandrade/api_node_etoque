import { model, connection, Schema, set } from 'mongoose';

type ProductType = {
    name: string,
    description: string | null,
    price: number,
    code: number,
    photo: string | null,
    units: number 
}   

const schema = new Schema<ProductType>({
    name: { 
        type: String,
        required:[true, '(name) Campo Obrigatorio'], 
    },
    units: { 
        type: Number,
        required:[true, '(units) Campo Obrigatorio'], 
    },
    description: {
        type: String,
        default: null 
    },
    price: {
        type: Number,
        required:[true, '(price) Campo Obrigatorio'],
    },
    code:{
        type: Number,
        required:[true, '(code) Campo Obrigatorio'],
        unique:true,
    },
    photo: { type: String, default: null }
});



const modelName: string = 'products';

export default (connection && connection.models[modelName]) ?
    connection.models[modelName] :
    model<ProductType>(modelName, schema);
