import { authenticateUser } from "../middlewares/verify-auth-middleware.js";
import { createUser , getUserByEmail , getHashPassword , comparePassword , deleteCurrentSession, findUserById , generateRandomToken , createVerifyLink, insertVerifyEmailToken, clearVerifyEmailToken, verifyUserEmailAndUpdateToken, findVerificationEmailToken, updateProfile  } from "../services/auth.services.controller.js";
import { getShortLinkByUserId } from "../services/services.controller.js";
import { loginValidation, registrationValidation, verifyEmailValidation, verifyUserValidation } from "../validation/auth-validation.js";
// import { sendEmail } from "../lib/nodemailer.js";
import { sendEmail } from "../lib/resendEmail.js";
import fs from "fs/promises";
import { join } from "path";
import ejs from "ejs";
import mjml2html from "mjml";
import { error } from "console";

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
res.redirect("/verify-email");
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
  res.redirect("/");
}


export const getProfile = async (req , res) => {

  if(!req.user) return res.send(`<h1>You are not logged in</h1>`);

  const user = await findUserById(req.user.id);
  
  if(!user) return res.send(`<h1>You are not logged in</h1>`);
  
  const userShortLinks = await getShortLinkByUserId(user.id);
  
  res.render("auth/profile" , {
     user : {
      id: user.id,
      name: user.name,
      email: user.email,
      isEmailValid: user.isEmailValid,
      createdAt: user.createdAt,
      links: userShortLinks,
     },
   });
} 

export const getLogout = async (req , res) => {

  await deleteCurrentSession(req.user.sessionId);
  
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.redirect("/");
}

//verify-email

export const getVerifyEmail = async (req , res) => {
  if(!req.user) return res.redirect("/");
  const user = await findUserById(req.user.id);
  if(!user || user.isEmailValid ) return res.redirect("/");
  return res.render("auth/verifyEmail" , { email: user.email });

}

// resend-verification-link

export const postResendVerificationLink = async (req , res ) => {
  if(!req.user) return res.redirect("/");
  const user = await findUserById(req.user.id);
  if(!user || user.isEmailValid ) return res.redirect("/");
  const randomToken =  generateRandomToken();
  await insertVerifyEmailToken({ userId: user.id , token: randomToken });
  const verifyEmailLink = await createVerifyLink({ email: user.email , token: randomToken });
  
  const mjmlTemplate = await fs.readFile(join(import.meta.dirname , ".." , "emails" , "verify-email.mjml") , "utf-8");
  const filledTemplate = ejs.render(mjmlTemplate , { code: randomToken , link: verifyEmailLink });

  const htmlOutput = mjml2html(filledTemplate).html;


  sendEmail({
    to: user.email,
    subject: "verify your email",
    html: htmlOutput,
  }).catch(console.error);
  res.redirect("/verify-email");
}    


//verify-email-token

export const getVerifyEmailToken = async ( req , res ) => {
  const { data , error } = verifyEmailValidation.safeParse(req.query);

  if(error){
    return res.send("verification link invalid or expired!");
  }

  const [token] = await findVerificationEmailToken(data);
  if(!token) return res.send("verification link invalid or expired!");

  await verifyUserEmailAndUpdateToken(token.email);

  await clearVerifyEmailToken(token.userId)
  
  return res.redirect("/profile");
}


//edit profile page
//get
export const getEditProfile = async ( req , res ) => {
  if(!req.user) return res.send(`<h1>You are not logged in</h1>`);

  return res.render("auth/editProfile" , {
    user: req.user,
    errors: req.flash("errors"),
  });
}
//post
export const postEditProfile = async ( req , res ) => {
  if(!req.user) return res.send(`<h1>You are not logged in</h1>`);

  const { data , error } = verifyUserValidation.safeParse(req.body);
  if(error){
    console.log("Name Error : " , error);
    const errorMessage = error.issues[0].message;
    req.flash("errors" , errorMessage);
   return res.redirect("/edit-profile");
  }
  
  await updateProfile({ userId: req.user.id , name: data.name });

  return res.redirect("/profile");
}
