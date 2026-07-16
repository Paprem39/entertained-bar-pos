import { NextRequest, NextResponse } from "next/server";
import { loginWithPin } from "@/service/user.service";


export async function POST(
  request: NextRequest
){

  try{

    const body =
      await request.json();


    const {
      userId,
      pin,
    } = body;



    if(!userId || !pin){

      return NextResponse.json(
        {
          message:"User ID and PIN are required"
        },
        {
          status:400
        }
      );

    }



    const result =
      await loginWithPin({

        userId,

        pin,

      });



    return NextResponse.json(
      result,
      {
        status:200
      }
    );



  }catch(error){


    return NextResponse.json(

      {
        message:
          error instanceof Error
            ? error.message
            : "Login failed"
      },

      {
        status:401
      }

    );

  }

}