import { Request, Response, NextFunction } from 'express';
import User from "../models/user";
import JWT from 'jsonwebtoken';
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

export const register = async (req: Request, res: Response) => {
    let { user, email, password } = req.body;
    
    if ( user && email && password ) {

        let hasUser = await User.find({ email:email }).count();
        let key = crypto.pbkdf2Sync(password, '', 1000, 64, `sha512`).toString(`hex`);
        
        if(hasUser === 0) {
            
            let newUser = await User.create({ 
                user, 
                email,
                password:key
            });

            
            const token = JWT.sign(
                { _id: newUser._id, user: newUser.user, email:newUser.email },
                process.env.JWT_SECRET_KEY as string,
                { expiresIn: '2h' } // definido o tempo de expiração do token
            );

            res.status(201);
            res.json({ _id:newUser._id, token });
            return;
        } else {
            res.json({error: 'já existe uma conta com esse E-mail'});
            return;
        }

    } 
    res.json({error: 'preecha todos os campos'});
};

export const login = async (req: Request, res: Response) => {
    let { user, password } = req.body;
    if ( user && password ) {
        let key = crypto.pbkdf2Sync(password, '', 1000, 64, `sha512`).toString(`hex`);
        let checkUser = await User.findOne({ 
            user:user, 
            password: key
        });
        
        if (checkUser) {

            const token = JWT.sign(
                { _id: checkUser._id, user: checkUser.user, email:checkUser.email },
                process.env.JWT_SECRET_KEY as string,
                { expiresIn: '2h' } // definido o tempo de expiração do token
            );

            res.json({ status: true, token });
            return;
        }
    } 

    res.json({ status: false });
};

export const listUsers = async (req: Request, res: Response) => {
    let users = await User.find();
    let list: string[] = [];

    
    for (let i in users) {
        list.push( users[i].email );
    }


    res.json({ list });

};