const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { verifyToken } = require("../helper/utils");

// Create a new product
router.post("/", verifyToken, createProduct);

// Get all products
router.get("/", verifyToken, getAllProducts);

// Get a product by id
router.get("/:id", verifyToken, getProductById);

// Update a product
router.put("/:id", verifyToken, updateProduct);

// Delete a product
router.delete("/:id", verifyToken, deleteProduct);

module.exports = router;
