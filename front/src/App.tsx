import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import HomePage from './pages/home.tsx'
import UserPage from './pages/user.tsx'
import FavPage from './pages/favourites.tsx'

function App() {
  return (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<HomePage />}/>
			<Route path="/user" element={<UserPage />}/>
			<Route path="/user/favourites" element={<FavPage />}/>;
		</Routes>
	</BrowserRouter>
  );
}

export default App
