import { Link } from "react-router-dom"
import { FaArrowRightLong } from "react-icons/fa6";
import { MdFemale, MdOutlineMale, MdOutlineWaterDrop } from "react-icons/md";
import { IoMdHeartEmpty } from "react-icons/io";
import { FiHeart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import React, { useState } from "react";

const Home = ({ setCartCount }) => {

    const products = [
        {
            id: 1,
            name: "Nova Touch X",
            subtitle: "Dual stimulation, app enabled",
            price: 129,
            rating: 4.9,
            reviews: 128,
            tag: "BEST SELLER",
            image: require('../../Img/t1.png'),
        },
        {
            id: 2,
            name: "Silk Embrace",
            subtitle: "Luxury couple's massager",
            price: 89,
            rating: 4.7,
            reviews: 84,
            image: require('../../Img/t2.png'),
        },
        {
            id: 3,
            name: "Midnight Wand",
            subtitle: "High power, whisper quiet",
            price: 149,
            rating: 5.0,
            reviews: 21,
            tag: "NEW",
            image: require('../../Img/t3.png'),
        },
        {
            id: 4,
            name: "Pure Glide",
            subtitle: "Water-based organic lubricant",
            price: 24,
            rating: 4.8,
            reviews: 340,
            image: require('../../Img/t4.png'),
        },
    ];

    const [wishlist, setWishlist] = useState([]);

    const addToCart = () => {
        setCartCount(prev => prev + 1);
    };

    const toggleWishlist = (id) => {
        setWishlist(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    return (
        <div className="home">
            <div className="home-page-container">

                <section className="hero-banner">
                    <Link to='/shop'>
                        <img className="d-md-block d-none" src={require('../../Img/homebanner.jpg')} alt="" />
                        <img className="d-md-none" src={require('../../Img/homebanner2.jpg')} alt="" />
                    </Link>
                </section>

                <section className="category">
                    <div className="container">
                        <div className="row" data-aos="fade-right">
                            <div className="col">
                                <h3 className="text-capitalize m-0">shop by category</h3>
                            </div>
                            <div className="col text-end">
                                <Link to='/product'>
                                    <button className="text-capitalize">view all <FaArrowRightLong /></button>
                                </Link>
                            </div>
                        </div>
                        <div className="row mt-4 gy-4">
                            <div className="col-12 col-sm-6 col-lg-3" data-aos="zoom-in">
                                <Link to='#'>
                                    <div className="box">
                                        <div className="logo">
                                            <MdOutlineMale size={30} />
                                        </div>
                                        <h6 className="gender text-capitalize">for him</h6>
                                        <div className="title text-capitalize">strokers & rings</div>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-12 col-sm-6 col-lg-3" data-aos="zoom-in">
                                <Link to='#'>
                                    <div className="box">
                                        <div className="logo">
                                            <MdFemale size={30} />
                                        </div>
                                        <h6 className="gender text-capitalize">for her</h6>
                                        <div className="title text-capitalize">vibrators & wands</div>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-12 col-sm-6 col-lg-3" data-aos="zoom-in">
                                <Link to='#'>
                                    <div className="box">
                                        <div className="logo">
                                            <IoMdHeartEmpty size={30} />
                                        </div>
                                        <h6 className="gender text-capitalize">couples</h6>
                                        <div className="title text-capitalize">shared pleasure</div>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-12 col-sm-6 col-lg-3" data-aos="zoom-in">
                                <Link to='#'>
                                    <div className="box">
                                        <div className="logo">
                                            <MdOutlineWaterDrop size={30} />
                                        </div>
                                        <h6 className="gender text-capitalize">lubricants</h6>
                                        <div className="title text-capitalize">oils & gels</div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="trend">
                    <div className="container">
                        <div className="d-flex justify-content-between align-items-center mb-4" data-aos="fade-right">
                            <div>
                                <h3 className="section-title text-black">Trending Now</h3>
                                <p className="section-subtitle">
                                    The most coveted items this week.
                                </p>
                            </div>
                        </div>

                        <div className="row g-4">
                            {products.map(product => (
                                <div
                                    key={product.id}
                                    className="col-12 col-sm-6 col-md-4 col-lg-3"
                                >
                                    <div className="product-card h-100"  data-aos="flip-down">
                                        <div className="product-img">
                                            {product.tag && (
                                                <span className="badge-tag">{product.tag}</span>
                                            )}

                                            <button
                                                className={`wishlist-btn ${wishlist.includes(product.id) ? "active" : ""
                                                    }`}
                                                onClick={() => toggleWishlist(product.id)}
                                            >
                                                <FiHeart />
                                            </button>

                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="img-fluid"
                                            />

                                            <button
                                                className="add-cart-btn"
                                                onClick={addToCart}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>

                                        <div className="product-info">
                                            <h5>{product.name}</h5>
                                            <p>{product.subtitle}</p>

                                            <div className="price-rating">
                                                <span className="price">${product.price}.00</span>

                                                <span className="rating">
                                                    <FaStar /> {product.rating}
                                                    <small>({product.reviews})</small>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="offer" data-aos="fade-down-left">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <div className="bg-img">
                                    <div className="content ms-3 ms-md-5">

                                        <h6 className="text-uppercase">limited time offer</h6>
                                        <h2 className="text-capitalize">unlock your <br /> deepest desires</h2>
                                        <p>Join over 50,000 happy customers who have discovered their perfect match. Get 20% off your first discreet order.</p>
                                        <button>explore best seller</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    )
}

export default Home;
