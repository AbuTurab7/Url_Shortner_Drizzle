import { authenticateUser } from "../middlewares/verify-auth-middleware.js";
import { createUser , getUserByEmail , getHashPassword , comparePassword , deleteCurrentSession  } from "../services/auth.services.controller.js";
import { loginValidation, registrationValidation } from "../validation/auth-validation.js";

export const getRegister =  (req , res) => {
  return  res.render("auth/register" , {errors : req.flash("errors")});
}

export const postRegister = async (req , res) => {
  const { data , error } = registrationValidation.safeParse(req.body);

  if(error){
    const errors = error.issues[0].message;
    req.flash("errors" , errors);
    res.redirect("/register");
  } else {
    const { name , email , password } = data;
  const [userExist] = await getUserByEmail(email);
  
  if(userExist) {
    req.flash("errors" , "User already exists");
    return res.redirect("/register");
  } 
  const hashedPassword = await getHashPassword(password);
 const [user] = await createUser({name , email , password : hashedPassword });
  
 await authenticateUser({ req , res , user , name , email });
  }

}

export const getLogin =  (req , res) => {
 return  res.render("auth/login" , {errors : req.flash("errors")});
}

export const postlogin = async (req , res) => {
  const { data , error } = loginValidation.safeParse(req.body);
  
  if(error){
    const errors = error.issues[0].message;
    req.flash("errors" , errors);
    return res.redirect("/login")
  } else {
    const { email , password } = data;
  const [ user ] = await getUserByEmail(email);  

  if(!user){
    req.flash("errors" , "Invalid email or password");
    return res.redirect("/login");
  }

  const isPasswordValid = await comparePassword(password , user.password);

  if(!isPasswordValid){
    req.flash("errors" , "Invalid email or password");
    return res.redirect("/login");
  }

await authenticateUser({ req , res , user });
  } 
}


export const getProfile = (req , res) => {
  if(!req.user) return res.send(`<h1>You are not logged in</h1>`);
  res.render("auth/profile");
} 

export const getLogout = async (req , res) => {

  await deleteCurrentSession(req.user.sessionId);
  
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.redirect("/");
}