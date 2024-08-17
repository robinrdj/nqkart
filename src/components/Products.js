import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
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

// new
import Cart from "./Cart";
// import {generateCartItemsFrom} from "./Cart";
// import { LocalGasStation } from "@mui/icons-material";
//new


const Products = () => {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(false);
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
      console.log(result)
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
const generateCartItemsFrom = (cartData, productsData) => {
  let cartIdList = [];
  cartData.forEach(cartItem=>{
    cartIdList.push(cartItem.productId);
  })
  let cartProducts=[]
   productsData.forEach(product=>{
    if(cartIdList.includes(product._id)){
      let obj = cartData.find(cartItem=>cartItem.productId===product._id);
      product["qty"]=obj.qty
      cartProducts.push(product);
    }
  });
  console.log("c",cartProducts)
  return cartProducts;
};

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
      console.log(result);
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
    try {
      let response = await axios.get(`${config.endpoint}/cart`,{headers:{
        Authorization: `Bearer ${token}`
      }})
      setCartData(response.data);
    } catch (e) {
      enqueueSnackbar("Failed to fetch cart data", { variant: "error" });
    }
  };

const isItemInCart = (items, productId) => {
  return items.some((item) => item.productId === productId);
};


const addToCart = async (
  token,
  items,
  productId,
  qty,
  options = { preventDuplicate: false }
) => {
  const itemExists = isItemInCart(items, productId);

  if (itemExists && options.preventDuplicate) {
    enqueueSnackbar(
      "Item already in cart. Use the cart sidebar to update quantity or remove item.",
      { variant: "warning" }
    );
    return;
  }

  try {
    const response = await axios.post(
      `${config.endpoint}/cart`,
      { productId, qty },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setCartData(response.data);

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



const handleQuantityChange = (productId, newQty) => {
  if (newQty === 0) {
    // Remove the item from the cart by setting qty to 0
    addToCart(token, cartData, productId, 0);
  } else {
    // Update the quantity if it's greater than 0
    addToCart(token, cartData, productId, newQty);
  }
};


  return (
    <div>
      <Header hasHiddenAuthButtons={true} children={
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

    
       <Grid container>
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
         </Grid>
         {noProducts?<Grid>
          <Box sx={{ display: 'flex', justifyContent:"center" }}>
          <div>No Products Found..</div>
          </Box>
           </Grid>:""}
         
         {loading? 
           <Grid>
           <Box sx={{ display: 'flex', justifyContent:"center" }}>
          <CircularProgress />
          <div>Loading Products..</div>
          </Box>
           </Grid>
          :""}

         {productsList.map(product=>{
          return (
            <Grid item xs={6} md={3} key={product._id}> {/* Added key prop */}
              <ProductCard 
                product={product} 
                handleAddToCart={(productId) => addToCart(token, cartData, productId, 1, { preventDuplicate: true })} // Updated handleAddToCart call
              />
            </Grid>)
         })}
  
       </Grid>

       <Grid item xs={12} md={4}>
        <Cart items={cartFinalData} handleQuantityChange={handleQuantityChange}/>
       </Grid>

      <Footer />
    </div>
  );
};

export default Products;
