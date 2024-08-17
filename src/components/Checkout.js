// import { CreditCard, Delete } from "@mui/icons-material";
// import {
//   Button,
//   Divider,
//   Grid,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import { Box } from "@mui/system";
// import axios from "axios";
// import { useSnackbar } from "notistack";
// import React, { useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
// import { config } from "../App";
// import Cart, { getTotalCartValue, generateCartItemsFrom } from "./Cart";
// import "./Checkout.css";
// import Footer from "./Footer";
// import Header from "./Header";

// // Definition of Data Structures used
// /**
//  * @typedef {Object} Product - Data on product available to buy
//  *
//  * @property {string} name - The name or title of the product
//  * @property {string} category - The category that the product belongs to
//  * @property {number} cost - The price to buy the product
//  * @property {number} rating - The aggregate rating of the product (integer out of five)
//  * @property {string} image - Contains URL for the product image
//  * @property {string} _id - Unique ID for the product
//  */

// /**
//  * @typedef {Object} CartItem -  - Data on product added to cart
//  *
//  * @property {string} name - The name or title of the product in cart
//  * @property {string} qty - The quantity of product added to cart
//  * @property {string} category - The category that the product belongs to
//  * @property {number} cost - The price to buy the product
//  * @property {number} rating - The aggregate rating of the product (integer out of five)
//  * @property {string} image - Contains URL for the product image
//  * @property {string} productId - Unique ID for the product
//  */



// const Checkout = () => {









//   return (
//     <>
//       <Header />
//       <Grid container>
//         <Grid item xs={12} md={9}>
//           <Box className="shipping-container" minHeight="100vh">
//             <Typography color="#3C3C3C" variant="h4" my="1rem">
//               Shipping
//             </Typography>
//             <Typography color="#3C3C3C" my="1rem">
//               Manage all the shipping addresses you want. This way you won't
//               have to enter the shipping address manually with every order.
//               Select the address you want to get your order delivered.
//             </Typography>
//             <Divider />
//             <Box>
//             </Box>


//             <Typography color="#3C3C3C" variant="h4" my="1rem">
//               Payment
//             </Typography>
//             <Typography color="#3C3C3C" my="1rem">
//               Payment Method
//             </Typography>
//             <Divider />

//             <Box my="1rem">
//               <Typography>Wallet</Typography>
//               <Typography>
//                 Pay ${getTotalCartValue(items)} of available $
//                 {localStorage.getItem("balance")}
//               </Typography>
//             </Box>

//             <Button
//               startIcon={<CreditCard />}
//               variant="contained"
//             >
//               PLACE ORDER
//             </Button>
//           </Box>
//         </Grid>
//         <Grid item xs={12} md={3} bgcolor="#E9F5E1">
//           <Cart isReadOnly products={products} items={items} />
//         </Grid>
//       </Grid>
//       <Footer />
//     </>
//   );
// };

// export default Checkout;




import { CreditCard } from "@mui/icons-material";
import { Button, Divider, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import Cart, { getTotalCartValue } from "./Cart";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header";

// Placeholder data for items and products
// These should be fetched or passed as props
const items = [
  // Example item structure
  // {
  //   name: "Product 1",
  //   qty: 2,
  //   cost: 20,
  //   image: "https://via.placeholder.com/150",
  //   _id: "1",
  // },
];
const products = [
  // Example product structure
  // {
  //   name: "Product 1",
  //   cost: 20,
  //   image: "https://via.placeholder.com/150",
  //   _id: "1",
  // },
];

const Checkout = () => {
  const balance = parseFloat(localStorage.getItem("balance")) || 0;

  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={12} md={9}>
          <Box className="shipping-container" minHeight="100vh">
            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Shipping
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Manage all the shipping addresses you want. This way you won't
              have to enter the shipping address manually with every order.
              Select the address you want to get your order delivered.
            </Typography>
            <Divider />

            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Payment
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Payment Method
            </Typography>
            <Divider />

            <Box my="1rem">
              <Typography>Wallet</Typography>
              <Typography>
                Pay ${getTotalCartValue(items)} of available ${balance}
              </Typography>
            </Box>

            <Button
              startIcon={<CreditCard />}
              variant="contained"
              onClick={() => {
                // Handle order placement logic
              }}
            >
              PLACE ORDER
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} bgcolor="#E9F5E1">
          <Cart items={items} isReadOnly />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;
