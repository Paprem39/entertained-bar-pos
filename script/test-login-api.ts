async function main(){

    const response =
      await fetch(
        "http://localhost:3000/api/auth/login",
        {
          method:"POST",
  
          headers:{
            "Content-Type":"application/json",
          },
  
          body:JSON.stringify({
  
            userId:"cmrcpmjaa000178viat9qd51j",
  
            pin:"1111",
  
          }),
  
        }
      );
  
  
    const data =
      await response.json();
  
  
    console.log(data);
  
  }
  
  
  main()
    .catch(error=>{
  
      console.error(error);
  
      process.exit(1);
  
    });