import {
  CheckCircle,
  CreditCard,
  InfoOutlined,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { config } from "../App";
import Cart, { getTotalCartValue, generateCartItemsFrom } from "./Cart";
import CartSkeleton from "./CartSkeleton";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header";

import DeleteIcon from '@mui/icons-material/Delete';


/**
 * @typedef {Object} Address - Data on added address
 *
 * @property {string} _id - Unique ID for the address
 * @property {string} address - Full address string
 */

/**
 * @typedef {Object} Addresses - Data on all added addresses
 *
 * @property {Array.<Address>} all - Data on all added addresses
 * @property {string} selected - Id of the currently selected address
 */

/**
 * @typedef {Object} NewAddress - Data on the new address being typed
 *
 * @property { Boolean } isAddingNewAddress - If a new address is being added
 * @property { String} value - Latest value of the address being typed
 */

// TODO: CRIO_TASK_MODULE_CHECKOUT - Should allow to type a new address in the text field and add the new address or cancel adding new address
/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { String } token
 *    Login token
 *
 * @param { NewAddress } newAddress
 *    Data on new address being added
 *
 * @param { Function } handleNewAddress
 *    Handler function to set the new address field to the latest typed value
 *
 * @param { Function } addAddress
 *    Handler function to make an API call to add the new address
 *
 * @returns { JSX.Element }
 *    JSX for the Add new address view
 *
 */
const AddNewAddressView = ({ token, newAddress, handleNewAddress, addAddress }) => {
  return (
    <Box display="flex" flexDirection="column">
      <TextField
        multiline
        minRows={4}
        placeholder="Enter your complete address"
        value={newAddress.value}
        onChange={(e) => handleNewAddress({ ...newAddress, value: e.target.value })}
      />
      <Stack direction="row" my="1rem">
        <Button variant="contained" onClick={() => addAddress(token, newAddress)}>
          Add
        </Button>
        <Button variant="text" onClick={() => handleNewAddress({ isAddingNewAddress: false, value: "" })}>
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

const Checkout = () => {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState({ all: [], selected: "" });
  const [newAddress, setNewAddress] = useState({
    isAddingNewAddress: false,
    value: "",
  });
  const [loading, setLoading] = useState(false);
  // Tracked separately from the address fetch above; the two resolve independently
  const [cartLoading, setCartLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      enqueueSnackbar("You must be logged in to access checkout page", { variant: "warning" });
      history.push("/login");
    } else {
      setLoading(true);
      getAddresses(token).then(() => setLoading(false));
    }
  }, [token, history, enqueueSnackbar]);

  const getAddresses = async (token) => {
    try {
      const response = await axios.get(`${config.endpoint}/user/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses({ ...addresses, all: response.data });
      console.log(response.data);
    } catch (e) {
      enqueueSnackbar(
        "Could not fetch addresses. Check that the backend is running, reachable and returns valid JSON.",
        { variant: "error" }
      );
    }
  };

  const handleSelectAddress = (id) => {
    setAddresses({ ...addresses, selected: id });
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await axios.delete(`${config.endpoint}/user/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses({ ...addresses, all: response.data });
      enqueueSnackbar("Address deleted successfully", { variant: "success" });
    } catch (e) {
      enqueueSnackbar("Could not delete address.", { variant: "error" });
    }
  };
  // Fetch the entire products list
  const getProducts = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/products`);

      setProducts(response.data);
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  // Fetch cart data
  const fetchCart = async (token) => {
    if (!token) return;
    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch {
      enqueueSnackbar(
        "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
      return null;
    }
  };

  /**
   * Fetch list of addresses for a user
   *
   * API Endpoint - "GET /user/addresses"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "_id": "",
   *          "address": "Test address\n12th street, Mumbai"
   *      },
   *      {
   *          "_id": "BW0jAAeDJmlZCF8i",
   *          "address": "New address \nKolam lane, Chennai"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  

  /**
   * Handler function to add a new address and display the latest list of addresses
   *
   * @param { String } token
   *    Login token
   *
   * @param { NewAddress } newAddress
   *    Data on new address being added
   *
   * @returns { Array.<Address> }
   *    Latest list of addresses
   *
   * API Endpoint - "POST /user/addresses"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "_id": "",
   *          "address": "Test address\n12th street, Mumbai"
   *      },
   *      {
   *          "_id": "BW0jAAeDJmlZCF8i",
   *          "address": "New address \nKolam lane, Chennai"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */


  const addAddress = async (token, newAddress) => {
    try {
      const response = await axios.post(`${config.endpoint}/user/addresses`, 
      { address: newAddress.value }, 
      { headers: { Authorization: `Bearer ${token}` } });

      setAddresses({ ...addresses, all: response.data });
      setNewAddress({ isAddingNewAddress: false, value: "" });
      enqueueSnackbar("Address added successfully", { variant: "success" });
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not add this address. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  /**
   * Handler function to delete an address from the backend and display the latest list of addresses
   *
   * @param { String } token
   *    Login token
   *
   * @param { String } addressId
   *    Id value of the address to be deleted
   *
   * @returns { Array.<Address> }
   *    Latest list of addresses
   *
   * API Endpoint - "DELETE /user/addresses/:addressId"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "_id": "",
   *          "address": "Test address\n12th street, Mumbai"
   *      },
   *      {
   *          "_id": "BW0jAAeDJmlZCF8i",
   *          "address": "New address \nKolam lane, Chennai"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const deleteAddress = async (token, addressId) => {
    try {
      const response = await axios.delete(`${config.endpoint}/user/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses({ ...addresses, all: response.data });
      enqueueSnackbar("Address deleted successfully", { variant: "success" });
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not delete this address. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };
  // const handleDeleteAddress = async (addressId) => {
  //   try {
  //     const response = await axios.delete(`${config.endpoint}/user/addresses/${addressId}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setAddresses({ ...addresses, all: response.data });
  //     enqueueSnackbar("Address deleted successfully", { variant: "success" });
  //   } catch (e) {
  //     if (e.response) {
  //       enqueueSnackbar(e.response.data.message, { variant: "error" });
  //     } else {
  //       enqueueSnackbar(
  //         "Could not delete this address. Check that the backend is running, reachable and returns valid JSON.",
  //         {
  //           variant: "error",
  //         }
  //       );
  //     }
  //   }
  // };

  // TODO: CRIO_TASK_MODULE_CHECKOUT - Validate request for checkout
  /**
   * Return if the request validation passed. If it fails, display appropriate warning message.
   *
   * Validation checks - show warning message with given text if any of these validation fails
   *
   *  1. Not enough balance available to checkout cart items
   *    "You do not have enough balance in your wallet for this purchase"
   *
   *  2. No addresses added for user
   *    "Please add a new address before proceeding."
   *
   *  3. No address selected for checkout
   *    "Please select one shipping address to proceed."
   *
   * @param { Array.<CartItem> } items
   *    Array of objects with complete data on products added to the cart
   *
   * @param { Addresses } addresses
   *    Contains data on array of addresses and selected address id
   *
   * @returns { Boolean }
   *    Whether validation passed or not
   *
   */
  const validateRequest = (items, addresses) => {
    const balance = Number(localStorage.getItem("balance"));
    const totalCartValue = getTotalCartValue(items);
  
    if (balance < totalCartValue) {
      enqueueSnackbar("You do not have enough balance in your wallet for this purchase", { variant: "warning" });
      return false;
    }
  
    if (addresses.all.length === 0) {
      enqueueSnackbar("Please add a new address before proceeding.", { variant: "warning" });
      return false;
    }
  
    if (!addresses.selected) {
      enqueueSnackbar("Please select one shipping address to proceed.", { variant: "warning" });
      return false;
    }
  
    return true;
  };
  

  // TODO: CRIO_TASK_MODULE_CHECKOUT
  /**
   * Handler function to perform checkout operation for items added to the cart for the selected address
   *
   * @param { String } token
   *    Login token
   *
   * @param { Array.<CartItem } items
   *    Array of objects with complete data on products added to the cart
   *
   * @param { Addresses } addresses
   *    Contains data on array of addresses and selected address id
   *
   * @returns { Boolean }
   *    If checkout operation was successful
   *
   * API endpoint - "POST /cart/checkout"
   *
   * Example for successful response from backend:
   * HTTP 200
   * {
   *  "success": true
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *  "success": false,
   *  "message": "Wallet balance not sufficient to place order"
   * }
   *
   */
  const performCheckout = async (token, items, addresses) => {
    try {
      const response = await axios.post(
        `${config.endpoint}/cart/checkout`,
        { addressId: addresses.selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.success) {
        // Update user's balance
        const totalCartValue = getTotalCartValue(items);
        localStorage.setItem("balance", (Number(localStorage.getItem("balance")) - totalCartValue).toFixed(2));
  
        // Redirect to the Thanks page
        enqueueSnackbar("Order placed successfully", { variant: "success" });
        history.push("/thanks");
      } else {
        enqueueSnackbar(response.data.message || "Checkout failed", { variant: "error" });
      }
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message || "Checkout failed", { variant: "error" });
      } else {
        enqueueSnackbar("Could not complete checkout. Check that the backend is running, reachable and returns valid JSON.", { variant: "error" });
      }
    }
  };
  
  // TODO: CRIO_TASK_MODULE_CHECKOUT - Fetch addressses if logged in, otherwise show info message and redirect to Products page


  // Fetch products and cart data on page load
  useEffect(() => {
    const onLoadHandler = async () => {
      try {
        const productsData = await getProducts();

        const cartData = await fetchCart(token);

        if (productsData && cartData) {
          const cartDetails = await generateCartItemsFrom(
            cartData,
            productsData
          );
          setItems(cartDetails);
        }
      } finally {
        setCartLoading(false);
      }
    };
    onLoadHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

            <Box className="address-section">
              <Box className="address-section-head">
                <Typography className="address-section-title">
                  {addresses.selected
                    ? "Delivering to the address below"
                    : "Step 1 — Select a delivery address"}
                </Typography>
                {!addresses.selected && addresses.all.length > 0 && (
                  <Typography className="address-section-hint">
                    <InfoOutlined className="address-hint-icon" />
                    Tap an address to choose where this order should be
                    delivered.
                  </Typography>
                )}
              </Box>

              {loading ? (
                <Box>
                  {[0, 1].map((key) => (
                    <Skeleton
                      key={key}
                      variant="rectangular"
                      animation="wave"
                      height={76}
                      className="address-skeleton"
                    />
                  ))}
                </Box>
              ) : addresses.all.length > 0 ? (
                <RadioGroup
                  value={addresses.selected}
                  onChange={(e) => handleSelectAddress(e.target.value)}
                >
                  {addresses.all.map((item) => {
                    const isSelected = item._id === addresses.selected;
                    return (
                      <Box
                        key={item._id}
                        className={`address-card ${
                          isSelected ? "address-card-selected" : ""
                        }`}
                        onClick={() => handleSelectAddress(item._id)}
                      >
                        <Radio
                          checked={isSelected}
                          value={item._id}
                          size="small"
                          className="address-radio"
                          icon={<RadioButtonUnchecked />}
                          checkedIcon={<CheckCircle />}
                          inputProps={{ "aria-label": item.address }}
                        />

                        <Box className="address-card-body">
                          <Typography className="address-text">
                            {item.address}
                          </Typography>
                          {isSelected && (
                            <Typography className="address-badge">
                              <CheckCircle className="address-badge-icon" />
                              Delivering here
                            </Typography>
                          )}
                        </Box>

                        <Button
                          className="address-delete"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAddress(token, item._id);
                          }}
                        >
                          Delete
                        </Button>
                      </Box>
                    );
                  })}
                </RadioGroup>
              ) : (
                <Box className="address-empty">
                  <Typography className="address-empty-title">
                    No addresses saved yet
                  </Typography>
                  <Typography className="address-empty-text">
                    Add an address below to choose where your order should be
                    delivered.
                  </Typography>
                </Box>
              )}
            </Box>

            {/* TODO: CRIO_TASK_MODULE_CHECKOUT - Dislay either "Add new address" button or the <AddNewAddressView> component to edit the currently selected address */}
       
            {!newAddress.isAddingNewAddress ? (
                   <Button
                   color="primary"
                   variant="contained"
                   id="add-new-btn"
                   size="large"
                   onClick={() => {
                     setNewAddress((currNewAddress) => ({
                       ...currNewAddress,
                       isAddingNewAddress: true,
                     }));
                   }}
                 >
                   Add new address
               </Button>
            ) : (
              <AddNewAddressView
                token={token}
                newAddress={newAddress}
                handleNewAddress={setNewAddress}
                addAddress={addAddress}
              />
            )}

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
                Pay ${getTotalCartValue(items)} of available $
                {localStorage.getItem("balance")}
              </Typography>
            </Box>

            {!addresses.selected && (
              <Typography className="checkout-blocker">
                <InfoOutlined className="address-hint-icon" />
                Select a delivery address above to place your order.
              </Typography>
            )}

            <Button
              startIcon={<CreditCard />}
              variant="contained"
              onClick={async () => {
                if (validateRequest(items, addresses)) {
                  await performCheckout(token, items, addresses);
                }
              }}
            >
              PLACE ORDER
            </Button>

          </Box>
        </Grid>
        <Grid item xs={12} md={3} bgcolor="#E9F5E1">
          {cartLoading ? (
            <CartSkeleton isReadOnly rows={2} />
          ) : (
            <Cart isReadOnly products={products} items={items} />
          )}
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;
