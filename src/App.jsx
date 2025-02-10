import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/Layout/layout";
import Home from "./pages/Home/home";
import Anime from "./pages/Anime/anime";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/detail/:id" element={<Anime />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
