const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Public routes (no authentication required)
router.post("/login", userController.loginUser);
router.post("/", userController.createUser);

// Protected routes (authentication required)
router.get("/", authMiddleware, userController.getUsers);
router.get("/:id", authMiddleware, userController.getUser);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  userController.updateUser
); // Only admin
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  userController.deleteUser
); // Only admin

module.exports = router;
