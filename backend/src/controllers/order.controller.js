const Order = require("../models/Order");
const Product = require("../models/Product");

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "items is required" });
    }

    // Charger produits et calculer total
    let total = 0;
    const normalizedItems = [];

    for (const it of items) {
      const { productId, qty } = it || {};
      if (!productId || !qty || qty < 1) {
        return res.status(400).json({ message: "each item needs productId and qty>=1" });
      }

      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: `product not found: ${productId}` });

      // Option MVP : vérifier stock + décrémenter
      if (product.stock < qty) {
        return res.status(400).json({ message: `not enough stock for ${product.name}` });
      }

      const price = product.price;
      total += price * qty;

      normalizedItems.push({ productId: product._id, qty, price });

      // décrément stock
      product.stock -= qty;
      await product.save();
    }

    const order = await Order.create({
      userId,
      items: normalizedItems,
      total,
      status: "CREATED",
    });

    return res.status(201).json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
