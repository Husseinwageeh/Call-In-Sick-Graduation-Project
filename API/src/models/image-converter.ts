import fs from "fs/promises";
import sharp from "sharp";

export class ImageConverter {
  constructor() {}

  static async convertBase64ToImageFile(
    b64Data: any,
    outputPath: string
  ): Promise<void> {
    const base64Image = b64Data.split(";base64,").pop();

    const data = await fs.writeFile(outputPath, base64Image, {
      encoding: "base64",
    });
    console.log(data);

   
  }
}
