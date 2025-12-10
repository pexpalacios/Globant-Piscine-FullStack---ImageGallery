import { useState,useEffect, useRef } from 'react'
import './App.css'

function App() {
  	const [photos, setPhotos] = useState([]);
  	const [query, setQuery] = useState("");
  	const [page, setPage] = useState(1);
  	const [dark, setDark] = useState(false);
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<any>(null);

  	const galleryRef = useRef(null);

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
      			return []; // evita crash de JSON.parse
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

	const logout = async () => 
	{
  		await fetch("/auth/logout", {method: "POST", credentials: "include"});
  		setUser(null);
	};

  // --- NAVIGATION BUTTONS
  const prevPage = () => {
    if (page > 1)
      setPage((prev) => prev - 1);
  };
  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  // --- DARK MODE
  useEffect(() => {
	document.documentElement.classList.toggle("dark", dark);
  }, [dark])


  return (
    <div className={`min-h-screen ${dark ? "bg-mainbg-dark text-text-dark" : "bg-mainbg-light text-text-light" }`}>
    {/* Top Bar */}
      	<div className="mx-auto p-3 flex flex-row min-h-[100px] items-center gap-x-4 bg-blockbg-light dark:bg-blockbg-dark">
        <a href="https://unsplash.com/" target="_blank" className="basis-3xs shrink-0">
        	<img src="https://www.svgrepo.com/show/315538/unsplash.svg" alt="Unsplash logo" 
			className="size-12"/>
		    <div className="basis-2sx ">Using Unsplash API</div>
		</a>
        <h1 className="basis-xl flex-grow text-4xl font-bold font-mono text-text-light dark:text-text-dark">Image Gallery</h1>
        <div className="p-3 rounded-sm hover:bg-btnhover-light focus:outline-2 focus:outline-offset-2 bg-btnbg-light text-text-light dark:bg-btnbg-dark dark:text-text-dark">
			{token ? (
			<button onClick={() => logout()}>Log Out</button>) : (
			<button onClick={() => login()}>Log In</button>)}
		</div>
		<button onClick={() => setDark((prev) => !prev)}
          className="basis-4xs p-3 rounded-full hover:bg-btnhover-light focus:outline-2 focus:outline-offset-2 bg-btnbg-light text-text-light dark:bg-btnbg-dark dark:text-text-dark dark:hover:bg-btnhover-dark">
          {dark ? "light" : "dark"}
        </button>
      	</div>
    {/* Main Content */}
    	<div className="flex flex-row-reverse flex-wrap p-4">
    {/* Header */}
      		<div className="basis-3/4 flex flex-col flex-auto max-h-[2200px] w-full">
        		<div className="mb-4 w-full">
    {/* Search Bar */}
          			<div className="flex flex-wrap justify-center items-center p-4 bg-blockbg-light dark:bg-blockbg-dark">
            	<form className="p-3 flex basis-2/3" onSubmit={handleSearch}>
          <input type="text" placeholder="Search photos..." 
          value={query} onChange={(e) => setQuery(e.target.value)}
			className="p-2 rounded-l-sm bg-blocksec-light dark:bg-blocksec-dark"/>
          <button type="submit" className="p-3 rounded-sm hover:bg-btnhover-light focus:outline-2 focus:outline-offset-2 bg-btnbg-light text-text-light dark:bg-btnbg-dark dark:text-text-dark dark:hover:bg-btnhover-dark">
            Search
          </button>
        		</form>
        {/* Navigation Buttons */}
        				<div className="flex gap-2 basis-1/3 flex-row-reverse">
        		<button onClick={nextPage} 
				className="p-3 rounded-sm hover:bg-btnhover-light focus:outline-2 focus:outline-offset-2 bg-btnbg-light text-text-light dark:bg-btnbg-dark dark:text-text-dark dark:hover:bg-btnhover-dark">
        			Next
        		</button>
        		<button onClick={prevPage}
        		className="p-3 rounded-sm hover:bg-btnhover-light focus:outline-2 focus:outline-offset-2 bg-btnbg-light text-text-light dark:bg-btnbg-dark dark:text-text-dark dark:hover:bg-btnhover-dark">
        			Prev
        		</button>
        				</div>
        			</div>
        {/* Gallery */}
					<div className="p-3 bg-blockbg-light dark:bg-blockbg-dark">
        				<div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-6 gap-3 p-3 rounded-md bg-blocksec-light dark:bg-blocksec-dark"
        ref={galleryRef}>
  		{photos.map((photo: any) => (
    		<div key={photo.id} className="relative mb-3 break-inside-avoid">
     		 	<img src={photo.urls.small} alt={photo.alt_description || ""}
        		className="rounded-lg w-full block hover:drop-shadow-[0_0_2em_#fafbffaa] transition-all"/>
    			<button className="absolute bottom-2 right-2 rounded-full p-2 shadow
                	hover:scale-110 transition-transform">
        			<i className="fa-solid fa-star text-text-light text-sm"></i>
     		 	</button>
    		</div>
  ))}
		  				</div>
        			</div>

      			</div>
    		</div>
    	</div>
  	</div>
  );
}

export default App
