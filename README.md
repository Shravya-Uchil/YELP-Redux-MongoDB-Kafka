# YELP-prototype  
## Tech StACK - Mongo DB, EXPRESS, React.js, Redux, Node.js, Kafka   
## Deployment Steps 
Install node.js
### Back End  
Git clone the backend folder.  
Open the terminal in the folder "backend".  
Execute "npm install" or "npm i" to install all the dependencies.  
Create database in MySQL and import yelp-mysql.sql.  
Update mySqlDB.js to include the database connection details.
Update app.js to include front end server port.  
Run node index.js  

### Kafka Back End 
Download Kafka zip and install in your local machine  
Download Zookeper and install on your local machine  
Create topics as mentioned in server.js file  
Git clone the kafka-backend folder.  
Open the terminal in the folder "kafka-backend".  
Execute "npm install" or "npm i" to install all the dependencies.  
Create an accound in https://www.mongodb.com/cloud/atlas. Fetch the connection uri and update this path in config/config.js file    
Update app.js to include front end server port.  
Run node server.js  

### Front End  
Git clone the frontend folder.  
Open the terminal in the folder "frontend".  
Execute "npm start" to run the front end server.
Run npm start.  
  
This will launch the application  
Install REDUX Dev tools extension on chrome to see the Redux status changes  
  
Open the browser and navigate to Front end server's IP address with Port number (Eg: 127.0.0.1:3000)
