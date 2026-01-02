import React, { useState, useEffect } from "react";
import { FaHeart, FaStar, FaFilter } from "react-icons/fa";
import { useParams, useLocation, Link } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import axios from "axios";

/* ------------------ PRODUCT CARD ------------------ */
const ProductCard = ({ product, onAddToCart }) => {
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const res = await axios.get("http://localhost:9000/wishlist", {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
        });
        const wishlistIds = res.data.wishlist.map((item) => item.id); // backend sends id from productId
        setInWishlist(wishlistIds.includes(product._id));
      } catch (err) {
        console.error("Wishlist fetch error:", err);
      }
    };
    checkWishlist();
  }, [product._id]);

  const toggleWishlist = async () => {
    try {
      const pid = product._id || product.id;
      if (!pid) {
        console.error("Cannot toggle wishlist: productId missing", product);
        return;
      }

      if (inWishlist) {
        await axios.delete(`http://localhost:9000/wishlist/${pid}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
        });
        setInWishlist(false);
      } else {
        await axios.post(
          "http://localhost:9000/wishlist-add",
          { productId: pid },
          { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
        );
        setInWishlist(true);
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err.response?.data || err);
    }
  };

  return (
    <div className="product-card" data-aos="fade-up">
      <Link to={`/product/${product.id}`}>
        <div className="product-image">
          {product.discount && (
            <span className="discount-badge text-uppercase">{product.discount}</span>
          )}
          <img
            src={product.images?.[0] || product.image}
            alt={product.title}
            className="img-fluid"
          />
          {product.freeLube && <span className="free-badge">Free Lube!</span>}
        </div>
        <div className="product-info pb-0">
          <small className="brand">{product.brand}</small>
          <h6>{product.title}</h6>
        </div>
      </Link>

      <div className="product-info pt-0">
        <div className="rating">
          <FaStar /> {product.rating || 0}.0
        </div>

        <div className="price">
          ₹{product.price}
          {product.oldPrice && <span className="ms-2 old-price">₹{product.oldPrice}</span>}
        </div>

        <div className="card-actions mt-2">
          <button
            className={`wishlist ${inWishlist ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist();
            }}
          >
            <FaHeart />
          </button>

          <button
            className="add-cart"
            onClick={(e) => {
              e.stopPropagation();

              if (product.stock <= 0) {
                alert("❌ Out of stock");
                return;
              }

              onAddToCart();
            }}
          >
            Add to cart
          </button>

        </div>
      </div>
    </div>
  );
};

/* ------------------ FILTER CONTENT ------------------ */
const FilterContent = ({ filters, setFilters, isMobile, onApply }) => {
  const [open, setOpen] = useState({
    gender: true,
    brand: false,
    price: false,
    condomType: false,
    usageType: false,
    suitableFor: false,
  });

  const toggle = (type) => {
    setOpen((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleCheck = (type, value) => {
    setFilters((prev) => {
      const exists = prev[type].includes(value);
      return {
        ...prev,
        [type]: exists ? prev[type].filter((v) => v !== value) : [...prev[type], value],
      };
    });
  };

  useEffect(() => {
    setOpen((prev) => ({ ...prev }));
  }, [filters]);

  return (
    <>
      <h6 className="mb-3">Filter</h6>

      {/* PRODUCT FOR */}
      <div className="filter-dropdown">
        <div className="filter-title" onClick={() => toggle("gender")}>
          Product For <span>{open.gender ? "−" : "+"}</span>
        </div>
        {open.gender && (
          <div className="filter-options">
            {["male", "female"].map((g) => (
              <label key={g}>
                <input
                  type="checkbox"
                  checked={filters.gender.includes(g)}
                  onChange={() => handleCheck("gender", g)}
                />
                {g}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* BRAND */}
      <div className="filter-dropdown">
        <div className="filter-title" onClick={() => toggle("brand")}>
          Brand <span>{open.brand ? "−" : "+"}</span>
        </div>
        {open.brand && (
          <div className="filter-options">
            {["mschief", "durex", "manforce"].map((b) => (
              <label key={b}>
                <input
                  type="checkbox"
                  checked={filters.brand.includes(b)}
                  onChange={() => handleCheck("brand", b)}
                />
                {b}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* PRICE */}
      <div className="filter-dropdown">
        <div className="filter-title" onClick={() => toggle("price")}>
          Price <span>{open.price ? "−" : "+"}</span>
        </div>
        {open.price && (
          <div className="filter-options">
            {["Under 1000", "1000-2599", "2600-5000"].map((p) => (
              <label key={p}>
                <input
                  type="checkbox"
                  checked={filters.price.includes(p)}
                  onChange={() => handleCheck("price", p)}
                />
                {p}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* CONDOM TYPE */}
      <div className="filter-dropdown">
        <div className="filter-title" onClick={() => toggle("condomType")}>
          Condom Type <span>{open.condomType ? "−" : "+"}</span>
        </div>
        {open.condomType && (
          <div className="filter-options">
            {["thin", "fit"].map((c) => (
              <label key={c}>
                <input
                  type="checkbox"
                  checked={filters.condomType.includes(c)}
                  onChange={() => handleCheck("condomType", c)}
                />
                {c}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* USAGE TYPE */}
      <div className="filter-dropdown">
        <div className="filter-title" onClick={() => toggle("usageType")}>
          Usage Type <span>{open.usageType ? "−" : "+"}</span>
        </div>
        {open.usageType && (
          <div className="filter-options">
            {["internal", "external", "remote control", "dual massager"].map((u) => (
              <label key={u}>
                <input
                  type="checkbox"
                  checked={filters.usageType.includes(u)}
                  onChange={() => handleCheck("usageType", u)}
                />
                {u}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* SUITABLE FOR */}
      <div className="filter-dropdown">
        <div className="filter-title" onClick={() => toggle("suitableFor")}>
          Suitable For <span>{open.suitableFor ? "−" : "+"}</span>
        </div>
        {open.suitableFor && (
          <div className="filter-options">
            {["beginner", "advanced", "couple", "solo", "sensitive"].map((s) => (
              <label key={s}>
                <input
                  type="checkbox"
                  checked={filters.suitableFor.includes(s)}
                  onChange={() => handleCheck("suitableFor", s)}
                />
                {s}
              </label>
            ))}
          </div>
        )}
      </div>

      {isMobile && (
        <button className="apply-filter-btn" onClick={onApply}>
          Apply Filters
        </button>
      )}
    </>
  );
};

/* ------------------ MAIN COMPONENT ------------------ */
const Product = () => {
  const { addToCart } = useCart();
  const { brandSlug, collectionSlug } = useParams();
  const location = useLocation();

  const [PRODUCTS, setPRODUCTS] = useState([]);
  const [filters, setFilters] = useState({
    gender: [],
    brand: [],
    price: [],
    condomType: [],
    usageType: [],
    suitableFor: [],
  });
  const [tempFilters, setTempFilters] = useState(filters);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("az");
  const [showFilter, setShowFilter] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => {
    fetch("http://localhost:9000/get-product")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.products.map((p, i) => ({
          id: p._id,

          title: p.title,
          price: p.price,
          oldPrice: p.oldPrice || p.price * 2,

          brand: p.brand?.toLowerCase() || "",
          gender: p.gender?.toLowerCase() || "",
          usageType: p.usageType?.toLowerCase() || "",
          condomType: p.condomType?.toLowerCase() || "thin",

          suitableFor: p.suitable ? [p.suitable.toLowerCase()] : [],

          rating: 4,

          discount: p.oldPrice
            ? `${Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}% Off`
            : "",

          image: p.images?.length
            ? `http://localhost:9000${p.images[0]}`
            : require("../../Img/t1.png"),

          freeLube: p.freeLube,

          stock: p.stock, // ✅ ADD THIS LINE ONLY

          isNew: i % 4 === 0,
          isBestSeller: i % 6 === 0,
        }));

        setPRODUCTS(mapped);
      });
  }, []);

  // Route based filtering
  const getRouteFilteredProducts = () => {
    if (location.pathname === "/products") return PRODUCTS;

    if (location.pathname.startsWith("/brand") && brandSlug) {
      return PRODUCTS.filter(
        (p) => p.brand.toLowerCase() === brandSlug.toLowerCase()
      );
    }

    if (location.pathname.startsWith("/collection") && collectionSlug) {
      switch (collectionSlug) {
        case "new-arrivals":
          return PRODUCTS.filter((p) => p.isNew);
        case "best-sellers":
          return PRODUCTS.filter((p) => p.isBestSeller);
        case "under-1599":
          return PRODUCTS.filter((p) => p.price <= 1599);
        case "under-2599":
          return PRODUCTS.filter((p) => p.price <= 2599);
        default:
          return PRODUCTS;
      }
    }

    return PRODUCTS;
  };

  const routeFilteredProducts = getRouteFilteredProducts();

  useEffect(() => {
    setPage(1);
  }, [brandSlug, collectionSlug, location.pathname]);

  // Apply filters
  const filteredProducts = routeFilteredProducts.filter((p) => {
    const genderMatch = filters.gender.length === 0 || filters.gender.includes(p.gender);
    const brandMatch = filters.brand.length === 0 || filters.brand.includes(p.brand);
    const priceMatch =
      filters.price.length === 0 ||
      filters.price.some((r) => {
        if (r === "Under 1000") return p.price < 1000;
        if (r === "1000-2599") return p.price >= 1000 && p.price <= 2599;
        if (r === "2600-5000") return p.price >= 2600 && p.price <= 5000;
        return true;
      });
    const condomMatch = filters.condomType.length === 0 || filters.condomType.includes(p.condomType);
    const usageMatch = filters.usageType.length === 0 || filters.usageType.includes(p.usageType);
    const suitableMatch =
      filters.suitableFor.length === 0 ||
      (Array.isArray(p.suitableFor) && p.suitableFor.some((s) => filters.suitableFor.includes(s)));
    const searchMatch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());

    return genderMatch && brandMatch && priceMatch && condomMatch && usageMatch && suitableMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const visibleProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const sortedProducts = [...visibleProducts].sort((a, b) => {
    if (sortBy === "priceLowHigh") return a.price - b.price;
    if (sortBy === "priceHighLow") return b.price - a.price;
    if (sortBy === "az") return a.title.localeCompare(b.title);
    if (sortBy === "za") return b.title.localeCompare(a.title);
    return 0;
  });

  const applyMobileFilter = () => {
    setFilters(tempFilters);
    setPage(1);
    setShowFilter(false);
  };

  useEffect(() => {
    if (showFilter) setTempFilters(filters);
  }, [showFilter]);

  return (
    <div className="product">
      <section className="hero-banner">
        <img className="d-md-block d-none w-100" src={require("../../Img/banner.jpg")} alt="" />
        <img className="d-md-none w-100" src={require("../../Img/banner2.jpg")} alt="" />
      </section>

      <section className="products-page">
        <div className="container">
          <div className="row">
            {/* DESKTOP FILTER */}
            <div className="col-lg-3 d-none d-lg-block">
              <div className="filter-sidebar">
                <FilterContent filters={filters} setFilters={setFilters} />
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="col-lg-9">
              <div className="products-header">
                <button className="filter-btn d-lg-none" onClick={() => setShowFilter(true)}>
                  <FaFilter /> Filter
                </button>

                <div className="search-sort-wrapper">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="search-input"
                  />
                  <div className="sort-box">
                    <label>Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        setPage(1);
                      }}
                    >
                      <option value="az">Alphabetically, A–Z</option>
                      <option value="za">Alphabetically, Z–A</option>
                      <option value="priceLowHigh">Price, Low to High</option>
                      <option value="priceHighLow">Price, High to Low</option>
                      <option value="newOld">New to Old</option>
                      <option value="oldNew">Old to New</option>
                    </select>

                    <span className="product-count">{filteredProducts.length} products</span>
                  </div>
                </div>
              </div>

              <div className="product-grid">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} />
                ))}
              </div>

              {/* PAGINATION */}
              <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (totalPages <= 5) return true;
                    if (p >= page - 2 && p <= page + 2) return true;
                    if (page <= 3 && p <= 5) return true;
                    if (page >= totalPages - 2 && p >= totalPages - 4) return true;
                    return false;
                  })
                  .map((p) => (
                    <button key={p} className={page === p ? "active" : ""} onClick={() => setPage(p)}>
                      {p}
                    </button>
                  ))}
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>›</button>
              </div>
            </div>
          </div>

          {/* MOBILE FILTER */}
          <div className={`mobile-filter ${showFilter ? "open" : ""}`}>
            <button className="close-btn" onClick={() => setShowFilter(false)}>✕</button>
            {showFilter && (
              <FilterContent
                filters={tempFilters}
                setFilters={setTempFilters}
                isMobile={true}
                onApply={applyMobileFilter}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Product;
