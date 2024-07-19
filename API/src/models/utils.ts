// import dotenv from 'dotenv';
// dotenv.config();
export class Utils {
  

  public static getDirectoryNameFromEmail(email: string): string {
    const dirName = email.replace("@", "-").replace(".", "_");
    console.log(dirName);
    return dirName;
  }

  public static checkDuplicatePhotoFilesUploaded(photos: any[]): boolean {
    const set = new Set();

    for (let photo of photos) {
      if (set.has(photo)) {
        return true;
      }
      set.add(photo);
    }

    return false;
  }

  // public static   getBasePath() {
  //   const { BASE_PATH } = process.env;

  //   return BASE_PATH;
  // }

  // public static  getUsersDataPath():string | undefined {
  //   const { USERS_DATA_PATH } = process.env;
 
  //   return USERS_DATA_PATH;
  // }

  // public static getFullPathForSessionUser() {
    
  
  //   console.log(`${this.getBasePath()}/${this.getUsersDataPath()}`)
  //   return process.env.BASE_PATH?.toString()
  // }
}
