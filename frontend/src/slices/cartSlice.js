import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";
//check localstorage item in the cart, if there is something there hold string, parse it as an object else then initialstate can be an object with empty array
const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [] };

const addDecimals = (num) => {
  return Math.round((num * 100) / 100).toFixed(2);
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  //reducer has function to do with cart, simply logic
  reducers: {
    addToCart: (state, action) => {
      //item to add to the cart with fields
      const item = action.payload;

      //check to see if item is already in the cart
      //current item x's id is equal to the item from action/payload id, put the item in variable
      const existItem = state.cartItems.find((x) => x._id === item._id);
      //if item exists take state.cartitems and map through
      //if x._id is equal to the exist item id then return item and if not return whatever the item is we are looping through
      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        //else add new items by spreading across what is already there
        state.cartItems = [...state.cartItems];
      }
      return updateCart(state);
    },
  },
});
export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;
