const Restaurant = require("./restraunt");
const Meal = require("./meals");
const _ = require("lodash");
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/admin');

function handleError(res, err) {
  return res.send(500, err);
}

// Get list of restaurants
router.get("/",async (req, res)=> {
    // Restaurant.find(function(err, restaurant) {
    //   if (err) {
    //     return handleError(res, err);
    //   }
    //   return res.send(restaurant);
    // });
    const restaurant = await Restaurant.find()
    .select("-__v")
    .sort("name");
  res.send(restaurant);
});

// Get a single restaurants
//,[auth, role.hasRoles("User")]
router.get("/:id",(req, res)=> {
    Restaurant.findById(req.params.id, function(err, restaurant) {
      if (err) {
        return handleError(res, err);
      }
      if (!restaurant) {
        return res.send(404);
      }
      
      return res.send(restaurant);
    });
  });


// Create a restraunt
//[auth,role.hasRoles("Admin")],
router.post("/",[auth,role.hasRoles("Admin")],(req, res)=> {
    Restaurant.create(req.body, function(err, restaurant) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(restaurant);
    });
});

// Updates an existing restaurant in the DB.
//,[auth,role.hasRoles("Admin")]
router.put("/:id",[auth,role.hasRoles("Admin")],(req, res)=> {
    if (req.body._id) {
      delete req.body._id;
    }
    Restaurant.findById(req.params.id, function(err, restaurant) {
      if (err) {
        return handleError(res, err);
      }
      if (!restaurant) {
        return res.send(404);
      }
      const updated = _.merge(restaurant, req.body);
      updated.save(function(err) {
        if (err) {
          return handleError(res, err);
        }
  
        return res.send(restaurant);
      });
    });
  });


// Deletes a meal from the DB.
router.delete("/:id",[auth,role.hasRoles("Admin")],(req, res)=> {
    Restaurant.findById(req.params.id, function(err, restaurant) {
      if (err) {
        return handleError(res, err);
      }
      if (!restaurant) {
        return res.send(404);
      }
      restaurant.remove(function(err) {
        if (err) {
          return handleError(res, err);
        }
        return res.send(204);
      });
    });
  });

module.exports = router;