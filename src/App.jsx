import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home/home";
import SearchResults from "./pages/Search/searchResults";
import { Outlet } from "react-router";
import Navbar from "./components/Navbar/navbar";
import Detail from "./pages/Detail/detail.jsx";
import SingUp from "./pages/Authentication/SignUp.jsx";
import SingIn from "./pages/Authentication/SignIn.jsx";
import SessionContextProvider from "./context/Session/SessionContextProvide.jsx";
import Profile from "./pages/Profile/profile.jsx";
import FavContextProvider from "./context/Favourites/FavouritesContextProvider.jsx";
import ProtectedRoute from "./components/ProtectedRoute/protectedRoute.jsx";
import PublicRoute from "./components/PublicRoute/publicRoute.jsx";
import ReviewsContextProvider from "./context/Reviews/ReviewsContextProvider.jsx";
import AvatarContextProvider from "./context/Avatar/AvatarContextProvider.jsx";

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
      <AvatarContextProvider>
        <FavContextProvider>
          <ReviewsContextProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/detail/:id" element={<Detail />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <SingUp />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <SingIn />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                </Route>
              </Routes>
            </BrowserRouter>
          </ReviewsContextProvider>
        </FavContextProvider>
      </AvatarContextProvider>
    </SessionContextProvider>
  );
}

export default App;
