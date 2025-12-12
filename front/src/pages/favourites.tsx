import { useState, useEffect } from 'react'
import logo from '../assets/unsplash.svg'
import { useFunctionalities	} from '../functionalities.tsx'

export default function FavPage() {

	const {
	query,
	galleryRef,
	dark,
	setQuery,
	nextPage,
	prevPage,
	handleSearch,
	logout,
	setDark,
	goBack
	} = useFunctionalities();

	const [photos, setPhotos] = useState([]);
	const fetchPhotos = (newSearch = false) => 
	{
		const favs = JSON.parse(localStorage.getItem("favourites") || "[]");
		setPhotos(favs);
	};

	const rmFav = (id: string) => 
	{
		const favs = JSON.parse(localStorage.getItem("favourites") || "[]");
		const updated = favs.filter((p: any) => p.id !== id);

		localStorage.setItem("favourites", JSON.stringify(updated));
		setPhotos(updated);
	};

	useEffect(() => {
		fetchPhotos(true);
	}, []);

	return (
		<div className={`min-h-screen ${dark ? "bg-mainbg-dark text-text-dark" : "bg-mainbg-light text-text-light" }`}>
	{/* Top Bar */}
		<div className="mx-auto p-3 flex flex-row min-h-[100px] items-center gap-x-4 bg-blockbg-light dark:bg-blockbg-dark">
		<a href="https://unsplash.com/" target="_blank" className="basis-1/5 flex flex-wrap items-start gap-2">
			<img  src={logo} alt="Unsplash logo" 
			className="size-8 md:size-12 lg:size-16"/>
			<div className="text-2xs md:size-4 lg:size-8 font-mono">Using Unsplash API</div>
		</a>
		<h1 className="basis-2/5 flex-grow text-4xl font-bold font-mono text-text-light dark:text-text-dark">Image Gallery</h1>
		<button onClick={() => logout()} className="basis-1/6 p-3 rounded-full hover:bg-btnhover-light focus:outline-2 focus:outline-offset-2 bg-btnbg-light text-text-light dark:bg-btnbg-dark dark:text-text-dark dark:hover:bg-btnhover-dark">Log Out</button>
		<button onClick={() => setDark((prev) => !prev)}
			className="basis-1/5 p-3 rounded-full hover:bg-btnhover-light focus:outline-2 focus:outline-offset-2 bg-btnbg-light text-text-light dark:bg-btnbg-dark dark:text-text-dark dark:hover:bg-btnhover-dark">
			<i className="fa-solid fa-sun"></i>	|	<i className="fa-solid fa-moon"></i>
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
					&gt;
				</button>
				<button onClick={prevPage}
				className="p-3 rounded-sm hover:bg-btnhover-light focus:outline-2 focus:outline-offset-2 bg-btnbg-light text-text-light dark:bg-btnbg-dark dark:text-text-dark dark:hover:bg-btnhover-dark">
					&lt; 
				</button>
				<button onClick={goBack} 
				className="p-3 rounded-sm hover:bg-btnhover-light focus:outline-2 focus:outline-offset-2 bg-btnbg-light text-text-light dark:bg-btnbg-dark dark:text-text-dark dark:hover:bg-btnhover-dark">
					Go back
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
				className="rounded-lg w-full block "/>
				<button onClick={() => rmFav(photo.id)} 
					className="absolute bottom-2 right-2 rounded-full p-2 hover:scale-120 active:bg-text-dark transition-all">
					<span className="flex justify-center items-center rounded-full h-8 w-8 text-sm text-text-dark border-text-dark border-2 bg-blocksec-dark"><i className="fa-solid fa-star"></i></span>
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