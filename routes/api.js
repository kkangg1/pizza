const express = require('express');
const db = require('../db');

const router = express.Router();

router.post('/cart', async (req, res) => {
  const query = 'SELECT * FROM products WHERE id = $1';
  const parameters = [req.body.product_id];
  const result = await db.query(query, parameters);

  const itemToAdd = {
    cart_id: req.session.nextCardId,
    product_id: result.rows[0].id,
    name: result.rows[0].name,
    quantity: req.body.quantity,
  };

  if (req.body.customizations) {
    const customizations = [];
    for (let i = 0; i < req.body.customizations.length; i++) {
      const customizationQuery = 'SELECT * FROM customizations WHERE id = $1';
      const customizationParameters = [req.body.customizations[i]];
      const customizationResult = await db.query(customizationQuery, customizationParameters);
      customizations.push({ id: req.body.customizations[i] });
    }
    itemToAdd.customizations = customizations;
  }
  req.session.cart.push(itemToAdd);
  req.session.cartCount += req.body.quantity;
  req.session.nextCartId += 1;

  res.json({
    cartCount: req.session.cartCount,
    cart: req.session.cart,
  });
});

router.get('/username', async (req, res) => {
  const selectQuery = 'SELECT * FROM customers WHERE username = $1 ';
  const selectResult = await db.query(selectQuery, [req.query.q]);
  res.json(selectResult.rows);
});

router.get('/password', async (req, res) => {
  let result = false;
  if (req.query.p !== req.query.pc) {
    result = true;
  }
  console.log(result);

  res.json(result);
});

router.post('/cart', async (req, res) => {
  const query = 'SELECT name FROM products WHERE products.id = $1';
  const param = [req.body.product_id];
  const result = await db.query(query, param);
  const len = req.session.cart.length;
  let tt = true;
  for (let i = 0; i < len; i += 1) {
    if (req.session.cart[i].product_id === req.body.product_id) {
      req.session.cart[i].quantity += req.body.quantity;
      tt = false;
    }
  }
  if (tt) {
    req.session.cart.push({
      cart_id: req.session.nextCartId,
      product_id: req.body.product_id,
      name: result.rows[0].name,
      quantity: req.body.quantity,
    });
    req.session.nextCartId += 1;
  }
  console.log(len);
  req.session.cartCount += req.body.quantity;
  res.json({
    cartCount: req.session.cartCount,
    cart: req.session.cart,
  });
});

module.exports = router;
