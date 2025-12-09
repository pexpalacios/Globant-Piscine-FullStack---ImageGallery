import { useState,useEffect, useRef } from 'react'
import './App.css'

function App() {
  	const [photos, setPhotos] = useState([]);
  	const [query, setQuery] = useState("");
  	const [page, setPage] = useState(1);
  	const [dark, setDark] = useState(false);
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<any>(null);


  	const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
	const redirectUri = import.meta.env.VITE_REDIRECT_URI;
  	const galleryRef = useRef(null);

  // ---- PETICIÓN A UNSPLASH ----
  const fetchPhotos = (newSearch = false) => {
    const apiUrl = query
      ? `https://api.unsplash.com/search/photos?page=${page}&per_page=40&query=${query}&client_id=${accessKey}`
      : `https://api.unsplash.com/photos?page=${page}&per_page=40&client_id=${accessKey}`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const results = data.results || data;
        if (newSearch)
          setPhotos(results);
      });
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

  // --- LOGIN
const login = () => {
  const url = new URL("https://unsplash.com/oauth/authorize");
  url.searchParams.set("client_id", accessKey);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "public");

  console.log("Unsplash auth URL:", url.toString()); // comprueba en consola
  window.location.href = url.toString();
};

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) 
	return;
  console.log("Código recibido de Unsplash:", code);

    fetch('http://localhost:3000/exchange', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  })
    .then(response => response.json())
    .then(data => {
      console.log('Token:', data);
      // Store the token and handle the user data as needed
    });
}, []);


  const logout = () => {
  localStorage.removeItem("unsplash_token");
  setToken(null);
  setUser(null);
};


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
