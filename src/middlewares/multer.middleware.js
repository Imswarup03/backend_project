import multer from "multer";
// Importing the 'multer' library for handling file uploads

// Creating storage configuration for multer using diskStorage method

const storage= multer.diskStorage({

    // Configuring the destination folder where files will be stored
    destination: function(req,file,cb){
        // 'cb' is a callback function, 'null' is for error handling (none here)
        // The files will be stored in the './public/temp' directory
        cb(null,'./public/temp')
    },
    // Configuring the filename for the uploaded file

    filename: function(req,file,cb){
        // Generating a unique filename by combining the original filename and a unique suffix
        const uniqueSuffix = Date.now() +'_'+Math.round(Math.random()*1E9)
        // Calling the callback 'cb' to set the filename
        // 'file.originalname' represents the original name of the uploaded file
        // The uniqueSuffix is added to the original filename to make it unique
        cb(null, file.originalname + '-' + uniqueSuffix)
    }
})



export const upload= multer({storage: storage})

 