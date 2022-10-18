const express = require("express");
const userController = require("./../controllers/trackerController");
const router = express.Router();


router
    .route("/")
    .get(userController.getAllUsers)
    .post(userController.createNewUser);

router
    .route("/:id/exercise")
    .post()
    

module.exports = router;