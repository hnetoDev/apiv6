import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { extname } from "path";export let fullName : string;

const multerOptions = {
  storage: diskStorage({
    destination:(req,file,cb) =>{
      const uploadDir = './public/exercicios';
      if(!existsSync(uploadDir)){
        mkdirSync(uploadDir,{recursive:true})
      }
      cb(null,uploadDir);
    },
    filename : (req, file, cb) => {
        const name = file.originalname.split('.')[0];
        const extension = extname(file.originalname);
        const randName = Array(32)
        .fill(null)
        .map(()=> Math.round(Math.random() * 16).toString(16))
        .join('');
        
        cb(null,`${name}-${randName}-${extension}`)
    },
  }),
  fileFilter :(req,file,cb)=>{
     if(file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)){
      cb(null,true);
    } else {
      cb(new Error("Unsupported file type"), false)
    } 
  },
  limits: {
    files:1,
    fileSize:(1024 * 1024) / 2
  }
}

export default multerOptions;