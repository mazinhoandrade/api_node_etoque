import express, { Request, Response, ErrorRequestHandler }  from "express";
import path from "path";
import "dotenv/config";
import apiRoutes from "../src/routes/api";
import cors from "cors";
import { mongoConnect } from "./database/mongo";
import { MulterError } from "multer";
import passport from "passport";

mongoConnect();

// instaciando o express
const server = express();

//liberado a api pra esse site se colocar o, '*' libera pra tudo
server.use(cors());

//deixando a pasta public acessiva 
server.use(express.static(path.join(__dirname, '../public')));

server.use(passport.initialize());
//ativa o recebemento de dados via post
server.use(express.urlencoded({extended:true}));

//routes da api
server.use('/api',apiRoutes);

//router 404
server.use((req: Request, res: Response)=>{
    res.status(404);
    res.json({error: 'Endpoint não encotrando'});
});
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    
    if (err.status) {
        res.status(err.status);
    } else {
        res.status(400); // bad Resquest
    }

    if (err.message) {
        res.json({error: err.message});
        return;
    } else {
        res.json({ error: 'Ocorreu algum erro.' });
    }
    
    
    if ( err instanceof MulterError ) {
        res.json({ error: err.code });
    } else {
        console.log( err );
        res.json({ error: 'Ocorreu algum erro.' });
    }
};
server.use(errorHandler);

//rodando servidor
server.listen(process.env.PORT);

