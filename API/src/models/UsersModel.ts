//@ts-ignore
import client from "../database";
import { MessageCodeNumber as MessageCodeNumber } from "./MessageStatusNumberBinding";
import { SicknessCall } from "./SicknessCall";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export interface User {
  id?: number;
  fullname: string;
  phone: string;
  email: string;
  img_path: string;
  user_password: string;
}

const salt = process.env.SALT_ROUNDS as unknown as string;
const pepper = process.env.BCRYPT_PASSWORD as unknown as string;

export class UsersModel {
  constructor() {}

  async getAll(): Promise< User[] | undefined > {
    try {
      //@ts-ignore
      const connection = await client.connect();
      const sqlQuery = `select * from users;`;
      const result = await connection.query(sqlQuery);
      connection.release();
      return result.rows;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async addUser(user: User): Promise<User | undefined> {
    try {
      //@ts-ignore
      const connection = await client.connect();
      const sqlQuery = `insert into Users(fullName,phone,email,img_path,user_password) values($1,$2,$3,$4,$5) returning *`;
      //hashing password

      console.log(process.env.SALT_ROUNDS);
      const hashedPassword = bcrypt.hashSync(
        user.user_password + pepper,
        parseInt(salt)
      );
      console.log(hashedPassword);

      const result = await connection.query(sqlQuery, [
        user.fullname,
        user.phone,
        user.email,
        user.img_path,
        hashedPassword,
      ]);

      connection.release();

      return result.rows[0];
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async getUser(
    userEmail: string,
    password: string
  ): Promise<User | number> {
    try {
      //@ts-ignore
      const connection = await client.connect();
      const sqlQuery = `select * from users where email=$1`;
      const result = await connection.query(sqlQuery, [userEmail]);

      connection.release();
      const user: User = result.rows[0];
     
      const isHashesEqual = bcrypt.compareSync(
        password + pepper,
        user.user_password
      );

      if (!user) {
        return MessageCodeNumber.EMAIL_NOT_FOUND;
      }
      if (isHashesEqual) {
        return user;
      } else {
        return MessageCodeNumber.INCORRECT_PASSWORD;
      }
    } catch (error) {
      console.error(error);
      return MessageCodeNumber.Error;
    }
  }



async addUserReading( sicknessCall:SicknessCall):Promise< SicknessCall | number > {





  try {
    //@ts-ignore
    const connection = await client.connect();
    const sqlQuery = `insert into sick(id,reading,sicK_call) values($1,$2,$3) returning *`;
    const result = await connection.query(sqlQuery, [sicknessCall.id,sicknessCall.reading,sicknessCall.sicknessCall]);

    connection.release();

    return result.rows[0];
   
   
  } catch (error) {
    console.error(error);
    return MessageCodeNumber.Error;
  }

}



}
