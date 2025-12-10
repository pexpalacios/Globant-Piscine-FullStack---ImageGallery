//manage oauth routes > /authorize, /exchange, /user, /logout
import { Router } from "express";
import axios from "axios";

const router = Router();

const CLIENT_ID = process.env.VITE_UNSPLASH_CLIENT_ID!;
const CLIENT_SECRET = process.env.VITE_UNSPLASH_CLIENT_SECRET!;
const REDIRECT_URI = process.env.VITE_REDIRECT_URI!;

//redirect user to auth page
router.get("/authorize", (req, res) => 
{
  const url = new URL("https://unsplash.com/oauth/authorize");
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "public");
  res.redirect(url.toString());
});

//exchange code fro token
router.post("/exchange", async (req, res) => 
{
  try 
  {
    	const { code } = req.body;
    	if (!code) 
			return res.status(400).json({ ok: false, message: "Code is required" });

    	const payload = {
      		client_id: CLIENT_ID,
      		client_secret: CLIENT_SECRET,
      		redirect_uri: REDIRECT_URI,
      		code,
     		grant_type: "authorization_code"
    	};

    	const tokenResp = await axios.post("https://unsplash.com/oauth/token", payload, {
     		headers: { "Content-Type": "application/json" }
    	});

    	const access_token = tokenResp.data.access_token;
    	if (!access_token) 
			return res.status(500).json({ ok: false, message: "No access token from Unsplash" });

    // cookie
    	res.cookie("access_token", access_token, {
      		httpOnly: true,
      		secure: process.env.NODE_ENV === "production",
    		sameSite: "lax",
    		maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
    	});

    // opcional: traer datos del usuario para devolverlos al frontend
    	const userResp = await axios.get("https://api.unsplash.com/me", {
      		headers: { Authorization: `Bearer ${access_token}` }
    	});

    	res.json({ ok: true, user: userResp.data });
  	} 
	catch (err: any) 
	{
    	console.error("Exchange error:", err?.response?.data ?? err.message ?? err);
    	res.status(500).json({ ok: false, message: "Error exchanging token with Unsplash" });
  	}
});

//get logged in user
router.get("/user", async (req, res) => 
{
	try 
	{
    	const token = req.cookies.access_token;
    	if (!token) 
			return res.status(401).json({ ok: false, message: "Not authenticated" });

		const userResp = await axios.get("https://api.unsplash.com/me", {
      		headers: { Authorization: `Bearer ${token}` }
    	});

    	res.json({ ok: true, user: userResp.data });
  	} 
	catch (err: any) 
	{
    	console.error("User error:", err?.response?.data ?? err.message ?? err);
    	res.status(500).json({ ok: false, message: "Error fetching user" });
  	}
});

//logout
router.post("/logout", (req, res) => 
{
  res.clearCookie("access_token", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  res.json({ ok: true });
});

export default router;