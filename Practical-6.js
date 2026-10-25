/**
 * ============================================================================
 * PRACTICAL 6: Create a backend server using Express.js implementing
 *              routing, middleware and request handling.
 * ============================================================================
 * Concepts Demonstrated:
 *  1. Express.js Application Server Setup & Configuration
 *  2. Middleware (express.json, CORS, Custom Request Logger, Error Handler)
 *  3. Modular Routing via express.Router()
 *  4. Full CRUD Operations (Create, Read, Update, Delete) with HTTP Verbs:
 *     - GET    /api/products       (Read all with query search & filter)
 *     - GET    /api/products/:id   (Read single item by ID)
 *     - POST   /api/products       (Create new item with validation)
 *     - PUT    /api/products/:id   (Full update of an existing item)
 *     - PATCH  /api/products/:id   (Partial update of specific fields)
 *     - DELETE /api/products/:id   (Remove item by ID)
 *  5. Proper HTTP Status Codes (200, 201, 400, 404, 500)
 * ============================================================================
 * How to Run:
 *   node Practical-6.js
 * Default Port: 5000 (Access at http://localhost:5000)
 * ============================================================================
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// -------------------------------------------------------------
// 1. CORE MIDDLEWARE
// -------------------------------------------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Request Logger Middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// -------------------------------------------------------------
// 2. IN-MEMORY DATA STORE (Products Resource)
// -------------------------------------------------------------
let products = [
  { id: 1, name: 'Mechanical Keyboard RGB', category: 'Electronics', price: 3499, inStock: true, stockQuantity: 25 },
  { id: 2, name: 'Wireless Ergonomic Mouse', category: 'Electronics', price: 1899, inStock: true, stockQuantity: 40 },
  { id: 3, name: 'Full HD IPS Monitor 24"', category: 'Displays', price: 8999, inStock: false, stockQuantity: 0 },
  { id: 4, name: 'USB-C Fast Charging Hub', category: 'Accessories', price: 1299, inStock: true, stockQuantity: 50 }
];

let nextId = 5;

// -------------------------------------------------------------
// 3. EXPRESS ROUTER FOR CRUD OPERATIONS (/api/products)
// -------------------------------------------------------------
const productRouter = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products with optional query filtering (?category=... & search=...)
 */
productRouter.get('/', (req, res) => {
  let result = [...products];
  const { category, search } = req.query;

  // Filter by category
  if (category) {
    result = result.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Search by name
  if (search) {
    result = result.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  return res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });
});

/**
 * @route   GET /api/products/:id
 * @desc    Get a single product by numeric ID
 */
productRouter.get('/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);

  if (isNaN(productId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product ID. ID must be an integer.'
    });
  }

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: `Product with ID ${productId} not found.`
    });
  }

  return res.status(200).json({
    success: true,
    data: product
  });
});

/**
 * @route   POST /api/products
 * @desc    Create a new product record
 */
productRouter.post('/', (req, res) => {
  const { name, category, price, stockQuantity } = req.body;

  // Input Validation
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Product "name" is required and must be a valid non-empty string.'
    });
  }

  if (price === undefined || typeof price !== 'number' || price < 0) {
    return res.status(400).json({
      success: false,
      message: 'Product "price" is required and must be a non-negative number.'
    });
  }

  const newProduct = {
    id: nextId++,
    name: name.trim(),
    category: category ? category.trim() : 'General',
    price: Number(price),
    inStock: stockQuantity !== undefined ? Number(stockQuantity) > 0 : true,
    stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : 10
  };

  products.push(newProduct);

  return res.status(201).json({
    success: true,
    message: 'Product created successfully.',
    data: newProduct
  });
});

/**
 * @route   PUT /api/products/:id
 * @desc    Full update of an existing product record
 */
