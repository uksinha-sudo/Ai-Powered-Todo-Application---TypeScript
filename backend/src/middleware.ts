import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import type{ JwtPayload } from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;


export const userMiddleware = async(req: Request, res: Response, next: NextFunction) => {

    try{

        const authHeader = req.headers.authorization;
        
        if(!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                message:"Token missing"
            });
        }
        
        const token = authHeader.split(" ")[1];
        if(JWT_SECRET === undefined) {
            return res.status(500).json({
                message:"JWT Secret not configured"
            });
        };
        
        if(token === undefined) {
            return res.status(401).send({
                message:"Token in undefined"
            })
        }
        
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & {
            id: string;
        };
        req.userId = decoded.id;
        next();
    } catch(error) {
        return res.status(401).json({
            message:"Invalid or expired token"
        });
    }


}