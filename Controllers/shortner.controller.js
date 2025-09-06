
import { saveToFile , getLinks , getShortLinks , getShortLinkById , getUpdatedShortCode} from "../services/services.controller.js";
import { shortnerValidation } from "../validation/shortner-validation.js";
import z from "zod";

export const getShortenURL = async (req, res) => {
  if(!req.user) return res.redirect("/register");
  const Links = await getLinks(req.user.id);
  
  res.render("index", { Links, host: req.host , errors: req.flash("errors") , success : req.flash("success")});
};

export const shortener = async (req, res) => {
  const { data , error } = shortnerValidation.safeParse(req.body);
  if(error){
    const errors = error.issues[0].message;
    req.flash("errors" , errors);
   return res.redirect("/");
  }

  const { url , shortCode } = data;
 const Links = await getShortLinks(shortCode);

 
  if (Links.length > 0) {
    req.flash("errors" , "Short code already exists. Try another one!");
    return res.redirect("/");
  }

  await saveToFile({ url, shortCode , userId: req.user.id});
  req.flash("success" , "URL shorten successfully!");
  return res.redirect("/");
  
};


export const redirectURL = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const [link] = await getShortLinks(shortCode);
    if (!link || link.length === 0) return res.redirect("/404");
    return res.redirect(link.url);
  } catch (error) {
    console.log(error);
  }
};

export const getShortCodeEdit = async (req , res ) => {
  
  const { data : id , error} = z.coerce.number().int().safeParse(req.params.id);
  if(error) {
    return res.redirect("/404");
  }
  
  try {
    const [shortLink] = await getShortLinkById(id);
    if (!shortLink) return res.redirect("/404");
    res.render("editShortLink" , {
      id: shortLink.id,
      url: shortLink.url,
      shortCode: shortLink.shortCode,
      errors: req.flash("errors")
    })
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
}


export const postShortCodeEdit = async ( req , res ) => {
  
  const { data , error } = shortnerValidation.safeParse(req.body);
  if(error){
    const errors = error.issues[0].message;
    req.flash("errors" , errors);
   return res.redirect("/");
  }

  const { url , shortCode } = data;

  const { data : id , error : errors } = z.coerce.number().int().safeParse(req.params.id);
  if(errors) {
    console.log(errors); 
    return res.redirect("/404");
  } 
  
  try {
   await getUpdatedShortCode({id , url , shortCode})
   req.flash("success", "Short Code updated successfully!");
    res.redirect("/");
  } catch (error) {
    if(error.code === 'ER_DUP_ENTRY' || error.cause?.code === 'ER_DUP_ENTRY'){
      req.flash("errors" , "Short code already exists. Try another one!");
      return res.redirect(`/edit/${id}`);
    }
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
}


