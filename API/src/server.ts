import express, { Request, Response, json } from "express";
import cors from "cors";
import { Server } from "socket.io";
import { ImageConverter } from "./models/image-converter";
import UserVerificationModelRunner from "./models/UserVerificationModelRunner";
import { AuthenticationStates } from "./models/AuthenticationStates";
import usersRouter from "./routes/users";
import { Utils } from "./models/utils";
import fs from "fs";
const port = 3000;
const app = express();
app.use(express.json());
app.use(cors());
app.use("/users/", usersRouter);

const io = new Server({
  cors: { origin: "*" },
});

let establishConnection = () => {
  io.emit("session-request-accepted");
};

let sendFaceVerificationResults = (results: any) => {
  io.emit("verificationMessage", results);
};

let sendDeviceVerificationResults = (results: any) => {
  io.emit("deviceVerificationMessage", results);
};
let sendOCRResults = (results: any) => {
  io.emit("ocrMessage", results);
};

const allUsersVerificationModels: Map<string, UserVerificationModelRunner> =
  new Map();

io.on("connection", async (socket) => {
  console.log("a user connected");
  console.log(socket.id);
  /*
{'xyz':process
}
*/ //create new VerificationModel for the user
  socket.on("session-request-for-user", (data: any) => {
    console.log("email");
    console.log(data.email);
    const userDirectoryName = Utils.getDirectoryNameFromEmail(data.email);
    const uvm: UserVerificationModelRunner = new UserVerificationModelRunner(
      establishConnection,
      sendFaceVerificationResults,
      sendDeviceVerificationResults,
      sendOCRResults,
      userDirectoryName
    );

    allUsersVerificationModels.set(socket.id, uvm);
    console.log(
      "added new user to socket ARRAY",
      socket.id,
      allUsersVerificationModels
    );
  });

  socket.on("message", async (data: any) => {
    const { imageFrame, currentState, frameNumber } = data;
    //who is sending?
    const uvm: UserVerificationModelRunner | undefined =
      allUsersVerificationModels.get(socket.id);
    const userDirectoryName = Utils.getDirectoryNameFromEmail(data.email);

    await ImageConverter.convertBase64ToImageFile(
      imageFrame._imageAsDataUrl,
      `./users-data/${userDirectoryName}/image.jpg`
    );
    if (uvm) {
      if (
        uvm.isFaceVerificationProcessCreated &&
        uvm.isDeviceVerificationProcessCreated
      ) {
        uvm.notifyVerificationProcessesWithNewFrame(frameNumber);
      }
    }
  });

  socket.on("ocrRequest", (data) => {
    const dirName = Utils.getDirectoryNameFromEmail(data.email);
    fs.writeFileSync(`users-data/${dirName}/ocr-signal.txt`, "1");
  });

  socket.on("session-end", () => {
    const uvm: UserVerificationModelRunner | undefined =
      allUsersVerificationModels.get(socket.id);

    if (uvm) {
      uvm.killUserProcesses();
      allUsersVerificationModels.delete(socket.id);
      console.log(
        "deleted  user from socket ARRAY",
        socket.id,
        allUsersVerificationModels
      );
    }
  });
  socket.on("disconnect", () => {
    const uvm: UserVerificationModelRunner | undefined =
      allUsersVerificationModels.get(socket.id);

    console.log("User disconnected");
    try {
      if (uvm) {
        uvm.killUserProcesses();
        allUsersVerificationModels.delete(socket.id);
        console.log(
          "deleted  user from socket ARRAY",
          socket.id,
          allUsersVerificationModels
        );

        //clean user dir files .. will make fileManagerClass

        for (let i = 1; i <= 16; i++) {
          try {
            fs.unlinkSync(
              `../api/users-data/${uvm.userDirectoryName}/enhanced_image_option_${i}.jpg`
            );
          } catch (e) {}
        }
        fs.writeFileSync(
          `../api/users-data/${uvm.userDirectoryName}/ocr-signal.txt`,
          "0"
        );
        if (
          fs.existsSync(`../api/users-data/${uvm.userDirectoryName}/image.jpg`)
        )
          fs.unlinkSync(`../api/users-data/${uvm.userDirectoryName}/image.jpg`);
      }
    } catch (err) {
      console.log(`error occured ${err}`);
    }
  });
});

io.listen(port);

app.get("/test", async (req: Request, res: Response) => {
  const result = await UserVerificationModelRunner.checkMultiplePhotosMatching(
    "ZeyadSamer"
  );

  res.send(result.photosMatching);
});

app.listen(3030, () => {
  console.log(`server running on port 3030`);
});
