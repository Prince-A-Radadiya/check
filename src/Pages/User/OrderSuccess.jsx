import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowText(true), 800);
  }, []);

  return (
    <div className="order-success-wrapper">
      <div className="success-card">

        {/* CHECKMARK */}
        <div className="checkmark-wrapper">
          <svg
            className="checkmark"
            viewBox="0 0 52 52"
          >
            <circle
              className="checkmark-circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="checkmark-check"
              fill="none"
              d="M14 27l7 7 17-17"
            />
          </svg>
        </div>

        {/* TEXT */}
        {showText && (
          <>
            <AnimatedText
              text="Order placed successfully!"
              className="success-title"
            />

            <AnimatedText
              text="Thank you for shopping with Love Depot."
              className="success-subtitle"
              delay={600}
            />

            <AnimatedText
              text="Your order is being processed and will be shipped soon."
              className="success-desc"
              delay={1200}
            />
          </>
        )}

        {/* BUTTONS */}
        <div className="success-actions">
          <button
            className="primary-btn"
            onClick={() => navigate("/user-settings")}
          >
            View Orders
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

/* ================= WORD BY WORD ANIMATION ================= */

const AnimatedText = ({ text, className, delay = 0 }) => {
  const words = text.split(" ");

  return (
    <p className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          style={{
            animationDelay: `${delay + index * 120}ms`,
          }}
        >
          {word}&nbsp;
        </span>
      ))}
    </p>
  );
};
