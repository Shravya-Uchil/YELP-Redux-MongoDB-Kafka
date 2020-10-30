var connection = new require("./kafka/connection");

//topics files
const signupService = require("./services/signup");
const loginService = require("./services/login");

const mongoose = require("mongoose");

const { mongoDBURI } = require("./config/config");
//connect to mongoDB

const connectMongoDB = async () => {
  const options = {
    poolSize: 900,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };

  try {
    await mongoose.connect(mongoDBURI, options);
    console.log("MongoDB connected");
  } catch (err) {
    console.log("Could not connect to MongoDB", err);
  }
};
connectMongoDB();

function handleTopicRequest(topic_name, fname) {
  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();
  console.log(producer);
  console.log("server is running ");
  consumer.on("message", function (message) {
    console.log("message received for " + topic_name + " ", fname);
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    fname.handle_request(data.data, (err, res) => {
      console.log("in callback, producer:");
      console.log(producer);
      //response(data, res, err, producer);
      var payloads = [
        {
          topic: data.replyTo,
          messages: JSON.stringify({
            correlationId: data.correlationId,
            data: res,
          }),
          partition: 0,
        },
      ];
      producer.send(payloads, function (err, data) {
        //console.log('producer send', data);
        if (err) {
          console.log("Error when producer sending data", err);
        } else {
          console.log(data);
        }
      });
      return;
    });
  });
}

function response(data, res, producer) {
  console.log("after handle", res);
  var payloads = [
    {
      topic: data.replyTo,
      messages: JSON.stringify({
        correlationId: data.correlationId,
        data: res,
      }),
      partition: 0,
    },
  ];
  producer.send(payloads, function (err, data) {
    //console.log('producer send', data);
    if (err) {
      console.log("Error when producer sending data", err);
    } else {
      console.log(data);
    }
  });
  return;
}

// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("signup-topic", signupService);
handleTopicRequest("login-topic", loginService);