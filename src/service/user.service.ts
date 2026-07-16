import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";


export async function getActiveLoginUsers(){

  return await prisma.user.findMany({

    where:{
      isActive:true,
    },

    select:{

      id:true,

      username:true,

      displayName:true,

      role:true,

      isActive:true,

    },

    orderBy:{
      displayName:"asc",
    },

  });

}





interface LoginWithPinInput {

  userId:string;

  pin:string;

}




export async function loginWithPin(
  input:LoginWithPinInput
){


  const user =
    await prisma.user.findUnique({

      where:{
        id:input.userId,
      },

    });



  if(!user){

    throw new Error(
      "User not found"
    );

  }




  if(!user.isActive){

    throw new Error(
      "User is inactive"
    );

  }




  const isPinValid =
    await bcrypt.compare(
      input.pin,
      user.pinHash
    );



  if(!isPinValid){

    throw new Error(
      "Invalid PIN"
    );

  }





  const now =
    new Date();





  const session =
    await prisma.userSession.create({

      data:{

        userId:user.id,

        loginAt:now,

        isOnline:true,

      },

    });





  const updatedUser =
    await prisma.user.update({

      where:{
        id:user.id,
      },


      data:{

        lastLoginAt:now,

      },


      select:{

        id:true,

        username:true,

        displayName:true,

        role:true,

        isActive:true,

      },

    });





  return {

    user:updatedUser,

    session,

  };


}