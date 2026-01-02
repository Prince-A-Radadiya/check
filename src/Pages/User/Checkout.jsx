import React, { useState, useEffect } from "react";
import { useCart } from "../../Context/CartContext";
import { useNavigate } from "react-router-dom";
import {
  FaCreditCard, FaWallet, FaTruck, FaShieldAlt, FaHeadset, FaTimes
} from "react-icons/fa";

const Checkout = () => {
  const { cart, user } = useCart();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [shipping, setShipping] = useState({
    firstName: "", lastName: "", address: "", city: "", state: "", zip: "", phone: ""
  });
  const [payment, setPayment] = useState("card");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const tax = 0;

  // Fetch available coupons
  useEffect(() => {
    fetch("http://localhost:9000/coupen-list")
      .then(res => res.json())
      .then(data => {
        if (data.success) setCoupons(data.coupens.filter(c => c.active));
      });
  }, []);

  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalBeforeCoupon = subtotal + tax;
  const total = totalBeforeCoupon - discountAmount;

  const applyCoupon = (coupon) => {
    if (cart.items.length === 0) return alert("Cart is empty");

    const isFirstOrder = !user?.orders || user.orders.length === 0;
    if (coupon.code === "WELCOME20" && !isFirstOrder) {
      return alert("This coupon is valid only for first order");
    }

    if (totalBeforeCoupon < 2500) return alert("Cart total must be at least ₹2500");

    setAppliedCoupon(coupon);
    const discount = coupon.discountType === "percentage"
      ? (totalBeforeCoupon * coupon.discountValue) / 100
      : coupon.discountValue;

    setDiscountAmount(discount);
    setDrawerOpen(false);
  };

  const removeAppliedCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

const placeOrder = async () => {
  const token = localStorage.getItem("userToken");
  if (!token) return alert("Login required");

  // COD FLOW
  if (payment === "cod") {
    return createOrderAndFinish("cod");
  }

  // ONLINE PAYMENT FLOW
  try {
    // 🔹 STEP 1: Create DB order first
    const orderRes = await fetch("http://localhost:9000/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        shipping: {
          name: `${shipping.firstName} ${shipping.lastName}`,
          phone: shipping.phone,
          address: `${shipping.address}, ${shipping.city}, ${shipping.state} - ${shipping.zip}`,
        },
        paymentMethod: "razorpay",
        couponCode: appliedCoupon?.code || "",
      }),
    });

    const orderData = await orderRes.json();
    if (!orderData.success) throw new Error(orderData.message);

    const dbOrderId = orderData.orderId; // ORD-xxxxx

    // 🔹 STEP 2: Create Razorpay order
    const rpRes = await fetch("http://localhost:9000/razorpay/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: total }),
    });

    const rpData = await rpRes.json();
    if (!rpData.success) throw new Error("Razorpay order failed");

    // 🔹 STEP 3: Open Razorpay popup
    const options = {
      key: rpData.key,
      amount: rpData.order.amount,
      currency: "INR",
      name: "Love Depot",
      description: "Order Payment",
      order_id: rpData.order.id,
      handler: (response) =>
        verifyPayment(response, dbOrderId),
      prefill: {
        email,
        contact: shipping.phone,
      },
      theme: { color: "#e11d48" },
    };

    new window.Razorpay(options).open();
  } catch (err) {
    console.error(err);
    alert("Payment failed");
  }
};

const verifyPayment = async (response, orderId) => {
  const token = localStorage.getItem("userToken");

  const verifyRes = await fetch("http://localhost:9000/razorpay/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
      orderId, // 🔑 VERY IMPORTANT
    }),
  });

  const data = await verifyRes.json();
  if (!data.success) return alert("Payment verification failed");

  navigate("/order-success");
  window.open(`http://localhost:9000/invoice/${orderId}`, "_blank");
};

