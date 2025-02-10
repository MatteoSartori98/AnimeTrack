import { Outlet } from "react-router";
import Navbar from "../Navbar/navbar";
export default function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
