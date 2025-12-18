// ------ CUSTOM CSS -------
import './App.css';

// ------ BOOTSTRAP CSS -------
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { Routes, Route, useLocation } from 'react-router-dom';
import { useState } from "react";

// ------ COMPONENTS -------
import Header from './Component/Header';
import Footer from './Component/Footer';

// ------ USER PAGES -------
import Home from './Pages/Home';
import Product from './Pages/Product';
import Brand from './Pages/Brand';
import Collection from './Pages/Collection';
import About from './Pages/About';
import Deliver from './Pages/Deliver';
import Trackorder from './Pages/Trackorder';
import ReturnnRefund from './Pages/ReturnnRefund';
import Wishlist from './Pages/Wishlist';
import Account from './Pages/Account';
import Addtocart from './Pages/Addtocart';
import AgeGate from './Pages/AgeGate';
import Faq from './Pages/Faq';
import Error404 from './Pages/Error404';
import Shop from './Pages/Shop';

function App() {

  const location = useLocation(); // 👈 important

  const [allowed, setAllowed] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const handleConfirm = () => {
    setAllowed(true);
  };

  const handleDeny = () => {
    window.location.href = "https://www.google.com";
  };

  // 👇 Footer hide logic
  const hideFooterRoutes = ["/account"];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <div>

      {!shouldHideFooter && <Header cartCount={cartCount} />}


      {!allowed && <AgeGate onConfirm={handleConfirm} onDeny={handleDeny} />}

      {allowed && (
        <Routes>
          <Route path='/' element={<Home setCartCount={setCartCount} />} />
          <Route path='/product' element={<Product setCartCount={setCartCount} />} />

          <Route path="/brand" element={<Brand />} />
          <Route path="/brand/:brandSlug" element={<Product setCartCount={setCartCount} />} />

          <Route path="/collection" element={<Collection />} />
          <Route path="/collection/:collectionSlug" element={<Product setCartCount={setCartCount} />} />

          <Route path='/about-us' element={<About />} />
          <Route path='/how-we-deliver' element={<Deliver />} />
          <Route path='/track-my-order' element={<Trackorder />} />
          <Route path='/return-&-refund' element={<ReturnnRefund />} />
          <Route path='/wishlist' element={<Wishlist />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/account' element={<Account />} />
          <Route path='/add-to-cart' element={<Addtocart />} />
          <Route path='/faq' element={<Faq />} />
          <Route path='/*' element={<Error404 />} />
        </Routes>
      )}

      {/* Footer hidden only on /account */}
      {!shouldHideFooter && <Footer />}

    </div>
  );
}

export default App;
