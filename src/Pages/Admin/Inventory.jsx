import { useEffect, useState } from "react";
import Sidebar from "../../Component/Sidebar";
import { FiSearch, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { FaBox, FaExclamationTriangle, FaDollarSign, FaCog } from "react-icons/fa";
import axios from "axios";

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Drawer state
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    /* ================= FETCH PRODUCTS ================= */
    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("adminToken");;
            const res = await axios.get("http://localhost:9000/get-p-data", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(res.data.products || []);
        } catch (error) {
            console.error("Inventory fetch error:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    /* ================= CATEGORY LIST ================= */
    const categories = ["All", ...new Set(products.map((p) => p.category))];

    /* ================= FILTERING ================= */
    const filtered = products.filter((product) => {
        const matchesQuery = `${product.title} ${product.sku} ${product.category} ${product._id}`
            .toLowerCase()
            .includes(query.toLowerCase());
        const matchesCategory = categoryFilter === "All" ? true : product.category === categoryFilter;
        return matchesQuery && matchesCategory;
    });

    /* ================= PAGINATION ================= */
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const paged = filtered.slice(start, start + itemsPerPage);
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    // DELETE
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            const token = localStorage.getItem("adminToken");;
            await axios.delete(`http://localhost:9000/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Product deleted successfully");
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert("Failed to delete product");
        }
    };

    // EDIT / SAVE
    const handleSave = async () => {
        try {
            const token = localStorage.getItem("adminToken");;
            await axios.put(`http://localhost:9000/products/${selectedProduct._id}`, selectedProduct, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Product updated successfully");
            closeDrawer();
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert("Failed to update product");
        }
    };


    /* ================= EDIT HANDLERS ================= */
    const openDrawer = (product) => {
        setSelectedProduct({ ...product }); // create a copy to edit
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setSelectedProduct(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        let newValue = value;

        if (type === "checkbox") {
            newValue = checked;
        } else if (["price", "oldPrice", "stock"].includes(name)) {
            newValue = Number(value);
        }

        setSelectedProduct(prev => ({
            ...prev,
            [name]: newValue,
        }));
    };


    /* ================= STATS ================= */
    const lowStockCount = products.filter((p) => p.stock < 5).length;
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);

    return (
        <div className="admin">
            <Sidebar />
            <div className="admin-content fade-in">

                {/* PAGE HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold mb-0">Inventory Management</h2>
                    <div className="d-flex align-items-center gap-3">
                        <FaCog className="fs-5 cursor-pointer text-muted" />

                        <img
                            src={require('../../Img/admin.webp')}
                            alt="Admin"
                            className="admin-avatar"
                        />
                    </div>
                </div>

                {/* STATS */}
                <div className="row g-3 mb-4">
                    <div className="col-lg-4">
                        <div className="stat-card">
                            <div className="icon bg-primary-soft"><FaBox /></div>
                            <div>
                                <p>Total Products</p>
                                <h3>{products.length}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="stat-card">
                            <div className="icon bg-warning-soft"><FaExclamationTriangle /></div>
                            <div>
                                <p>Low Stock Items</p>
                                <h3>{lowStockCount}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="stat-card">
                            <div className="icon bg-success-soft"><FaDollarSign /></div>
                            <div>
                                <p>Total Value</p>
                                <h3>₹{totalValue.toFixed(2)}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FILTER BAR */}
                <div className="inventory-toolbar mb-3 d-flex justify-content-between align-items-center">
                    <div className="d-flex inventory-search border">
                        <FiSearch />
                        <input
                            type="text"
                            placeholder="Search by SKU, Name, ID or Category..."
                            className="ms-2"
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <div className="gap-2 d-flex align-items-center">
                        <select
                            className="form-select"
                            value={categoryFilter}
                            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <button
                            className="btn btn-primary"
                            style={{ whiteSpace: "nowrap" }}
                            onClick={() => window.location.href = "/Admin-dashboard/product-add"}
                        >
                            + Add Product
                        </button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="inventory-table">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>PRODUCT</th>
                                <th>SKU</th>
                                <th>CATEGORY</th>
                                <th>PRICE</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paged.map(product => (
                                <tr key={product._id}>
                                    <td>
                                        <div className="product-info">
                                            <img
                                                src={product.images?.[0] ? `http://localhost:9000${product.images[0]}` : "https://via.placeholder.com/40"}
                                                alt=""
                                            />
                                            <div>
                                                <strong>{product.title}</strong>
                                                <small>{product.brand || "—"}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{product.sku}</td>
                                    <td>{product.category}</td>
                                    <td>₹{product.price}</td>
                                    <td>
                                        <span className={`badge ${product.status ? "in-stock" : "low-stock"}`}>
                                            {product.status ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="action-buttons">
                                        <button className="btn btn-sm " onClick={() => openDrawer(product)}><FiEdit2 size={18} /></button>
                                        <button className="btn btn-sm " onClick={() => handleDelete(product._id)}><FiTrash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* PAGINATION */}
                    <div className="table-footer d-flex justify-content-between align-items-center mt-3">
                        <span>
                            Showing {start + 1} to {Math.min(start + itemsPerPage, filtered.length)} of {filtered.length} results
                        </span>
                        <div className="d-flex gap-2">
                            <button className="btn btn-light btn-sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                            {[...Array(totalPages)].map((_, index) => {
                                const page = index + 1;
                                return (
                                    <button
                                        key={page}
                                        className={`btn btn-light btn-sm ${currentPage === page ? "active" : ""}`}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                            <button className="btn btn-light btn-sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                        </div>
                    </div>
                </div>

                {/* EDIT DRAWER */}
                {drawerOpen && selectedProduct && (
                    <div className="edit-drawer">
                        <div className="drawer-content">
                            <div className="drawer-header pt-0 d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Edit Product</h5>
                                <button className="close-btn" onClick={closeDrawer}><FiX /></button>
                            </div>
                            <div className="drawer-body pt-0">
                                <label className="form-label">Title</label>
                                <input className="form-control mb-2" name="title" value={selectedProduct.title} onChange={handleChange} />

                                <label className="form-label">SKU</label>
                                <input className="form-control mb-2" name="sku" value={selectedProduct.sku} onChange={handleChange} />

                                <label className="form-label">Category</label>
                                <input className="form-control mb-2" name="category" value={selectedProduct.category} onChange={handleChange} />

                                <label className="form-label">Price</label>
                                <input className="form-control mb-2" name="price" value={selectedProduct.price} onChange={handleChange} />

                                <label className="form-label">Old Price</label>
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    name="oldPrice"
                                    value={selectedProduct.oldPrice || ""}
                                    onChange={handleChange}
                                />

                                <label className="form-label">Stock</label>
                                <input className="form-control mb-2" name="stock" value={selectedProduct.stock} onChange={handleChange} />

                                <label className="form-label">Status</label>
                                <div className="form-check form-switch mb-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="status"
                                        checked={selectedProduct.status}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label">{selectedProduct.status ? "Active" : "Inactive"}</label>
                                </div>

                                <button className="btn btn-primary mt-3" onClick={handleSave}>Save Changes</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Inventory;
