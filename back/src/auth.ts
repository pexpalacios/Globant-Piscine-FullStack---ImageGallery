//manage oauth routes > /authorize, /callback, /user, /logout
import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = Router();
const CLIENT_ID = process.env.VITE_UNSPLASH_ACCESS_KEY!;
const CLIENT_SECRET = process.env.VITE_UNSPLASH_SECRET_KEY!;
const REDIRECT_URI = process.env.VITE_REDIRECT_URI!;

//Redirect user to auth page
router.get("/authorize", (req, res) => 
{
	const url = new URL("https://unsplash.com/oauth/authorize");
	url.searchParams.set("client_id", CLIENT_ID);
	url.searchParams.set("redirect_uri", REDIRECT_URI);
	url.searchParams.set("response_type", "code");
	url.searchParams.set("scope", "public");
	res.redirect(url.toString());
});

//Exchange code and token fro access
router.get("/callback", async (req, res) => 
{
	const { code } = req.query;

	if (!code)
		return (res.status(400).send("Missing code"));

	try 
	{
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

		res.redirect(`${process.env.FRONTEND_URL}/user`);
	} 
	catch (err: any) 
	{
		console.error("Exchange error:", err?.response?.data ?? err.message ?? err);
		res.status(500).json({ ok: false, message: "Error exchanging token with Unsplash" });
	}
	
});

//Get logged in user
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

//Logout
router.get("/logout", (req, res) => 
{
	res.redirect(`${process.env.FRONTEND_URL}/`);
});

export default router;