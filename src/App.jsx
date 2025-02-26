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
import AuthedRoute from "./guards/AuthedRoute/AuthedRoute.jsx";
import UnAuthedRoute from "./guards/UnAuthedRoute/UnAuthedRoute.jsx";
import ReviewsContextProvider from "./context/Reviews/ReviewsContextProvider.jsx";
import AvatarContextProvider from "./context/Avatar/AvatarContextProvider.jsx";
import Footer from "./components/Footer/footer.jsx";
import { Analytics } from "@vercel/analytics/react";
function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Analytics />
      <Footer />
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
                      <UnAuthedRoute>
                        <SingUp />
                      </UnAuthedRoute>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <UnAuthedRoute>
                        <SingIn />
                      </UnAuthedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <AuthedRoute>
                        <Profile />
                      </AuthedRoute>
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
