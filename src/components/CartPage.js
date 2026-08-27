import { ShoppingCartOutlined } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { config } from "../App";
import Cart, { generateCartItemsFrom } from "./Cart";
import CartSkeleton from "./CartSkeleton";
import Footer from "./Footer";
import Header from "./Header";
import "./CartPage.css";

const CART_SKELETON_ROWS = 3;

const CartPage = () => {
  const [productsList, setProductsList] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [cartFinalData, setCartFinalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadCart = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const [products, cart] = await Promise.all([
          axios.get(`${config.endpoint}/products`),
          axios.get(`${config.endpoint}/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setProductsList(products.data);
        setCartData(cart.data);
      } catch (e) {
        enqueueSnackbar("Failed to load your cart. Please try again.", {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCartFinalData(generateCartItemsFrom(cartData, productsList) || []);
  }, [cartData, productsList]);

  const handleQuantityChange = async (productId, newQty) => {
    try {
      const response = await axios.post(
        `${config.endpoint}/cart`,
        { productId, qty: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartData(response.data);
    } catch (e) {
      enqueueSnackbar("Could not update the cart. Please try again.", {
        variant: "error",
      });
    }
  };

  const itemCount = cartFinalData
    .filter((item) => item.qty > 0)
    .reduce((sum, item) => sum + item.qty, 0);

  const renderBody = () => {
    if (loading) {
      return (
        <Box className="cart-page-panel">
          <CartSkeleton rows={CART_SKELETON_ROWS} />
        </Box>
      );
    }

    if (!token) {
      return (
        <Box className="cart-page-state">
          <ShoppingCartOutlined className="cart-page-state-icon" />
          <Typography className="cart-page-state-title">
            Log in to see your cart
          </Typography>
          <Typography className="cart-page-state-text">
            Your saved items are waiting for you.
          </Typography>
          <Button
            variant="contained"
            disableElevation
            className="cart-page-cta"
            onClick={() => history.push("/login")}
          >
            Login
          </Button>
        </Box>
      );
    }

    if (!itemCount) {
      return (
        <Box className="cart-page-state">
          <ShoppingCartOutlined className="cart-page-state-icon" />
          <Typography className="cart-page-state-title">
            Your cart is empty
          </Typography>
          <Typography className="cart-page-state-text">
            Add items from the store to get started.
          </Typography>
          <Button
            variant="contained"
            disableElevation
            className="cart-page-cta"
            onClick={() => history.push("/")}
          >
            Start shopping
          </Button>
        </Box>
      );
    }

    return (
      <Box className="cart-page-panel">
        <Cart
          products={productsList}
          items={cartFinalData}
          handleQuantity={handleQuantityChange}
        />
      </Box>
    );
  };

  return (
    <div>
      <Header />
      <Box className="cart-page">
        <Typography className="cart-page-heading">
          Your cart
          {itemCount > 0 && (
            <span className="cart-page-count">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          )}
        </Typography>
        {renderBody()}
      </Box>
      <Footer />
    </div>
  );
};

export default CartPage;
