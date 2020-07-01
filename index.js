const mongoose = require('mongoose');
const config = require("config");
const meal = require("./finalModel/meal.controller");
const restaurant = require("./finalModel/restraunt.controller");
const order = require("./finalModel/order.controller");
const user = require("./finalModel/user.index");
const auth = require('./finalModel/auth');
const express = require('express');
const app = express();

require("./startup/cors")(app);

if(!config.get('jwtPrivateKey')){
  console.log("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
} 

const db = config.get('db');
mongoose.connect(db)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...',err));

app.use(express.json());
app.use('/api/meals',meal);
app.use('/api/restraunt',restaurant);
app.use('/api/order',order);
app.use('/api/user',user);
app.use('/api/auth',auth);

const port = process.env.PORT || config.get("port");
app.listen(port, () => console.log(`Listening on port ${port}...`));