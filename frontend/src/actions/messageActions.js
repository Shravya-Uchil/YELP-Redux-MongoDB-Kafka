import axios from "axios";
import {
  GET_ALL_MESSAGES_RESTAURANT,
  GET_ALL_MESSAGES_CUSTOMER,
  GET_MESSAGE_DETAILS,
  SEND_MESSAGE,
} from "../actionTypes";
import serverAddress from "../config";

export const getAllMessagesCustomer = (customer_id) => (dispatch) => {
  console.log("get message for customer");
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .get(`${serverAddress}/yelp/message/getMessagesCustomer/${customer_id}`)
    .then((response) => response.data)
    .then((message) =>
      dispatch({
        type: GET_ALL_MESSAGES_CUSTOMER,
        payload: message,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

export const getAllMessagesRestaurant = (restaurant_id) => (dispatch) => {
  console.log("get message for customer");
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .get(`${serverAddress}/yelp/message/getMessagesRestaurant/${restaurant_id}`)
    .then((response) => response.data)
    .then((message) =>
      dispatch({
        type: GET_ALL_MESSAGES_CUSTOMER,
        payload: message,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

export const getMessageDetails = (restaurant_id, customer_id) => (dispatch) => {
  console.log("get message details");
  console.log("restaurant_id: ", restaurant_id);
  console.log("customer_id", customer_id);
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .get(
      `${serverAddress}/yelp/message/getMessageDetails/${restaurant_id}/${customer_id}`
    )
    .then((response) => response.data)
    .then((message) =>
      dispatch({
        type: GET_MESSAGE_DETAILS,
        payload: message,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};

export const sendMessage = (data) => (dispatch) => {
  console.log("sending message");
  console.log(data);
  axios.defaults.headers.common["authorization"] = localStorage.getItem(
    "token"
  );
  axios
    .post(`${serverAddress}/yelp/message/sendMessage`, data)
    .then((response) => response.data)
    .then((message) =>
      dispatch({
        type: SEND_MESSAGE,
        payload: message,
      })
    )
    .catch((error) => {
      console.log(error);
    });
};
