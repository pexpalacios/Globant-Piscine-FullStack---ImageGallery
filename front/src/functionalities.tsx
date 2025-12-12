import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export function useFunctionalities() {
	const [photos, setPhotos] = useState([]);
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);
	const [dark, setDark] = useState(false);
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<any>(null);

	const galleryRef = useRef(null);
	const navigate = useNavigate();

	// ---- PETICIÓN A UNSPLASH ----
	const fetchPhotos = (newSearch = false) => 
	{
		const base = "/api/photos";
		const endpoint = query ? `${base}/search?query=${encodeURIComponent(query)}&page=${page}` : `${base}?page=${page}`;

		fetch(endpoint, {credentials: "include"})
		.then(async res => 
		{
			if (!res.ok) 
			{
				const text = await res.text();
				console.error("Backend error:", res.status, text);
				return [];
			}
			return res.json();
		})
		.then(data => setPhotos(data.results || data))
		.catch(err => console.error(err));
		};

	useEffect(() => {
			fetchPhotos(true);
	}, []);

	useEffect(() => {
		fetchPhotos(true);
	}, [page]);

	// --- SEARCH FUNCTION
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setPage(1);
		fetchPhotos(true);
	};

	// --- LOGIN
	const login = () => 
	{
		window.location.href = "/auth/authorize";
	};

	const logout = () => 
	{
		window.location.href = "/auth/logout";
	};

	// --- NAVIGATION BUTTONS
	const prevPage = () => {
		if (page > 1)
			setPage((prev) => prev - 1);
	};
	const nextPage = () => {
		setPage((prev) => prev + 1);
	};

	const favPage = () => {
		navigate("/user/favourites");
	};

	const goBack = () => {
		navigate("/user");
	}

	// --- DARK MODE
	useEffect(() => {
		document.documentElement.classList.toggle("dark", dark);
	}, [dark])

	return {
		photos,
		setPhotos,
		query,
		setQuery,
		page,
		setPage,
		dark,
		setDark,
		token,
		setToken,
		user,
		setUser,
		galleryRef,
		fetchPhotos,
		handleSearch,
		login,
		logout,
		prevPage,
		nextPage,
		favPage,
	goBack
	};
}
