
import { createUser , getUserByEmail  } from "../services/auth.services.controller.js";

export const getRegister =  (req , res) => {
  return  res.render("auth/register");
}

export const postRegister = async (req , res) => {
  const {name , email , password } = req.body;
  const [userExist] = await getUserByEmail(email);
  
  if(userExist) return ( res.send(`
    <script>
      alert("User already exists with the email. Please login!");
      window.location.href = "/login";
    </script>
  `));
  
 await createUser({name , email , password});
  
  res.redirect("/login");
}


export const getLogin =  (req , res) => {
 return  res.render("auth/login");
}

export const postlogin = async (req , res) => {
  const { email , password } = req.body;
  const [ user ] = await getUserByEmail(email);  
  console.log( user );
  if(!user || user.password !== password){
    return ( res.send(`
      <script>
      alert("Email or password is incorrect, Try Again!");
      window.location.href="/login";
      </script>
      `));
  }
res.cookie("isLoggedIn", "true");
    res.redirect("/");
}

