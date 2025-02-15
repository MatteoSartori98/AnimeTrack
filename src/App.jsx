import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home/home";
// import Anime from "./pages/Anime/anime";
import SearchResults from "./pages/Search/searchResults";
import { Outlet } from "react-router";
import Navbar from "./components/Navbar/navbar";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          {/* <Route path="/detail/:id" element={<Anime />} /> */}
          <Route path="/search" element={<SearchResults />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
