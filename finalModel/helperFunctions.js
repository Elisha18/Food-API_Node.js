
// helper functions to populate the Restraunts and Meals data into the database 

const Restaurant = require('./restraunt');
const  Meal = require('./meals');

const mongoose = require("mongoose");

const createRestaurant = function(restaurant){
    return Restaurant.create(restaurant).then(docRestraunt=>{
        console.log("\n>> Created Restraunt:\n", docRestraunt);
        return docRestraunt;
    })
}

const createMeal = function(meal){
    return Meal.create(meal).then(docMeal=>{
        console.log("\n>> Created Meal:\n", docMeal);
        return docMeal;
    })
}

const addMealToRestaurant = function(mealId, restaurantId) {
    return Meal.findByIdAndUpdate(
        mealId,
      { restaurant: restaurantId },
      { new: true, useFindAndModify: false }
    );
};


const getMealWithPopulate = function(id) {
    return Meal.findById(id)
      .populate("restaurant", "name -_id")
};

const getMealInRestaurant = function(restaurantId) {
    return Meal.find({restaurant:restaurantId})
      .populate("restaurant", "name -_id")
};

const run = async function(){
    var restaurant = await createRestaurant({
        name:"Restaurant2",
        type:"Chinese",
        description:"Chinese restraunt",
    })

    var meal = await createMeal({
        name:"Chicken Hakka Noodles",
        type:"Chinese",
        price:300,
        description:"Hakka noodles with chicken and vegetables",
        category:"Non-veg",
    })

    meal = await addMealToRestaurant(meal._id,restaurant._id);
    console.log("\n>> populated Meal:\n", meal);

    meal = await getMealWithPopulate(meal._id);
    console.log("\n>> populated Meal:\n", meal);

    var newMeal = await createMeal({
        name:"Butter Chicken",
        type:"Indian",
        price:200,
        description:"Indian Cuisine",
        category:"Non-veg"
      });

      await addMealToRestaurant(newMeal._id,restaurant._id);

      var meal = await getMealInRestaurant(restaurant._id);
      console.log("\n>> all Meals in Restraunts:\n", meal);
} 

mongoose.connect("mongodb://localhost/finalModel")
.then(()=>console.log("Successfully connect to MongoDB."))
.catch(err => console.error("Connection error", err));

run();