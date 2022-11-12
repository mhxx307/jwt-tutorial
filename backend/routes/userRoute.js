const userController = require("../controllers/userController");
const middlewareController = require("../controllers/middlewareController");
const router = require("express").Router();

router.get("/users", middlewareController.verifyToken, userController.getAllUsers);

router.delete("/users/:id", middlewareController.verifyTokenAndAdmin, userController.deleteUser);

module.exports = router;
