import { NextFunction, Request, Response } from "express";


export function middleware(req:Request,res:Response,next: NextFunction){
    console.log("middleware")
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();    
}