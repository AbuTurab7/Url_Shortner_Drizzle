
import { createUser , getUserByEmail , getHashPassword , comparePassword , getToken } from "../services/auth.services.controller.js";

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
  const hashedPassword = await getHashPassword(password);
 await createUser({name , email , password : hashedPassword });
  
  res.redirect("/login");
}

export const getLogin =  (req , res) => {
 return  res.render("auth/login");
}

export const postlogin = async (req , res) => {
  const { email , password } = req.body;
  const [ user ] = await getUserByEmail(email);  
  const isPasswordValid = await comparePassword(password , user.password );

  if(!user || !isPasswordValid){
    return ( res.send(`
      <script>
      alert("Email or password is incorrect, Try Again!");
      window.location.href="/login";
      </script>
      `));
  }
  const token = getToken({
    id : user.id,
    name : user.name,
    email : user.email
  });
// res.cookie("isLoggedIn", "true");
res.cookie("access_token", token);
    res.redirect("/");
}

