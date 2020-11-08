import axios from "axios";
import {
  GET_ORDERS,
  UPDATE_ORDER_STATUS,
  UPDATE_DELIVERY_STATUS,
} from "../actionTypes";
import serverAddress from "../config";

export const getOrders = () => (dispatch) => {
  console.log("get action");
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .get(
      `${serverAddress}/yelp/order/restaurant/allOrders/${localStorage.getItem(
        "restaurant_id"
      )}`
    )
    .then((response) => response.data)
    .then((orders) =>
      dispatch({
        type: GET_ORDERS,
        payload: orders,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

export const updateOrderStatus = (input) => (dispatch) => {
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .post(`${serverAddress}/yelp/order/restaurant/updateOrderStatus`, input)
    .then((response) => response.data)
    .then((data) =>
      dispatch({
        type: UPDATE_ORDER_STATUS,
        payload: data,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

export const updateDeliveryStatus = (input) => (dispatch) => {
  console.log("get action");
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .post(`${serverAddress}/yelp/order/restaurant/updateDeliveryStatus`, input)
    .then((response) => response.data)
    .then((data) =>
      dispatch({
        type: UPDATE_DELIVERY_STATUS,
        payload: data,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};
