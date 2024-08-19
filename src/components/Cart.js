import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box, display } from "@mui/system";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

export const generateCartItemsFrom = (cartData, productsData) => {
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



export const getTotalCartValue = (items = []) => {
  let total = 0;
  items.forEach(item=>{
   total = total +  (item.cost*item.qty);
  })
  return total;
};





// TODO: CRIO_TASK_MODULE_CHECKOUT - Implement function to return total cart quantity
/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */

export const getTotalItems = (items = []) => {
  return items.reduce((total, item) => total + item.qty, 0);
};
// TODO: CRIO_TASK_MODULE_CHECKOUT - Add static quantity view for Checkout page cart
/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
}) => {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * 
 */

//  * @param {Boolean} isReadOnly
//  *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
//  * 
//  */

const Cart = ({
  products,
  items = [],handleQuantityChange,isCheckout=false
}) => {
  const history = useHistory();


  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
        
        {/* //////////// */}
          {items.map((item)=>{  
       return (<Box display="flex"  padding="1rem" sx={{flexDirection:"column"}} key={item._id}>
                  <Box className="image-container">
                      <img
                          // Add product image
                          src={item.image}
                          // Add product name as alt eext
                          alt={item.name}
                          width="100%"
                          height="100%"
                      />
                  </Box>
                  <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      height="6rem"
                      paddingX="1rem"
                  >
                      <div>{item.name}</div>
                      <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                      >
                    {!isCheckout &&    
                    <ItemQuantity
                    value={item.qty}
                    handleAdd={() => handleQuantityChange(item._id, item.qty + 1)}
                    handleDelete={() => handleQuantityChange(item._id, item.qty - 1)}
                  />}    
                 
                      <Box padding="0.5rem" fontWeight="700">
                        <div style={{display:"flex",justifyContent:"space-between"}}>
                            <div>
                            Qty:{item.qty}
                            </div>
                            <div>
                            ${item.cost}
                            </div>
                        </div>
                          
                      </Box>
                      </Box>
                  </Box>
              </Box>)
             })}
          {/* ////////// */}
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>
        {!isCheckout && <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={()=>{history.push("/checkout")}}
          >
            Checkout
          </Button>
        </Box>}
        <div className="order-details">

          <Box alignSelf="center">
          <h3>Order Details</h3>
          <div style={{display:"flex",justifyContent:"space-between"}}>
          <div>Products</div>
          <div>{getTotalItems(items)}</div>
          </div>

          <div style={{display:"flex",justifyContent:"space-between"}}>
          <div>Subtotal</div>
          <div> ${getTotalCartValue(items)}</div>
          </div>

          <div style={{display:"flex",justifyContent:"space-between"}}>
          <div>Shipping Charges</div>
          <div>$0</div>
          </div>
          
          <div style={{display:"flex",justifyContent:"space-between"}}>
          <div>Total</div>
          <div>${getTotalCartValue(items)}</div>
          </div>
        
          </Box>

        {/* <div>Total Price: ${totalPrice.toFixed(2)}</div> */}
      </div>
      </Box>
    </>
  );
};

export default Cart;
