
export const registration =  (req , res) => {
  return  res.render("auth/register");
}
export const getLogin =  (req , res) => {
 return  res.render("auth/login");
}
export const loggedIn =  (req , res) => {
 res.cookie("isLoggedIn", "true");
 res.redirect("/");
}