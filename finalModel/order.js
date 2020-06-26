const mongoose = require("mongoose"),
  Schema = mongoose.Schema;



const OrderSchema = new Schema({
  total_amount: { type: Number, required: true },
  status: { type: String, required: true, default: "placed" },
  created_at: {
    type: Date,
    default: Date.now
  },
  meal: [{ type: Schema.ObjectId, ref: "Meal" }],
  user: { type: Schema.ObjectId, ref: "User" },
  restaurant: { type: Schema.ObjectId, ref: "Restaurant" }
});


// const meal = require("./meals");
// const restaurant = require("./restraunt");
// const user = require("./user.model");

// const Order = mongoose.model("Order", OrderSchema)


// const createOrder = function(order){
//    return Order.create(order).then(docOrder=>{
//     return docOrder;
// })
// }

// const addOrderToReferences = function(orderId, restaurantId, mealId, userId) {
//     return Order.findByIdAndUpdate(
//         orderId,
//       { restaurant: restaurantId },
//       { new: true, useFindAndModify: false }
//     );
// };

// const addMealtoOrder = function(orderId,mealId){
//     return Order.findByIdAndUpdate(
//         orderId,
//       {meal:mealId},
//       { new: true, useFindAndModify: false }
//     );
// }

// const addUsertoOrder = function(orderId,userId){
//     return Order.findByIdAndUpdate(
//         orderId,
//         {user:userId},
//         { new: true, useFindAndModify: false }
//     );
// }

// const run = async function(){
//     var order = await createOrder({
//         total_amount:150,
//         status:"placed",
//     })

   

//     await addOrderToReferences(order._id,"5ef2214bd4e8eeafc0d471f9");
//     await addMealtoOrder(order._id,"5ef2214bd4e8eeafc0d471fa");
//     await addUsertoOrder(order._id,"5ef245fd08a9e2b9b0f7bcf5");
// }

// mongoose.connect("mongodb://localhost/finalModel")
// .then(()=>console.log("Successfully connect to MongoDB."))
// .catch(err => console.error("Connection error", err));

// run();






module.exports = Order = mongoose.model("Order", OrderSchema);