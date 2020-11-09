import axios from "axios";
import {
  GET_MENU_ITEM_CUST,
  GET_MENU_CATEGORY_CUST,
  HAS_REVIEWED,
  PLACE_ORDER,
  ADD_REVIEW,
} from "../actionTypes";
import serverAddress from "../config";

export const getMenuCategoryCustomer = (restaurant_id) => (dispatch) => {
  console.log("get all categories restaurant customer action");
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .get(`${serverAddress}/yelp/menu/category/${restaurant_id}`)
    .then((response) => response.data)
    .then((menu_category) =>
      dispatch({
        type: GET_MENU_CATEGORY_CUST,
        payload: menu_category,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

export const getMenuItemCustomer = (restaurant_id) => (dispatch) => {
  console.log("get all menu items restaurant customer action");
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .get(`${serverAddress}/yelp/menu/items/${restaurant_id}`)
    .then((response) => response.data)
    .then((menu_item) =>
      dispatch({
        type: GET_MENU_ITEM_CUST,
        payload: menu_item,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

export const hasReviewed = (customer_id, restaurant_id) => (dispatch) => {
  console.log("has customer reviewed restaurant");
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .get(
      `${serverAddress}/yelp/restaurant/hasReviewed/${customer_id}/${restaurant_id}`
    )
    .then((response) => response.data)
    .then((review) =>
      dispatch({
        type: HAS_REVIEWED,
        payload: review,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

export const placeOrder = (data) => (dispatch) => {
  console.log("place order", data);
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .post(`${serverAddress}/yelp/order/customer/placeorder`, data)
    .then((response) => response.data)
    .then((result) =>
      dispatch({
        type: PLACE_ORDER,
        payload: result,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

export const addReview = (data) => (dispatch) => {
  console.log("Add review", data);
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .post(`${serverAddress}/yelp/restaurant/restaurantReview`, data)
    .then((response) => response.data)
    .then((result) =>
      dispatch({
        type: ADD_REVIEW,
        payload: result,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};
