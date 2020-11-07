import axios from "axios";
import {
  GET_RESTAURANT_HOME,
  GET_MENU_CATEGORY,
  GET_MENU_ITEM,
} from "../actionTypes";
import serverAddress from "../config";

export const getRestaurantById = (restaurant_id) => (dispatch) => {
  console.log("get restaurant for homepage");
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .get(`${serverAddress}/yelp/profile/restaurant/${restaurant_id}`)
    .then((response) => response.data)
    .then((restaurant) =>
      dispatch({
        type: GET_RESTAURANT_HOME,
        payload: restaurant,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

export const getMenuCategory = (restaurant_id) => (dispatch) => {
  console.log("get all categories restaurant homepage");
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .get(`${serverAddress}/yelp/menu/category/${restaurant_id}`)
    .then((response) => response.data)
    .then((menu_category) =>
      dispatch({
        type: GET_MENU_CATEGORY,
        payload: menu_category,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

export const getMenuItem = (restaurant_id) => (dispatch) => {
  console.log("get all menu items restaurant homepage");
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .get(`${serverAddress}/yelp/menu/items/${restaurant_id}`)
    .then((response) => response.data)
    .then((menu_item) =>
      dispatch({
        type: GET_MENU_ITEM,
        payload: menu_item,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};
