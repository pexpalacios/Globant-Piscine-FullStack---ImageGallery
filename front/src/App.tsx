import { useState,useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [photos, setPhotos] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [dark, setDark] = useState(false);

  const accessKey = "access_key";
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
        // else
        //   setPhotos((prev) => [...prev, ...results]);
      });
  };

  useEffect(() => {
    fetchPhotos(true);
  }, []);

    useEffect(() => {
    fetchPhotos(true);
  }, [page]);

  // ---- BUSCAR NUEVAS FOTOS ----
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPhotos(true);
  };

  // ---- AVIGATION BUTTONS ----
  const prevPage = () => {
    if (page > 1)
      setPage((prev) => prev - 1);
  };
  const nextPage = () => {
    setPage((prev) => prev + 1);
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
        <button onClick={() => setDark((prev) => !prev)} 
          className="basis-4xs p-3 rounded-full hover:bg-btnhover-light focus:outline-2 focus:outline-offset-2 bg-btnbg-light text-text-light dark:bg-btnbg-dark dark:text-text-dark dark:hover:bg-btnhover-dark">
          {dark ? "light" : "dark"}
        </button>
      	</div>
    {/* Main Content */}
    	<div className="flex flex-row-reverse flex-wrap p-4">
	{/* Sidebar */}
    		<div className="basis-1/4 flex flex-col flex-none items-center p-3">
        		<img src="https://i.pinimg.com/736x/2f/15/f2/2f15f2e8c688b3120d3d26467b06330c.jpg" alt="Unsplash logo" 
			className="size-64"/>
        		<div className="flex-grow text-balance text-md text-center font-mono">Log in with your Unsplash account to save images to your favourtes
				</div>
        		<button className="p-3 rounded-sm hover:bg-btnhover-light focus:outline-2 focus:outline-offset-2 bg-btnbg-light text-text-light dark:bg-btnbg-dark dark:text-text-dark">
          			Login
        		</button>
   			</div>
    {/* Header */}
      		<div className="basis-3/4 flex flex-col flex-auto max-h-[2200px] w-full">
        		<div className="mb-4 w-full">
    {/* Search Bar */}
          			<div className="flex flex-wrap justify-center items-center p-4 bg-blockbg-light dark:bg-blockbg-dark">
            	<form className="p-3 flex basis-2/3" onSubmit={handleSearch}>
          <input type="text" placeholder="Search photos..." 
          value={query} onChange={(e) => setQuery(e.target.value)}
			className="p-2 bg-slate-300 dark:bg-slate-600 rounded-l-sm"/>
          <button type="submit" className="p-3 rounded-sm hover:bg-btnhover-light focus:outline-2 focus:outline-offset-2 bg-btnbg-light text-text-light dark:bg-btnbg-dark dark:text-text-dark dark:hover:bg-btnhover-dark">
            Search
          </button>
        		</form>
        {/* Navigation Buttons */}
        				<div className="flex gap-2 basis-1/3 flex-row-reverse">
        		<button onClick={prevPage}
        		className="p-3 rounded-sm hover:bg-btnhover-light focus:outline-2 focus:outline-offset-2 bg-btnbg-light text-text-light dark:bg-btnbg-dark dark:text-text-dark dark:hover:bg-btnhover-dark">
        			Prev
        		</button>
        		<button onClick={nextPage} 
				className="p-3 rounded-sm hover:bg-btnhover-light focus:outline-2 focus:outline-offset-2 bg-btnbg-light text-text-light dark:bg-btnbg-dark dark:text-text-dark dark:hover:bg-btnhover-dark">
        			Next
        		</button>
        				</div>
        			</div>
        {/* Gallery */}
					<div className="p-3 bg-blockbg-light dark:bg-blockbg-dark">
        				<div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-6 gap-3 p-3 rounded-md bg-slate-300 dark:bg-slate-600"
        ref={galleryRef}>
          {photos.map((photo: any) => (
            <img key={photo.id} src={photo.urls.small} alt={photo.alt_description || ""}
            className="aspect-auto mb-3 rounded-lg block hover:drop-shadow-[0_0_2em_#fafbffaa] transition-all"/>
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
