import { createVerify, verify } from "crypto";
import { authenticateUser } from "../middlewares/verify-auth-middleware.js";
import { createUser , getUserByEmail , getHashPassword , comparePassword , deleteCurrentSession, findUserById , generateRandomToken , createVerifyLink, insertVerifyEmailToken, clearVerifyEmailToken, verifyUserEmailAndUpdateToken, findVerificationEmailToken  } from "../services/auth.services.controller.js";
import { getShortLinkByUserId } from "../services/services.controller.js";
import { loginValidation, registrationValidation, verifyEmailValidation } from "../validation/auth-validation.js";
import { sendEmail } from "../lib/nodemailer.js";

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

  await sendEmail({
    to: user.email,
    subject: "verify your email",
    html: `
    <h1>Click the link below to verify your email</h1>
    <p>You can use this token: <code>${randomToken}</code></p>
    <a href="${verifyEmailLink}">Verify Email</a>
    `,
  }).catch(console.error);
  res.redirect("/verify-email");
}    


//verify-email-token

export const getVerifyEmailToken = async ( req , res ) => {
  const { data , error } = verifyEmailValidation.safeParse(req.query);

  if(error){
    return res.send("verification link invalid or expired!");
  }

  const token = await findVerificationEmailToken(data);
  if(!token) return res.send("verification link invalid or expired!");

  await verifyUserEmailAndUpdateToken(token.email);

  await clearVerifyEmailToken(token.userId).catch(console.log(error));

  return res.redirect("/profile");
}
