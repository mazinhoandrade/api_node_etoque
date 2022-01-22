import { model, connection, Schema } from 'mongoose';

type UserType = {
    user: string,
    email: string,
    password: string
}   

const schema = new Schema<UserType>({
    user: { type: String, required:true },
    email: { type: String, required:true },
    password: { type: String, required:true }
});

const modelName: string = 'users';

export default (connection && connection.models[modelName]) ?
    connection.models[modelName] :
    model<UserType>(modelName, schema);
