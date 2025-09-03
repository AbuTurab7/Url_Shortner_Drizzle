
import { createUser , getUserByEmail , getHashPassword , comparePassword , getToken } from "../services/auth.services.controller.js";

export const getRegister =  (req , res) => {
  return  res.render("auth/register" , {errors : req.flash("errors")});
}

export const postRegister = async (req , res) => {
  const {name , email , password } = req.body;
  const [userExist] = await getUserByEmail(email);
  
  if(userExist) {
    req.flash("errors" , "User already exists");
    return res.redirect("/register");
  } 
  const hashedPassword = await getHashPassword(password);
 await createUser({name , email , password : hashedPassword });
  
  res.redirect("/login");
}

export const getLogin =  (req , res) => {
 return  res.render("auth/login" , {errors : req.flash("errors")});
}

export const postlogin = async (req , res) => {
  const { email , password } = req.body;
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

  const token = getToken({
    id : user.id,
    name : user.name,
    email : user.email
  });

  res.cookie("access_token", token);
  res.redirect("/");
}


export const getProfile = (req , res) => {
  if(!req.user) return res.send(`<h1>You are not logged in</h1>`);
  res.render("auth/profile");
  // res.send(`<h1>Hey! ${req.user.name} , ${req.user.email} </h1>`);
} 

export const getLogout = (req , res) => {
  res.clearCookie("access_token");
  res.redirect("/");
}