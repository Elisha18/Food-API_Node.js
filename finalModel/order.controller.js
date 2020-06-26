const Order = require("./order");
const _ = require("lodash");
const StateMachine = require("javascript-state-machine");
const user = require("./user.model");
const auth = require('../middleware/auth');
const role = require('../middleware/admin');

const express = require('express');
const router = express.Router();

function createStateMachine(order) {
    return new StateMachine({
      init: order.status,
      transitions: [
        { name: "cancelled", from: "placed", to: "cancelled" },
        { name: "processing", from: "placed", to: "processing" },
        { name: "in_route", from: "processing", to: "in_route" },
        { name: "delivered", from: "in_route", to: "delivered" },
        { name: "received", from: "delivered", to: "received" }
      ]
    });
}

function handleError(res, err) {
    return res.send(500, err);
}
  
// // Get list of orders
router.get("/",[auth, role.hasRoles("User")],(req, res)=>{
    Order.find({ user: req.user._id })
      .sort("-created_at")
      .populate("restaurant")
      .exec(function(err, orders) {
        if (err) {
          return handleError(res, err);
        }
        return res.send(orders);
      });
});

// // Get list of restaurant orders
router.get("/restaurant",[auth, role.hasRoles("Admin")],(req, res)=> {
    Order.find({restaurant: req.user._id })
      .populate("restaurant")
      .exec(function(err, orders) {
        if (err) {
          return handleError(res, err);
        }
        return res.send(orders);
      });
});

// Get a single order
router.get("/:id",[auth, role.hasRoles("User")],(req, res)=> {
    Order.findById(req.params.id)
      .populate("meal")
      .populate("user")
      .populate("restaurant")
      .exec(function(err, order) {
        if (err) {
          return handleError(res, err);
        }
  
        if (!order) {
          return res.send(404);
        }
  
        return res.send(order);
      });
});

// Create an order
router.post("/",[auth, role.hasRoles("User")],(req, res)=> {
    Order.create({ ...req.body, user: req.user._id }, function(err, order) {
      if (err) {
        return handleError(res, err);
      }
  
      order.populate();
  
      return res.json(201, order);
    });
});

// Updates an existing order in the DB.
router.put("/:id",[auth, role.hasRoles("User")],(req, res)=> {
    if (req.body._id) {
      delete req.body._id;
    }
    Order.findById(req.params.id, function(err, order) {
      if (err) {
        return handleError(res, err);
      }
      if (!order) {
        return res.send(404);
      }
      const fsm = createStateMachine(order);
      if (fsm.cannot(req.body.status))
        return res.status(403).json({
          status: `Not a valid transition from ${order.status} to ${req.body.status}.`
        });
      const updated = _.merge(order, req.body);
      updated.save(function(err) {
        if (err) {
          return handleError(res, err);
        }
  
        return res.json(200, order);
      });
    });
});
  
// Deletes a order from the DB.
router.delete("/:id",[auth, role.hasRoles("User")],(req, res)=> {
    Order.findById(req.params.id, function(err, order) {
      if (err) {
        return handleError(res, err);
      }
      if (!order) {
        return res.send(404);
      }
      order.remove(function(err) {
        if (err) {
          return handleError(res, err);
        }
        return res.send(204);
      });
    });
});

module.exports = router;