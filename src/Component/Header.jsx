import { Link, NavLink } from "react-router-dom";
import { FiSearch, FiHeart, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { FaRegCircleUser } from "react-icons/fa6";
import { useState, useEffect, useRef } from "react";
import { IoIosArrowDown } from "react-icons/io";
import logo from "../Img/logo.png";
import f1 from '../Img/f1.svg'
import f2 from '../Img/f2.svg'
import f3 from '../Img/f3.svg'
import f4 from '../Img/f4.svg'
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";

const Header = ({ cartCount }) => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const [colOpen, setColOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const { user } = useCart();
  const { cart } = useCart();

  const navigate = useNavigate();

  const handleAccountClick = () => {
    if (user) {
      navigate("/user-settings"); // user is logged in
    } else {
      navigate("/account"); // user is not logged in
    }
  };

  console.log(setMegaOpen);

  const closeMobileMenu = () => {
    if (isMobile) {
      setMenuOpen(false);
      setBrandOpen(false);
      setColOpen(false);
      setFaqOpen(false);
    }
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
  console.log(megaOpen);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 991);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="main-header">
      <nav className="navbar navbar-expand-lg bg-white shadow-sm">
        <div className="container">

          {/* Logo */}
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="Logo" height="40" />
          </Link>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler"
            onClick={() => {
              setMenuOpen(prev => !prev);
              setBrandOpen(false);
              setColOpen(false);
              setFaqOpen(false);
            }}
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>


          <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
            <ul className="navbar-nav mx-auto">

              <li className="nav-item my-1 my-lg-0">
                <NavLink className="c-nav-link" to="/" onClick={closeMobileMenu}>Home</NavLink>
              </li>

              <li className="nav-item my-1 my-lg-0">
                <NavLink className="c-nav-link" to="/product" onClick={closeMobileMenu}>Product</NavLink>
              </li>

              <li
                className="nav-item mega-parent my-1 my-lg-0"
                onMouseEnter={() => !isMobile && setBrandOpen(true)}
                onMouseLeave={() => !isMobile && setBrandOpen(false)}>
                <span
                  className=" cursor-pointer d-flex justify-content-between"
                  onClick={() => {
                    if (!isMobile) return;
                    setBrandOpen(prev => !prev);
                    setColOpen(false);
                    setFaqOpen(false);
                  }}
                >
                  <NavLink to='/brand' onClick={closeMobileMenu} className='c-nav-link d-flex align-items-center' >
                    Brand <IoIosArrowDown className="d-lg-flex d-none ms-1" />
                  </NavLink>
                  {isMobile && (
                    <span className={`arrow ${brandOpen ? "rotate" : ""}`}>▾</span>
                  )}
                </span>

                <div className={`mega-menu ${brandOpen ? "open" : ""}`}>
                  <div className="container">
                    <div className="row text-lg-center">

                      <div className="p-0 col-md-3 col-12">
                        <Link to='/brand/durex' onClick={closeMobileMenu} className="text-uppercase m-0 my-1">durex</Link>
                      </div>

                      <div className="p-0 col-md-3 col-12">
                        <Link to='/brand/manforce' onClick={closeMobileMenu} className="text-uppercase m-0 my-1">manforce</Link>
                      </div>

                      <div className="p-0 col-md-3 col-12">
                        <Link to='/brand/mschief' onClick={closeMobileMenu} className="text-uppercase m-0 my-1">mschief</Link>
                      </div>

                      <div className="p-0 col-md-3 col-12">
                        <Link to='/brand/sensation' onClick={closeMobileMenu} className="text-uppercase m-0 my-1">sensation</Link>
                      </div>
                      <div className="p-0 col-md-3 col-12">
                        <Link to='/brand/skore' onClick={closeMobileMenu} className="text-uppercase m-0 my-1">skore</Link>
                      </div>
                      <div className="p-0 col-md-3 col-12">
                        <Link to='/brand/ramp' onClick={closeMobileMenu} className="text-uppercase m-0 my-1">ramp</Link>
                      </div>
                      <div className="p-0 col-md-3 col-12">
                        <Link to='/brand/iroha' onClick={closeMobileMenu} className="text-uppercase m-0 my-1">iroha</Link>
                      </div>

                    </div>
                  </div>
                </div>
              </li>


              <li
                className="nav-item mega-parent my-1 my-lg-0"
                onMouseEnter={() => !isMobile && setColOpen(true)}
                onMouseLeave={() => !isMobile && setColOpen(false)}>
                <span
                  className=" cursor-pointer d-flex justify-content-between align-items-center"
                  onClick={() => {
                    if (!isMobile) return;
                    setColOpen(prev => !prev);
                    setBrandOpen(false);
                    setFaqOpen(false);
                  }}
                >
                  <NavLink to='/collection' onClick={closeMobileMenu} className='c-nav-link d-flex align-items-center'>
                    Collection <IoIosArrowDown className="d-lg-flex d-none ms-1" />
                  </NavLink>
                  {isMobile && (
                    <span className={`arrow ${colOpen ? "rotate" : ""}`}>▾</span>
                  )}
                </span>

                <div className={`mega-menu ${colOpen ? "open" : ""}`}>
                  <div className="container">
                    <div className="row gy-4">

                      <div className="p-0 col-md-3 col-12 d-flex align-items-center">
                        <img src={require('../Img/c1.png')} alt="" />
                        <Link onClick={closeMobileMenu} to='/collection/new-arrivals' className="text-uppercase m-0 ms-4">new arrivals</Link>
                      </div>

                      <div className="p-0 col-md-3 col-12 d-flex align-items-center">
                        <img src={require('../Img/c2.png')} alt="" />
                        <Link onClick={closeMobileMenu} to='/collection/best-sellers' className="text-uppercase m-0 ms-4">best sellers</Link>
                      </div>

                      <div className="p-0 col-md-3 col-12 d-flex align-items-center">
                        <img src={require('../Img/c3.png')} alt="" />
                        <Link onClick={closeMobileMenu} to='/collection/deals' className="text-uppercase m-0 ms-4 ">deals</Link>
                      </div>

                      <div className="p-0 col-md-3 col-12 d-flex align-items-center">
                        <img src={require('../Img/c4.png')} alt="" />
                        <Link onClick={closeMobileMenu} to='/collection/feature-products' className="text-uppercase m-0 ms-4">featured products</Link>
                      </div>

                      <div className="p-0 col-md-3 col-12 d-flex align-items-center">
                        <img src={require('../Img/c5.png')} alt="" />
                        <Link onClick={closeMobileMenu} to='/collection/combos' className="text-uppercase m-0 ms-4">combos</Link>
                      </div>

                      <div className="p-0 col-md-3 col-12 d-flex align-items-center">
                        <img src={require('../Img/c6.png')} alt="" />
                        <Link onClick={closeMobileMenu} to='#' className="text-uppercase m-0 ms-4">shop under 1599</Link>
                      </div>

                      <div className="p-0 col-md-3 col-12 d-flex align-items-center">
                        <img src={require('../Img/c7.png')} alt="" />
                        <Link onClick={closeMobileMenu} to='#' className="text-uppercase m-0 ms-4">shop under 2599</Link>
                      </div>

                      <div className="p-0 col-md-3 col-12 d-flex align-items-center">
                        <img src={require('../Img/c8.png')} alt="" />
                        <Link onClick={closeMobileMenu} to='#' className="text-uppercase m-0 ms-4">shop under 5999</Link>
                      </div>

                    </div>
                  </div>
                </div>
              </li>

              <li className="nav-item my-1 my-lg-0">
                <NavLink className="c-nav-link" onClick={closeMobileMenu} to="/about-us">About</NavLink>
              </li>

              <li
                className="nav-item mega-parent my-1 my-lg-0"
                onMouseEnter={() => !isMobile && setFaqOpen(true)}
                onMouseLeave={() => !isMobile && setFaqOpen(false)}>
                <span
                  className=" cursor-pointer d-flex justify-content-between align-items-center"
                  onClick={() => {
                    if (!isMobile) return;
                    setFaqOpen(prev => !prev);
                    setBrandOpen(false);
                    setColOpen(false);
                  }}
                >
                  <NavLink to='/shop' onClick={closeMobileMenu} className='c-nav-link d-flex align-items-center'>
                    Shopping & FAQs <IoIosArrowDown className="d-lg-flex d-none ms-1" />
                  </NavLink>
                  {isMobile && (
                    <span className={`arrow ${faqOpen ? "rotate" : ""}`}>▾</span>
                  )}
                </span>

                <div className={`mega-menu ${faqOpen ? "open" : ""}`}>
                  <div className="container">
                    <div className="row gy-4">

                      <div className="p-0 col-md-3 col-12 d-flex align-items-center">
                        <img src={f1} alt="" />
                        <Link onClick={closeMobileMenu} to='/how-we-deliver' className="text-uppercase m-0 ms-4">how we deliver</Link>
                      </div>

                      <div className="p-0 col-md-3 col-12 d-flex align-items-center">
                        <img src={f2} alt="" />
                        <Link onClick={closeMobileMenu} to='/track-my-order' className="text-uppercase m-0 ms-4">track my order</Link>
                      </div>

                      <div className="p-0 col-md-3 col-12 d-flex align-items-center">
                        <img src={f3} alt="" />
                        <Link onClick={closeMobileMenu} to='/return-&-refund' className="text-uppercase m-0 ms-4 ">return & refunds</Link>
                      </div>

                      <div className="p-0 col-md-3 col-12 d-flex align-items-center">
                        <img src={f4} alt="" />
                        <Link onClick={closeMobileMenu} to='/faq' className="text-uppercase m-0 ms-4">FAQ</Link>
                      </div>

                    </div>
                  </div>
                </div>
              </li>

            </ul>

            {/* RIGHT ICONS */}
            <div className="header-icons d-flex align-items-center gap-3 position-relative my-1 my-lg-0 ms-2 ms-lg-0">

              {/* DESKTOP SEARCH */}
              {!isMobile && searchOpen && (
                <div ref={searchRef} className="desktop-search-box">
                  <input
                    type="text"
                    placeholder="Search products..."
                    autoFocus
                  />
                  <button onClick={() => setSearchOpen(false)}>
                    <FiX />
                  </button>
                </div>
              )}

              {/* SEARCH ICON */}
              <button
                className="btn p-0"
                onClick={() => setSearchOpen(prev => !prev)}
              >
                <FiSearch size={20} />
              </button>

              <Link onClick={closeMobileMenu} to="/wishlist"><FiHeart size={20} /></Link>
              {/* ACCOUNT ICON */}

              <button
                className="btn p-0 d-flex align-items-center"
                onClick={() => {
                  handleAccountClick();
                  closeMobileMenu();
                }}
              >
                {user ? (
                  <img
                    src={
                      user.profile
                        ? `http://localhost:9000${user.profile}`
                        : "/img/user.webp"
                    }
                    alt="profile"
                    className="rounded-circle header-profile-img"
                  />
                ) : (
                  <FaRegCircleUser size={20} />
                )}
              </button>

              <Link onClick={closeMobileMenu} to="/add-to-cart" className="position-relative">
                <FiShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="cart-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cart.length}
                  </span>
                )}
              </Link>
            </div>

          </div>
        </div>

      </nav>
      {/* MOBILE SEARCH BAR */}
      {isMobile && searchOpen && (
        <div className="mobile-search-wrapper">
          <div className="mobile-search-box">
            <input
              type="text"
              placeholder="Search products..."
              autoFocus
            />
            <button onClick={() => setSearchOpen(false)}>
              <FiX size={22} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
