import { NextResponse } from "next/server";
import { getActiveLoginUsers } from "@/service/user.service";


export async function GET(){

  try{

    const users =
      await getActiveLoginUsers();


    return NextResponse.json(users);


  }catch(error){

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong"
      },
      {
        status:500
      }
    );

  }

}