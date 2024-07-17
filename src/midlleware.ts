import { NextFunction, Request, Response } from "express";


export function middleware(req:Request,res:Response,next: NextFunction){
    console.log("middleware")


    res.setHeader('Access-Control-Allow-Origin', "http://localhost:3001");
    

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
    
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');
    console.log(res.getHeader("Acess-Control-Allow-Headers"))

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    
    next();

}