


const router = require("express").Router();
const orderCtrl = require("../controllers/order.controller");
const auth = require("../middleware/auth.middleware");


console.log("typeof auth =", typeof auth);
console.log("typeof createOrder =", typeof orderCtrl.createOrder);
console.log("typeof getMyOrders =", typeof orderCtrl.getMyOrders);


router.post("/", auth, orderCtrl.createOrder);
router.get("/me", auth, orderCtrl.getMyOrders);

module.exports = router;
