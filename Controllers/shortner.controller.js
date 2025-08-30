import { saveToFile , getLinks , getShortLinks} from "../services/services.controller.js";


export const getShortenURL = async (req, res) => {
  const Links = await getLinks();
  const isLoggedIn = req.cookies.isLoggedIn;
  res.render("index", { Links, host: req.host , isLoggedIn });
};

export const shortener = async (req, res) => {
  const { url , shortCode } = req.body;
 const Links = await getShortLinks(shortCode);

 
  if (Links.length > 0) {
    return res.send(`
    <script>
      alert("Short code already exists. Try another one!");
      window.location.href = "/";
    </script>
  `);
  }

  await saveToFile({ url, shortCode });
  res.send(`
    <script>
      alert("URL shorten successfully!");
      window.location.href = "/";
    </script>
  `);
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


