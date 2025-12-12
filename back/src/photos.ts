//manage photo routes like get and search
import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = Router();
const CLIENT_ID = process.env.VITE_UNSPLASH_ACCESS_KEY!;

// Fetch photos
router.get("/", async (req, res) => 
{
	try 
	{
		const page = Number(req.query.page ?? 1);
		const per_page = Number(req.query.per_page ?? 24);

		const response = await axios.get("https://api.unsplash.com/photos", {
	 		params: { page, per_page, client_id: CLIENT_ID },
		});

		res.json(response.data);
	} 
	catch (error: any) 
	{
		console.error("Fetch photos error:", error?.response?.data ?? error.message ?? error);
		res.status(500).json({ ok: false, message: "Error fetching photos" });
	}
});

//Search function
router.get("/search", async (req, res) => 
{
	try 
	{
		const query = String(req.query.query || "");
		if (!query) 
			return res.status(400).json({ ok: false, message: "Query required" });

		const page = Number(req.query.page ?? 1);
		const per_page = Number(req.query.per_page ?? 24);

		const response = await axios.get("https://api.unsplash.com/search/photos", {
			params: { query, page, per_page, client_id: CLIENT_ID }
		});

		res.json(response.data);
	} 
	catch (error: any) 
	{
		console.error("Search error:", error?.response?.data ?? error.message ?? error);
		res.status(500).json({ ok: false, message: "Error searching photos" });
	}
});

export default router;