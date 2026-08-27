import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";


// new
import {generateCartItemsFrom} from "./Cart";
// import { LocalGasStation } from "@mui/icons-material";
//new


// Roughly one screenful of cards on a desktop grid
const SKELETON_COUNT = 8;

const Products = () => {
  const [productsList, setProductsList] = useState([]);
  // Starts true so the very first paint is skeletons rather than a blank page
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [noProducts, setNoProducts] = useState(false);

  // new
  const [cartData, setCartData] = useState([]);
  const [cartFinalData,setCartFinalData] = useState([]);
  const token = localStorage.getItem("token"); // Retrieve token from local storage or context
  // new

  
  useEffect(()=>{
    performAPICall();
    fetchCart(token); // Fetch cart when the component mounts
  },[])
  const performAPICall = async () => {
    setLoading(true);
    setNoProducts(false);
    try{
      let result = await axios.get(`${config.endpoint}/products`);
      setLoading(false);
      setProductsList(result.data);
      // console.log(result)
    }catch(e){
      setLoading(false);
      if (e.response && e.response.status == 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. check that the backend is running, reachable and return valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

// new


// 
  // new
  useEffect(()=>{
    setCartFinalData(generateCartItemsFrom(cartData,productsList));
  },[cartData,productsList]);
  // new

  
  const performSearch = async (text) => {
    setLoading(true);
    setNoProducts(false);
    try{
      let result = await axios.get(`${config.endpoint}/products/search?value=${text}`);
      setLoading(false);
      if(result.data.length>0){
        setProductsList(result.data);
      }else{
        setNoProducts(true);
        setProductsList([]);
      }
      // console.log(result);
    }catch(e){
      setProductsList([]);
      setNoProducts(true);
      setLoading(false);
      if (e.response && e.response.status == 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. check that the backend is running, reachable and return valid JSON.",
          { variant: "error" }
        );
      }

    }
  };

  const [time, setTime] = useState("");
  const debounceSearch = (event, debounceTimeout) => {
          clearTimeout(time);
          let timeRef = setTimeout(()=>{
            performSearch(event.target.value);
          },debounceTimeout);
          setTime(timeRef);         
  };

  const fetchCart = async (token) => {
   if(token){
    try {
      let response = await axios.get(`${config.endpoint}/cart`,{headers:{
        Authorization: `Bearer ${token}`
      }})
      setCartData(response.data);
    } catch (e) {
      enqueueSnackbar("Failed to fetch cart data", { variant: "error" });
    }
   }
  };

const addToCart = async (token, items, productId, qty) => {
  if (!token) {
    enqueueSnackbar("Login to add an item to the Cart", { variant: "warning" });
    return;
  }

  // The backend sets qty absolutely, so send the running total to bump an
  // item that is already in the cart instead of overwriting it.
  const existingItem = items.find((item) => item.productId === productId);
  const nextQty = existingItem ? existingItem.qty + qty : qty;

  try {
    const response = await axios.post(
      `${config.endpoint}/cart`,
      { productId, qty: nextQty },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setCartData(response.data);

    const product = productsList.find((item) => item._id === productId);
    const productName = product ? product.name : "Item";

    enqueueSnackbar(
      existingItem
        ? `${productName} — quantity updated to ${nextQty}`
        : `${productName} added to cart`,
      { variant: "success" }
    );
  } catch (e) {
    if (e.response && e.response.status === 401) {
      enqueueSnackbar("Login to add an item to the Cart", { variant: "error" });
    } else {
      enqueueSnackbar(
        "Something went wrong. Check that the backend is running, reachable, and returns valid JSON.",
        { variant: "error" }
      );
    }
  }
};

// const handleQuantityChange = (token, cartData, productId,products,qty) => {
//   // addToCart(token, cartData, productId,products, qty);
//   if (qty === 0) {
//     // Remove the item from the cart by setting qty to 0
//     addToCart(token, cartData, productId, 0);
//   } else {
//     // Update the quantity if it's greater than 0
//     addToCart(token, cartData, productId, qty);
//   }
// };

const handleQuantityChange = (productId, newQty) => {
  if (newQty === 0) {
    // Remove the item from the cart by setting qty to 0
    addToCart(token, cartData, productId, 0);
  } else {
    // Update the quantity if it's greater than 0
    addToCart(token, cartData, productId, newQty);
  }
};


  // Total units in the cart, shown as the header badge
  const cartCount = (cartFinalData || [])
    .filter((item) => item.qty > 0)
    .reduce((sum, item) => sum + item.qty, 0);

  return (
    <div>
      <Header hasHiddenAuthButtons={true} cartCount={cartCount} children={
      <TextField
        className="search-desktop"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e)=>{debounceSearch(e,500)}}
      />}
      >
      </Header>

    
      <Box className="hero">
        <p className="hero-heading">
          India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
          to your door step
        </p>
      </Box>

      <Box className="products-section">
        {!loading && !noProducts && productsList.length > 0 && (
          <Box className="products-section-head">
            <h2 className="products-title">Explore products</h2>
            <span className="products-count">
              {productsList.length} items
            </span>
          </Box>
        )}

        {loading && (
          <>
            <Box className="products-section-head">
              <h2 className="products-title">Explore products</h2>
            </Box>
            <Grid container spacing={2}>
              {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <Grid item xs={6} sm={4} md={3} lg={3} key={`skeleton-${index}`}>
                  <ProductCardSkeleton />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {noProducts && !loading && (
          <Box className="products-state">
            <SentimentDissatisfied className="products-state-icon" />
            <div className="products-state-text">No products found</div>
          </Box>
        )}

        {!loading && productsList.length > 0 && (
          <Grid container spacing={2}>
            {productsList.map((product) => (
              <Grid item xs={6} sm={4} md={3} lg={3} key={product._id}>
                <ProductCard
                  product={product}
                  handleAddToCart={(productId) =>
                    addToCart(token, cartData, productId, 1)
                  }
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Footer />
    </div>
  );
};

export default Products;
