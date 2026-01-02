// CUSTOM CSS
import './App.css';

// BOOTSTRAP CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// ANIMATION ON SCROLL CSS
import 'aos/dist/aos.css';
import AOS from "aos";

import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from "react";

// Layouts
import UserLayout from './Layout/UserLayout';
import AdminLayout from './Layout/AdminLayout';

// User Pages
import Home from './Pages/User/Home';
import Product from './Pages/User/Product';
import Brand from './Pages/User/Brand';
import Collection from './Pages/User/Collection';
import About from './Pages/User/About';
import Deliver from './Pages/User/Deliver';
import Trackorder from './Pages/User/Trackorder';
import ReturnnRefund from './Pages/User/ReturnnRefund';
import Wishlist from './Pages/User/Wishlist';
import Account from './Pages/User/Account';
import Addtocart from './Pages/User/Addtocart';
import AgeGate from './Pages/User/AgeGate';
import Faq from './Pages/User/Faq';
import Error404 from './Pages/User/Error404';
import Shop from './Pages/User/Shop';
import UserSettings from './Pages/User/UserSettings';
import Checkout from './Pages/User/Checkout';
import OrderSuccess from './Pages/User/OrderSuccess';

// Admin
import AdminDashboard from './Pages/Admin/AdminDashboard';
import User from './Pages/Admin/User';
import Coupen from './Pages/Admin/Coupen';
import CoupenEdit from './Pages/Admin/CoupenEdit';
import Inventory from './Pages/Admin/Inventory';
import Orders from './Pages/Admin/Orders';
import Payment from './Pages/Admin/Payment';
import ProductAdd from './Pages/Admin/ProductAdd';
import ReturnRefund from './Pages/Admin/ReturnRefund';
import ProductDetail from './Pages/User/ProductDetail';

// Protector
import AdminProtected from './Protected/AdminProtected';
// import UserProtected from './Protected/UserProtected';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-in-out",
      once: false,     // 🔥 IMPORTANT
      mirror: true,    // 🔥 animate again when scrolling up
      offset: 100,
    });

  }, []);
  const [cartCount, setCartCount] = useState(0);

  const [allowed, setAllowed] = useState(() => {
    // Read from localStorage on first render
    return localStorage.getItem("ageAllowed") === "true";
  });

  const handleConfirm = () => {
    localStorage.setItem("ageAllowed", "true"); // save once
    setAllowed(true);
  };

  const handleDeny = () => window.location.href = "https://www.google.com";

  if (!allowed) {
    return <AgeGate onConfirm={handleConfirm} onDeny={handleDeny} />;
  }

  return (
    <Routes>

      {/* USER LAYOUT (with Header + Footer) */}
      <Route element={<UserLayout />}>
        <Route path='/' element={<Home setCartCount={setCartCount} />} />
        <Route path='/product' element={<Product setCartCount={setCartCount} />} />
        <Route path='/product/:id' element={<ProductDetail />} />

        <Route path="/brand" element={<Brand />} />
        <Route path="/brand/:brandSlug" element={<Product setCartCount={setCartCount} />} />

        <Route path="/collection" element={<Collection />} />
        <Route path="/collection/:collectionSlug" element={<Product setCartCount={setCartCount} />} />

        <Route path='/about-us' element={<About />} />
        <Route path='/how-we-deliver' element={<Deliver />} />
        <Route path='/track-my-order' element={<Trackorder />} />
        <Route path='/return-&-refund' element={<ReturnnRefund />} />
        <Route path='/add-to-cart' element={<Addtocart />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/faq' element={<Faq />} />
        <Route path='/user-settings' element={<UserSettings />} />
        <Route path='/checkout' element={<Checkout />} />

      </Route>

      {/* ACCOUNT (NO HEADER / FOOTER) */}
      <Route path='/account' element={<Account />} />
      <Route path='/order-success' element={<OrderSuccess />} />

      {/* ADMIN (NO HEADER / FOOT<ER) */}
      <Route element={<AdminLayout />}>
        <Route path='/Admin-dashboard' element={<AdminProtected><AdminDashboard /></AdminProtected>} />
        <Route path='/Admin-dashboard/product-add' element={<AdminProtected><ProductAdd /></AdminProtected>} />
        <Route path='/Admin-dashboard/inventory' element={<AdminProtected><Inventory /></AdminProtected>} />
        <Route path='/Admin-dashboard/orders' element={<AdminProtected><Orders /></AdminProtected>} />
        <Route path='/Admin-dashboard/users' element={<AdminProtected><User /></AdminProtected>} />
        <Route path='/Admin-dashboard/coupen' element={<AdminProtected><Coupen /></AdminProtected>} />
        <Route path='/Admin-dashboard/coupen-edit' element={<AdminProtected><CoupenEdit /></AdminProtected>} />
        <Route path='/Admin-dashboard/payments' element={<AdminProtected><Payment /></AdminProtected>} />
        <Route path='/Admin-dashboard/return-and-refund' element={<AdminProtected><ReturnRefund /></AdminProtected>} />
      </Route>

      {/* <Route element={<AdminLayout />}>
        <Route path='/Admin-dashboard' element={<AdminDashboard />} />
        <Route path='/Admin-dashboard/product-add' element={<ProductAdd />} />
        <Route path='/Admin-dashboard/inventory' element={<Inventory />} />
        <Route path='/Admin-dashboard/orders' element={<Orders />} />
        <Route path='/Admin-dashboard/users' element={<User />} />
        <Route path='/Admin-dashboard/coupen' element={<Coupen />} />
        <Route path='/Admin-dashboard/coupen-edit' element={<CoupenEdit />} />
        <Route path='/Admin-dashboard/payments' element={<Payment />} />
        <Route path='/Admin-dashboard/return-and-refund' element={<ReturnRefund />} />
      </Route> */}


      <Route path='/*' element={<Error404 />} />

    </Routes>

  );
}

export default App;
