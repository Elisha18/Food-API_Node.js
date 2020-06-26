const config = require("../config/roles");

function hasRoles(roleRequired){
    return function(req, res, next) {
        if (
          config.userRoles.indexOf(req.user.role) >=
          config.userRoles.indexOf(roleRequired)
        ) {
          next();
        } else {
          res.send(403);
        }
    }
}

exports.hasRoles = hasRoles;

