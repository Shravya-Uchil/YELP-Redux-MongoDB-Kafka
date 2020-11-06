import axios from "axios";
import { GET_CUSTOMER_HOME, SEARCH_RESTAURANTS } from "../actionTypes";
import serverAddress from "../config";

export const getCustomerDetailsHome = () => (dispatch) => {
  console.log("get customer for homepage");
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .get(
      `${serverAddress}/yelp/profile/customerById/${localStorage.getItem(
        "customer_id"
      )}`
    )
    .then((response) => response.data)
    .then((customer) =>
      dispatch({
        type: GET_CUSTOMER_HOME,
        payload: customer,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

export const searchRestaurantsHome = (searchStr) => (dispatch) => {
  console.log("search restaurants");
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .get(`${serverAddress}/yelp/restaurant/search/${searchStr}`)
    .then((response) => response.data)
    .then((restaurant) =>
      dispatch({
        type: SEARCH_RESTAURANTS,
        payload: restaurant,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};
