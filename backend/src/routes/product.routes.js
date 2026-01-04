const router = require("express").Router();
const productCtrl = require("../controllers/product.controller");
const auth = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/isAdmin.middleware");

// Public
router.get("/", productCtrl.getProducts);
router.get("/:id", productCtrl.getProductById);

// Admin
router.post("/", auth, isAdmin, productCtrl.createProduct);
router.put("/:id", auth, isAdmin, productCtrl.updateProduct);
router.delete("/:id", auth, isAdmin, productCtrl.deleteProduct);

module.exports = router;
