import {
  execSync,
  spawn,
  exec,
  ChildProcessWithoutNullStreams,
} from "child_process";
import { promisify } from "util";
import fs from "fs";
import { PhotosMatchingData } from "./photosMatchingData";
import { utils } from "face-api.js";
import { Utils } from "./utils";
export default class UserVerificationModelRunner {
  private static execAsync = promisify(exec);
  //will take userpath
  public isFaceVerificationProcessCreated: boolean = false;
  public isOCRProcessCreated: boolean = false;
  public isDeviceVerificationProcessCreated: boolean = false;
  public faceVerificationProcess!: ChildProcessWithoutNullStreams;
  public deviceVerificationProcess!: ChildProcessWithoutNullStreams;
  public OCRChildProcess!: ChildProcessWithoutNullStreams;
  public userDirectoryName!: string;
  constructor(
    callBackOnAllProcessCreated: Function,
    callbackOnFaceVerificationDataReceived: Function,
    callbackOnDeviceVerificationDataReceived: Function,
    callbackonOCRDataReceived: Function,
    userDirectoryName: string
  ) {
    //create processes for user
    this.userDirectoryName = userDirectoryName;
    this.spawnProcesses(
      callBackOnAllProcessCreated,
      callbackOnFaceVerificationDataReceived,
      callbackOnDeviceVerificationDataReceived,
      callbackonOCRDataReceived
    );

    console.log(this.userDirectoryName);
  }

  static async checkMultiplePhotosMatching(
    userDirectoryName: string
  ): Promise<PhotosMatchingData> {
    // Path to the Python script
    const pythonScript = "one-time-multiple-photos-checker.py";

    // Arguments to pass to the Python script
    const args = [userDirectoryName]; // Example: add 2 + 3

    // Construct the command to execute the Python script
    const command = `python ./src/python-models/${pythonScript} ${args.join(
      " "
    )}`;

    // Execute the command asynchronously
    const { stdout, stderr } = await this.execAsync(command);

    // Log the output from the Python script
    console.log(`Python script output: ${stdout}`);
    return JSON.parse(stdout.toString());
  }

  private async listenToDeviceVerificationProcess(
    callBackOnDeviceProcessCreated: Function,
    callbackOnDataReceived: Function
  ) {
    this.deviceVerificationProcess.stdout.on("data", (data: any) => {
      if (!this.isDeviceVerificationProcessCreated) {
        this.isDeviceVerificationProcessCreated = true;
        callBackOnDeviceProcessCreated();
      }
      callbackOnDataReceived(JSON.parse(data.toString()));
    });
    this.deviceVerificationProcess.stderr.on("data", (data: any) => {
      console.error(`Python stderr: ${data}`);
      // Handle errors or log them in real-time
    });

    this.deviceVerificationProcess.on("close", (code: any) => {
      this.isDeviceVerificationProcessCreated = false;

      console.log(`Python process exited with code ${code}`);
      //fs.writeFileSync(`users-data/${this.userDirectoryName}/tracker.txt`, "0");
      //this.frameNumber = 0;

      // Handle process exit
    });
  }

  public spawnProcesses(
    //parent function that calls all
    callBackOnAllProcessCreated: Function,
    callbackOnFaceVerificationDataReceived: Function,
    callbackOnDeviceVerificationDataReceived: Function,
    callbackOnOCRDataReceived: Function
  ) {
    this.faceVerificationProcess = spawn("python", [
      "./src/python-models/faceVerification.py ",
      `${this.userDirectoryName}/front-id.jpeg`,
      `${this.userDirectoryName}/image.jpg`,
      `${this.userDirectoryName}/tracker.txt`,
      `${this.userDirectoryName}`,
    ]);
    this.deviceVerificationProcess = spawn("python", [
      "./src/python-models/DeviceVerification.py ",
      `${this.userDirectoryName}/image.jpg`,
      "thermometer",
      `${this.userDirectoryName}/tracker.txt`,
    ]);
    this.OCRChildProcess = spawn("python", [
      "./src/python-models/OCR.py ",
      `${this.userDirectoryName}/image.jpg`,
      `${this.userDirectoryName}/tracker.txt`,
      `${this.userDirectoryName}/ocr-signal.txt`,
      this.userDirectoryName,
    ]);
    this.listenToFaceVerificationProcess(() => {},
    callbackOnFaceVerificationDataReceived);
    //listen to ocr process
    this.listenToOCRProcess(() => {}, callbackOnOCRDataReceived);
    this.listenToDeviceVerificationProcess(
      callBackOnAllProcessCreated,
      callbackOnDeviceVerificationDataReceived
    );
  }

  private async listenToFaceVerificationProcess(
    callBackOnVerificationProcessCreated: Function,
    callbackOnDataReceived: Function
  ) {
    this.faceVerificationProcess.stdout.on("data", (data: any) => {
      if (!this.isFaceVerificationProcessCreated) {
        this.isFaceVerificationProcessCreated = true;
        callBackOnVerificationProcessCreated();
      }
      if (data.toString())
         callbackOnDataReceived(JSON.parse(data.toString()));
    });

    this.faceVerificationProcess.stderr.on("data", (data: any) => {
      console.error(`Python stderr: ${data}`);
      // Handle errors or log them in real-time
    });

    this.faceVerificationProcess.on("close", (code: any) => {
      this.isFaceVerificationProcessCreated = false;

      console.log(`Python process exited with code ${code}`);
      fs.writeFileSync(`users-data/${this.userDirectoryName}/tracker.txt`, "0");
      //this.frameNumber = 0;

      // Handle process exit
    });
  }

  //function listen to OCR process

  public notifyVerificationProcessesWithNewFrame(frameNumber: number) {
    fs.writeFileSync(
      `users-data/${this.userDirectoryName}/tracker.txt`,
      frameNumber.toString()
    );
  }

  private async listenToOCRProcess(
    callbackOnOCRProcessCreated: Function,
    callbackOnOCRDataReceived: Function
  ) {
    this.OCRChildProcess.stdout.on("data", (data: any) => {
      if (!this.isFaceVerificationProcessCreated) {
        this.isOCRProcessCreated = true;
        callbackOnOCRProcessCreated();
      }
      if (data.toString())
        callbackOnOCRDataReceived(JSON.parse(data.toString()));
      console.log("data received");
      console.log(data.toString());
    });

    this.OCRChildProcess.stderr.on("data", (data: any) => {
      console.error(`Python stderr: ${data}`);
      // Handle errors or log them in real-time
    });

    this.OCRChildProcess.on("close", (code: any) => {
      this.isOCRProcessCreated = false;

      console.log(`Python process exited with code ${code}`);
      // fs.writeFileSync(`users-data/${this.userDirectoryName}/tracker.txt`, "0");
      //this.frameNumber = 0;

      // Handle process exit
    });
  }

  public killUserProcesses(): void {
    this.faceVerificationProcess.kill();
    this.isFaceVerificationProcessCreated = false;
    this.OCRChildProcess.kill();
    this.isOCRProcessCreated = false;
    this.deviceVerificationProcess.kill();
    this.isDeviceVerificationProcessCreated = false;
  }
}
