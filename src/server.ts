import express, { Request, Response }  from "express";
import path from "path";
import dotenv from "dotenv";
import apiRoutes from "../src/routes/api";
import cors from "cors";
import { mongoConnect } from "./database/mongo";

//instaciando do dotenv
dotenv.config();

mongoConnect();

// instaciando o express
const server = express();

//liberado a api pra esse site se colocar o, '*' libera pra tudo
server.use(cors({
    origin: 'https://resttesttest.com' 
}));

//deixando a pasta public acessiva 
server.use(express.static(path.join(__dirname, '../public')));

//ativa o recebemento de dados via post
server.use(express.urlencoded({extended:true}));

//routes da api
server.use('/api',apiRoutes);

//router 404
server.use((req: Request, res: Response)=>{
    res.status(404);
    res.json({error: 'Endpoint não encotrando'});
});

//rodando servidor
server.listen(process.env.PORT);