productRouter.put('/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const { name, category, price, inStock, stockQuantity } = req.body;

  const productIndex = products.findIndex((p) => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Cannot update. Product with ID ${productId} does not exist.`
    });
  }

  // Validate required fields for full PUT replacement
  if (!name || price === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Full update requires both "name" and "price" fields.'
    });
  }

  products[productIndex] = {
    id: productId,
    name: name.trim(),
    category: category || products[productIndex].category,
    price: Number(price),
    inStock: inStock !== undefined ? Boolean(inStock) : Number(stockQuantity) > 0,
    stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : 0
  };

  return res.status(200).json({
    success: true,
    message: `Product ID ${productId} updated successfully.`,
    data: products[productIndex]
  });
});

/**
 * @route   PATCH /api/products/:id
 * @desc    Partial update of specific fields
 */
productRouter.patch('/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const productIndex = products.findIndex((p) => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Cannot patch. Product with ID ${productId} does not exist.`
    });
  }

  const existing = products[productIndex];
  const { name, category, price, inStock, stockQuantity } = req.body;

  if (name !== undefined) existing.name = name.trim();
  if (category !== undefined) existing.category = category.trim();
  if (price !== undefined) existing.price = Number(price);
  if (stockQuantity !== undefined) {
    existing.stockQuantity = Number(stockQuantity);
    existing.inStock = Number(stockQuantity) > 0;
  }
  if (inStock !== undefined) existing.inStock = Boolean(inStock);

  return res.status(200).json({
    success: true,
    message: `Product ID ${productId} partially updated.`,
    data: existing
  });
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product by ID
 */
productRouter.delete('/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const productIndex = products.findIndex((p) => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Cannot delete. Product with ID ${productId} not found.`
    });
  }

  const deletedProduct = products.splice(productIndex, 1)[0];

  return res.status(200).json({
    success: true,
    message: `Product "${deletedProduct.name}" (ID ${productId}) successfully removed.`,
    deletedProduct
  });
});

// Mount the Router
app.use('/api/products', productRouter);

// -------------------------------------------------------------
// 4. ROOT DASHBOARD & DOCUMENTATION ROUTE
// -------------------------------------------------------------
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Practical 6 - Express.js Routing & Middleware Server</title>
        <style>
          body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; line-height: 1.6; }
          .container { max-width: 800px; margin: 0 auto; background: #1e293b; padding: 32px; border-radius: 12px; border: 1px solid #334155; }
          h1 { color: #38bdf8; margin-bottom: 8px; }
          .endpoint { background: #0f172a; padding: 12px; border-radius: 6px; margin: 10px 0; font-family: monospace; }
          .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-weight: bold; margin-right: 8px; }
          .get { background: #0284c7; color: white; }
          .post { background: #16a34a; color: white; }
          .put { background: #ea580c; color: white; }
          .patch { background: #ca8a04; color: white; }
          .delete { background: #dc2626; color: white; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Express.js Routing, Middleware & Request Handling</h1>
          <p>Practical 6 Backend Server is Running on port <strong>${PORT}</strong>.</p>
          <hr style="border: 1px solid #334155; margin: 20px 0;" />
          <h3>Available API Endpoints:</h3>
          <div class="endpoint"><span class="badge get">GET</span> <a href="/api/products" style="color: #38bdf8;">/api/products</a> - Get all products</div>
          <div class="endpoint"><span class="badge get">GET</span> /api/products/:id - Get single product</div>
          <div class="endpoint"><span class="badge post">POST</span> /api/products - Create new product (JSON body)</div>
          <div class="endpoint"><span class="badge put">PUT</span> /api/products/:id - Full update of product</div>
          <div class="endpoint"><span class="badge patch">PATCH</span> /api/products/:id - Partial update of product</div>
          <div class="endpoint"><span class="badge delete">DELETE</span> /api/products/:id - Remove product</div>
        </div>
      </body>
    </html>
  `);
});

// -------------------------------------------------------------
// 5. GLOBAL 404 & ERROR HANDLING MIDDLEWARE
// -------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}. Route not found.`
  });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

// -------------------------------------------------------------
// 6. SERVER STARTUP
// -------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Practical 6 Express Routing & Middleware Server Running!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📡 Products API: http://localhost:${PORT}/api/products`);
  console.log(`=======================================================`);
});

module.exports = app;