const createOrderAndFinish = async (method) => {
  const token = localStorage.getItem("userToken");

  const res = await fetch("http://localhost:9000/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      email,
      shipping: {
        name: `${shipping.firstName} ${shipping.lastName}`,
        phone: shipping.phone,
        address: `${shipping.address}, ${shipping.city}, ${shipping.state} - ${shipping.zip}`,
      },
      paymentMethod: method,
      couponCode: appliedCoupon?.code || "",
    }),
  });

  const data = await res.json();
  if (data.success) {
    navigate("/order-success");
    window.open(`http://localhost:9000/invoice/${data.orderId}`, "_blank");
  } else {
    alert(data.message);
  }
};


  return (
    <div className="checkout-page">
      <div className="container">
        <div className="row gy-4">

          {/* LEFT */}
          <div className="col-lg-7">
            {/* CONTACT */}
            <div className="box">
              <div className="step">1</div>
              <h3>Contact Information</h3>
              <input
                className="input mb-0"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* SHIPPING */}
            <div className="box">
              <div className="step">2</div>
              <h3>Shipping Address</h3>
              <div className="grid-2">
                <input className="input" placeholder="First name"
                  onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })} />
                <input className="input" placeholder="Last name"
                  onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })} />
              </div>
              <input className="input" placeholder="Address"
                onChange={(e) => setShipping({ ...shipping, address: e.target.value })} />
              <div className="grid-3">
                <input className="input" placeholder="City"
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })} />
                <input className="input" placeholder="State"
                  onChange={(e) => setShipping({ ...shipping, state: e.target.value })} />
                <input className="input" placeholder="ZIP"
                  onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} />
              </div>
              <input className="input mb-0" placeholder="Phone"
                onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} />
            </div>

            {/* PAYMENT */}
            <div className="box">
              <div className="step">3</div>
              <h3>Payment</h3>
              <div className="payment-tabs">
                {/* <button className={payment === "card" ? "active" : ""} onClick={() => setPayment("card")}>
                  <FaCreditCard /> Card
                </button> */}
                <button className={payment === "upi" ? "active" : ""} onClick={() => setPayment("upi")}>
                  <FaWallet /> Wallet / UPI
                </button>
                <button className={payment === "cod" ? "active" : ""} onClick={() => setPayment("cod")}>
                  COD
                </button>
              </div>

              {/* {payment === "card" && (
                <>
                  <input className="input" placeholder="Card number" />
                  <div className="grid-2">
                    <input className="input" placeholder="MM / YY" />
                    <input className="input" placeholder="CVC" />
                  </div>
                  <input className="input mb-0" placeholder="Cardholder name" />
                </>
              )} */}

              {payment === "upi" && (
                <>
                  <input className="input mb-0" type="text" placeholder="Enter UPI Id" />
                </>
              )}
            </div>

            <button className="pay-btn mt-3" onClick={placeOrder}>
              Pay / Buy Now
            </button>
          </div>

          {/* RIGHT */}
          <div className="col-lg-5">
            <div className="summary">
              <h4>Order Summary</h4>
              {cart.items.map((item) => (
                <div key={item.productId} className="summary-item">
                  <img src={item.image?.startsWith("http") ? item.image : `http://localhost:9000${item.image}`} alt={item.title} />
                  <div>
                    <p>{item.title}</p>
                    <span>x{item.qty}</span>
                  </div>
                  <strong>₹{item.price}</strong>
                </div>
              ))}
              <div className="price-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="price-row"><span>Shipping</span><span className="text-success">Free</span></div>
              {appliedCoupon && <div className="price-row text-success"><span>Coupon Discount</span><span>-₹{discountAmount.toFixed(2)}</span></div>}
              <div className="price-row total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
              <div className="trust">
                <div><FaTruck /> Fast</div>
                <div><FaShieldAlt /> Secure</div>
                <div><FaHeadset /> Support</div>
              </div>
              <button className="apply-btn mt-3 me-2" onClick={() => setDrawerOpen(true)}>Apply Coupon</button>
              {appliedCoupon && (
                <p className="applied-coupon mt-2">
                  Applied Coupon: {appliedCoupon.code} (-₹{discountAmount.toFixed(2)})
                  <button className="remove-coupon-btn" onClick={removeAppliedCoupon}>Remove</button>
                </p>
              )}
            </div>
          </div>

        </div>

        {/* COUPON DRAWER */}
        <div className={`coupon-drawer ${drawerOpen ? "open" : "closed"}`} onClick={e => e.stopPropagation()}>
          <div className="drawer-header d-flex align-items-center justify-content-between mb-3 pt-0">
            <h5 className="drawer-title mb-0">Available Coupons</h5>
            <button className="close-btn" onClick={() => setDrawerOpen(false)}><FaTimes /></button>
          </div>
          <div className="drawer-content">
            {coupons.length === 0 && <p>No coupons available</p>}
            {coupons.map(c => (
              <div key={c._id} className="coupon-card">
                <div>
                  <h6>{c.code}</h6>
                  <p className="mb-0">{c.description}</p>
                </div>
                <button onClick={() => applyCoupon(c)}>Apply</button>
              </div>
            ))}
          </div>
        </div>

        {drawerOpen && <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />}
      </div>
    </div>
  );
};

export default Checkout;
