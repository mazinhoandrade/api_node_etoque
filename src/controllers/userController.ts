import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import JWT from "jsonwebtoken";
import { hash, compare } from "bcryptjs";


export const register = async (req: Request, res: Response) => {
  
  let  { user, email, password } = req.body;
  console.log(user);

  try {
    let hasUser = await User.find({ email });
    if (hasUser.length) throw new Error("Usuario ja existe");

    let key = password ? await hash(password, 10) : "";
    let newUser = await User.create({
      user,
      email,
      password: key,
    });

    const token = JWT.sign(
      { _id: newUser._id, user: newUser.user, email: newUser.email },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "2h" } // definido o tempo de expiração do token
    );

    newUser.save();

    return res.status(201).json({ token });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    let { user, password } = req.body;

    if (!user && !password)
      throw new Error("preecha os campos user e password");

    const checkUser = await User.findOne({ user });

    if (!checkUser) throw new Error("Usuario ou senha incorreto");

    const isSimilarPassword = await compare(password, checkUser.password);

    if (!isSimilarPassword) throw new Error("Usuario ou senha incorreto");

    delete checkUser.password;
    const token = JWT.sign(
      { _id: checkUser._id, user: checkUser.user, email: checkUser.email },
      process.env.JWT_SECRET_KEY as string, 
      { expiresIn: "2h" } // definido o tempo de expiração do token
    );

    return res.status(200).json({ user: checkUser.user, token });
    // { user: checkUser, token }
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const listUsers = async (req: Request, res: Response) => {
  let users = await User.find();
  let list: string[] = [];

  for (let i in users) {
    list.push(users[i].email);
  }

  return res.status(200).json({ list });
};
