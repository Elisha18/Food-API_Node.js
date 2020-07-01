const Restaurant = require('./restraunt');
const  Meal = require('./meals');
const _ = require("lodash");
const auth = require('../middleware/auth');
const role = require('../middleware/admin');
const express = require('express');
const router = express.Router();

function handleError(res, err) {
    return res.send(500, err);
}

//Get list of meals
router.get("/",async(req, res)=> {
    const meal = await Meal
        .find()
        .populate("restaurant");
    return res.send(meal);
 
});


// Get a single meal
router.get("/:id", [auth, role.hasRoles("User")],async (req, res)=> {
    Meal.findById(req.params.id, function(err, meal) {
      if (err) {
        return handleError(res, err);
      }
      if (!meal) {
        return res.send(404);
      }
      return res.json(meal);
    })
    .populate("restaurant");
});

//create a Meal
//
router.post("/",[auth, role.hasRoles("Admin")],async(req,res)=>{
    Restaurant.create(req.body.restaurant,function(err){
        if(err){
            handleError(res,err);
        }

        const restaurant=[];

        for (let i = 0; i < arguments[1].length; i++) {
            restaurant.push(arguments[1][i]._id);
        }

        const meal = req.body;
        meal.restaurant = restaurant;

        Meal.create(meal,function(err,meals){
            if(err){
                return handleError(res,err);
            }
            meals.populate();
            return res.send(meal);
        })
    })
});


// Updates an existing Meal in the DB.
router.put("/:id",[auth, role.hasRoles("Admin")],(req, res)=> {
    if (req.body._id) {
      delete req.body._id;
    }
    Meal.findById(req.params.id, function(err, meal) {
      if (err) {
        return handleError(res, err);
      }
      if (!meal) {
        return res.send(404);
      }
      const updated = _.merge(meal, req.body);
      updated.save(function(err) {
        if (err) {
          return handleError(res, err);
        }
  
        return res.send(meal);
      });
    });
});

// Deletes a restaurant from the DB.
router.delete("/:id",[auth, role.hasRoles("Admin")],(req, res)=> {
    Meal.findById(req.params.id, function(err, meal) {
      if (err) {
        return handleError(res, err);
      }
      if (!meal) {
        return res.send(404);
      }
      meal.remove(function(err) {
        if (err) {
          return handleError(res, err);
        }
        return res.send(204);
      });
    });
});
  

module.exports = router;