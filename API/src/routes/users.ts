import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs/promises";
import { User, UsersModel } from "../models/UsersModel";
import { MessageCodeNumber } from "../models/MessageStatusNumberBinding";
import UserVerificationModelRunner from "../models/UserVerificationModelRunner";
import { PhotosMatchingData } from "../models/photosMatchingData";
import { utils } from "face-api.js";
import { Utils } from "../models/utils";
import { SicknessCall } from "../models/SicknessCall";
const usersRouter = express.Router();
const uploadsPath = "./uploads/";
// const uploadedPhotosPath='./uploads/photos'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath); 
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

usersRouter.use(express.json());

const upload = multer({ storage: storage });
const usersDataPath = "./users-data";
const usersModel = new UsersModel();


usersRouter.post(
  "/upload",
  upload.fields([
    { name: "idFile", maxCount: 1 },
    { name: "multiplePhotos", maxCount: 5 },
  ]),
  async (req: any, res) => {
    if (!req.body) {
      return res.status(400).send("no data provided");
    }
    if (!req.files) {
      return res.status(400).send("no files provided");
    }

    if (!req.body.email) {
      return res.status(400).send("no email provided");
    }
    console.log(req.body.email);
    let userDirectoryName = req.body.email.replace("@", "-").replace(".", "_");

    try {
      // console.log(req.files);
      if (!req.files["idFile"]) {
        return res.status(400).send("ID is not uploaded");
      }
      //for id

      const idPhoto = req.files["idFile"][0].filename;

      const photos = req.files["multiplePhotos"];
      if (photos.length < 3 || !photos) {
        return res.status(400).send("3 images needed to be uploaded");
      }

      const multiplePhotos = req.files["multiplePhotos"].map(
        (photoFile: any) => photoFile.filename
      );

      //check duplicate photos uploaded;
      if (
        Utils.checkDuplicatePhotoFilesUploaded([...multiplePhotos, idPhoto])
      ) {
        return res.status(400).send("Duplicate Files Uploaded!,Photos must be unique");
      }

      await fs.mkdir(`${usersDataPath}/${userDirectoryName}/`);
      await fs.rename(
        uploadsPath + idPhoto,
        `${usersDataPath}/${userDirectoryName}/front-id.jpeg`
      );

      //second step store the photos in the user specific directory

      const imgPath = `${usersDataPath}/${userDirectoryName}/`;
      multiplePhotos.forEach(async (photoFileName: string, index: number) => {
        //make sure to check on mimetype
        // images must not have same
        await fs.rename(
          uploadsPath + photoFileName,
          `${usersDataPath}/${userDirectoryName}/personal-photo-${index}.jpeg`
        );
      });

      await fs.writeFile(`${usersDataPath}/${userDirectoryName}/tracker.txt`,'0')
      //this line is added without testing
      await fs.writeFile(`${usersDataPath}/${userDirectoryName}/ocr-signal.txt`,'0')
      //--------------

      //checking photos matching

      const result: PhotosMatchingData =
        await UserVerificationModelRunner.checkMultiplePhotosMatching(
          userDirectoryName
        );



      if (!result.photosMatching) {
        console.log(typeof result.face_detected);
        if (result.face_detected === false) {
          //delete uploaded data in case of failure here

          await fs.rm(`${usersDataPath}/${userDirectoryName}/`, {
            recursive: true,
          });

          return res
            .status(400)
            .send(
              `Photos Not Matching ,No Face Detected  For the image at order of ${result.image_not_matching} `
            );
        }

        await fs.rm(`${usersDataPath}/${userDirectoryName}/`, {
          recursive: true,
        });

        return res
          .status(400)
          .send(
            `Photos Not Matching With ID , For the image at order of ${result.image_not_matching} `
          );
      }

      //-----------------------
      const user: User = {
        email: req.body.email,
        user_password: req.body.password,
        fullname: req.body.fullName,
        img_path: imgPath,
        phone: req.body.phone,
      };

      const data = await usersModel.addUser(user);
      if (data) {
        return res.status(200).json({ message: "uploaded", status: 200 });
      } else {
        await fs.rm(`${usersDataPath}/${userDirectoryName}/`, {
          recursive: true,
        });

        res.status(400).send("error uploading your data");
        //delete user saved data
      }
    } catch (err) {
      res.status(400).send("missing or incorrect Data");
      console.error(err);
      //we should delete his data here
    }
  }
);
usersRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await usersModel.getUser(email, password);
  if (result === MessageCodeNumber.EMAIL_NOT_FOUND) {
    return res.status(400).json("User Not Exist");
  } else if (result === MessageCodeNumber.INCORRECT_PASSWORD) {
    return res.status(401).json("Incorrect password");
  } else if (result === MessageCodeNumber.Error) {
    return res.status(500).json("Error while logging in");
  }
  else{
  //filtering result from user hashed password
 
  const { user_password,...responseToSend }=<User> result;
  
  return res.status(200).json(responseToSend);
  }





}


);

usersRouter.post("/sick",async(req,res)=>{
  const sicknessCall:SicknessCall=req.body;
  console.log(sicknessCall);

  const result=await usersModel.addUserReading(sicknessCall);
  console.log("result");

  if(result=== MessageCodeNumber.Error){
    return res.status(500).json("Error in posting reading");
  }else{
    return res.status(200).json(result);

  }
  

})


export default usersRouter;
