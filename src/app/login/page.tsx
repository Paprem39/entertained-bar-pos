"use client";

import { useEffect, useState } from "react";


interface LoginUser {

  id: string;

  username: string;

  displayName: string;

  role: "ADMIN" | "CASHIER" | "STAFF";

  isActive: boolean;

}



export default function LoginPage(){


  const [users,setUsers] =
    useState<LoginUser[]>([]);


  const [loading,setLoading] =
    useState(true);



  useEffect(()=>{


    async function loadUsers(){


      try{


        const response =
          await fetch(
            "/api/users/login-list"
          );


        const data =
          await response.json();


        setUsers(data);


      }catch(error){


        console.error(
          error
        );


      }finally{


        setLoading(false);


      }


    }



    loadUsers();


  },[]);




  if(loading){

    return (

      <div>
        Loading...
      </div>

    );

  }





  return (

    <main>

      <h1>
        ENTERTAINED BAR POS
      </h1>


      <h2>
        Select User
      </h2>



      <div>


        {
          users.map(user=>(

            <div
              key={user.id}
            >

              <h3>
                {user.displayName}
              </h3>


              <p>
                {user.role}
              </p>


            </div>

          ))
        }


      </div>


    </main>

  );

}