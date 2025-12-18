import Header from "../Component/Header";
import Footer from "../Component/Footer";
import { Outlet } from "react-router-dom";

const UserLayout = ({ cartCount }) => {
  return (
    <>
      <Header cartCount={cartCount} />
      <Outlet />
      <Footer />
    </>
  );
};

export default UserLayout;
