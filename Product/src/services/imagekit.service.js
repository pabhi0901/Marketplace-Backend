import ImageKit from "imagekit";
import { v4 as uuidv4 } from 'uuid';
import dotenv from "dotenv"
dotenv.config()

var imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_ENDPOINT_URL
});

async function uploadImage(file,folder='/product'){
   const response =  await imagekit.upload({
    file : file.buffer, //required
    fileName :uuidv4(),
    folder: folder,
})

   
    return {
        url:response.url,
        thumbnail:response.thumbnailUrl,
        id:response.fileId
    }
}

async function deleteImage(id){

     await imagekit.deleteFile(id);
     console.log("Deleted");
        
}

export  {uploadImage,deleteImage}