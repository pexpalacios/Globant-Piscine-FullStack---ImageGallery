//manage photo routes like get and search
import { Router } from "express";
import axios from "axios";

const router = Router();

const CLIENT_ID = process.env.VITE_UNSPLASH_CLIENT_ID!;

// feth photos
router.get("/", async (req, res) => 
{
	try 
	{
    	const page = Number(req.query.page ?? 1);
    	const per_page = Number(req.query.per_page ?? 40);

    	const access_token = req.cookies.access_token;

    	const headers = access_token
      		? { Authorization: `Bearer ${access_token}` }
      		: { Authorization: `Client-ID ${CLIENT_ID}` };

    	const response = await axios.get("https://api.unsplash.com/photos", {
     		params: { page, per_page },
      		headers
    	});

    	res.json(response.data);
  } 
  catch (error: any) 
  {
    	console.error("Fetch photos error:", error?.response?.data ?? error.message ?? error);
    	res.status(500).json({ ok: false, message: "Error fetching photos" });
  }
});

//search function
router.get("/search", async (req, res) => 
{
	try 
	{
    	const query = String(req.query.query || "");
    	if (!query) 
			return res.status(400).json({ ok: false, message: "Query required" });

		const page = Number(req.query.page ?? 1);
		const per_page = Number(req.query.per_page ?? 40);

		const access_token = req.cookies.access_token;
		const headers = access_token
      		? { Authorization: `Bearer ${access_token}` }
      		: { Authorization: `Client-ID ${CLIENT_ID}` };

		const response = await axios.get("https://api.unsplash.com/search/photos", {
			params: { query, page, per_page },
			headers
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