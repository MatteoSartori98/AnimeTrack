import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home/home";
import SearchResults from "./pages/Search/searchResults";
import { Outlet } from "react-router";
import Navbar from "./components/Navbar/navbar";
import Detail from "./pages/Detail/detail.jsx";
import SingUp from "./pages/Authentication/SignUp.jsx";
import SingIn from "./pages/Authentication/SignIn.jsx";
import SessionContextProvider from "./context/SessionContextProvide.jsx";
import Profile from "./pages/Profile/profile.jsx";

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
    <SessionContextProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/register" element={<SingUp />} />
            <Route path="/login" element={<SingIn />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SessionContextProvider>
  );
}

export default App;
