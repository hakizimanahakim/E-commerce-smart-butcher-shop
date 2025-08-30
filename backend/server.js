const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 3001;

// Security: restrict CORS to known origin
const ALLOWED_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json({ limit: '1mb' }));

// Auth helpers
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET || 'dev-secret-change-me';
  if (!process.env.JWT_SECRET) {
    console.warn('⚠️ Using default JWT secret. Set JWT_SECRET in environment for production.');
  }
  return secret;
};

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  jwt.verify(token, getJWTSecret(), (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// Add request logging
app.use((req, res, next) => {
    console.log(`📝 ${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// Serve static images from /public/images
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'butcher'
});

// Test database connection and create database/table if needed
db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        console.log('📝 Please ensure MySQL is running and create the database manually:');
        console.log('   1. Start MySQL server');
        console.log('   2. Run: CREATE DATABASE butcher;');
        console.log('   3. Run: USE butcher;');
        console.log('   4. Run: CREATE TABLE products (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), price DECIMAL(10,2), image VARCHAR(255), description TEXT);');
    } else {
        console.log('✅ Connected to MySQL database');

        // Create products table if it doesn't exist
        const createProductsTableQuery = `
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                image VARCHAR(255),
                description TEXT
            )
        `;

        // Create users table if it doesn't exist
        const createUsersTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'admin',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Create products table
        db.query(createProductsTableQuery, (err) => {
            if (err) {
                console.error('❌ Error creating products table:', err);
            } else {
                console.log('✅ Products table ready');

                // Create users table
                db.query(createUsersTableQuery, (err) => {
                    if (err) {
                        console.error('❌ Error creating users table:', err);
                    } else {
                        console.log('✅ Users table ready');

                        // Check if admin user exists, if not create one
                        db.query('SELECT * FROM users WHERE username = ?', ['admin'], (err, result) => {
                            if (err) {
                                console.error('❌ Error checking admin user:', err);
                            } else if (result.length === 0) {
                                // Create default admin user (password: admin123)
                                const saltRounds = 10;
                                bcrypt.hash('admin123', saltRounds, (err, hash) => {
                                    if (err) {
                                        console.error('❌ Error hashing password:', err);
                                    } else {
                                        db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                                            ['admin', hash, 'admin'], (err) => {
                                            if (err) {
                                                console.error('❌ Error creating admin user:', err);
                                            } else {
                                                console.log('✅ Default admin user created (username: admin, password: admin123)');
                                            }
                                        });
                                    }
                                });
                            } else {
                                console.log('✅ Admin user already exists');
                            }
                        });

                        // Check if test user exists, if not create one
                        db.query('SELECT * FROM users WHERE username = ?', ['user'], (err, result) => {
                            if (err) {
                                console.error('❌ Error checking test user:', err);
                            } else if (result.length === 0) {
                                // Create test user (username: user, password: user123)
                                const saltRounds = 10;
                                bcrypt.hash('user123', saltRounds, (err, hash) => {
                                    if (err) {
                                        console.error('❌ Error hashing test user password:', err);
                                    } else {
                                        db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                                            ['user', hash, 'user'], (err) => {
                                            if (err) {
                                                console.error('❌ Error creating test user:', err);
                                            } else {
                                                console.log('✅ Test user created (username: user, password: user123)');
                                            }
                                        });
                                    }
                                });
                            } else {
                                console.log('✅ Test user already exists');
                            }
                        });

                        // Ensure orders table exists with proper schema (no drop in production)
                        db.query(`CREATE TABLE IF NOT EXISTS orders (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            transaction_id VARCHAR(255),
                            customer_name VARCHAR(255),
                            customer_email VARCHAR(255),
                            customer_phone VARCHAR(20),
                            customer_address TEXT,
                            total DECIMAL(10,2),
                            currency VARCHAR(10) DEFAULT 'RWF',
                            items TEXT,
                            status VARCHAR(50) DEFAULT 'pending',
                            delivery_status VARCHAR(50) DEFAULT 'in_progress',
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        )`, (err) => {
                            if (err) {
                                console.error('❌ Error creating orders table:', err);
                            } else {
                                console.log('✅ Orders table ready');
                            }
                        });
                    }
                });

                // Clear old data and insert fresh sample data with correct URLs
                console.log('🔄 Refreshing product data...');
                db.query('DELETE FROM products', (err) => {
                    if (err) {
                        console.error('❌ Error clearing products:', err);
                    } else {
                        console.log('✅ Old product data cleared');

                        const sampleProducts = [
                            ['Beef chuck(iroti)', 8500, '/images/dicedchucksteak_600x.webp', 'Premium quality beef steak, perfect for grilling'],
                            ['Chicken Breast', 4500, '/images/Chicken-Breast-Kg-murukali-com-3453_512x512.webp', 'Fresh chicken breast, ideal for healthy meals'],
                            ['Pork Ribs', 6000, '/images/fitmeat-schweinefleisch-st.louis-cut-ribs-1.jpg', 'Tender pork ribs, great for BBQ'],
                            ['Ground Beef', 5500, '/images/9867ed76-505e-45ad-b076-11e5c83668a1.jpeg', 'Fresh ground beef for burgers and meatballs'],
                            ['Lamb Ribs', 9500, '/images/Lamb-Ribs-Plain-600x600-1.jpg', 'Succulent lamb ribs with rich flavor'],
                            ['Chicken Chest', 8000, '/images/Chicken-Chest--768x768.jpg', 'Delicious Chicken Chest, perfect for special occasions'],
                            ['Fish fillet', 6000, '/images/Tilapia-Fish-Fillet-murukali-com-2356.webp', 'Tender fish fillet, perfect for special occasions'],
                            ['Chicken Wings', 7000, '/images/raw-chicken-wings-1.jpg', 'Tender chicken wings, perfect for grilling'],
                            ['Beef Steak', 8500, '/images/76893-how-to-cook-rump-steak.jpg', 'Premium quality beef steak, perfect for grilling'],
                            ['Thompson Fish', 10000, '/images/Tomson-Fish1-scaled.jpg', 'Fresh Thompson Fish, perfect for special occasions'],
                            ['Beef Ribs', 7500, '/images/SpareRibs.webp', 'Tender Ribs, perfect for grilling'],
                            ['Whole Chicken', 12000, '/images/WhatsApp-Image-2024-10-16-at-19.19.55-500x500.jpeg', 'Fresh Whole Chicken, perfect for special occasions'],
                            ['Chicken Legs', 6500, '/images/chicken-legs-2.jpeg', 'Tender Chicken Legs, perfect for grilling'],
                            ['Beef Liver', 9000, '/images/WhatsApp-Image-2024-10-16-at-19.19.20-500x360.jpeg', 'Fresh Beef Liver, perfect for special occasions'],
                            ['Goat Meat', 10000, '/images/WhatsApp-Image-2024-10-16-at-19.18.54-500x500.jpeg', 'Fresh Goat Meat, perfect for special occasions']

                        ];

                        const insertQuery = 'INSERT INTO products (name, price, image, description) VALUES ?';
                        db.query(insertQuery, [sampleProducts], (err) => {
                            if (err) {
                                console.error('❌ Error inserting sample data:', err);
                            } else {
                                console.log('✅ Fresh sample products added to database');

                                // Create sample order
                                const sampleOrder = {
                                    transaction_id: 'TXN_SAMPLE_' + Date.now(),
                                    customer_name: 'John Uwimana',
                                    customer_email: 'customer@onegenesis.rw',
                                    customer_phone: '+250788123456',
                                    customer_address: 'Kigali - Gasabo - Kimironko, Near Kimironko Market',
                                    total: 15000,
                                    currency: 'RWF',
                                    items: JSON.stringify([
                                        {
                                            id: 1,
                                            name: 'Premium Beef',
                                            price: 5000,
                                            quantity: 2,
                                            image: '/images/beef.jpg'
                                        },
                                        {
                                            id: 2,
                                            name: 'Fresh Chicken',
                                            price: 2500,
                                            quantity: 2,
                                            image: '/images/chicken.jpg'
                                        }
                                    ]),
                                    status: 'paid',
                                    delivery_status: 'in_progress'
                                };

                                // Wait a moment for table structure updates, then create sample order
                                setTimeout(() => {
                                    db.query('SELECT COUNT(*) as count FROM orders WHERE transaction_id LIKE "TXN_SAMPLE_%"', (err, result) => {
                                        if (err) {
                                            console.error('❌ Error checking sample orders:', err);
                                        } else if (result[0].count === 0) {
                                            const orderSql = `INSERT INTO orders (
                                                transaction_id, customer_name, customer_email, customer_phone,
                                                customer_address, total, currency, items, status, delivery_status, created_at
                                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

                                            db.query(orderSql, [
                                                sampleOrder.transaction_id,
                                                sampleOrder.customer_name,
                                                sampleOrder.customer_email,
                                                sampleOrder.customer_phone,
                                                sampleOrder.customer_address,
                                                sampleOrder.total,
                                                sampleOrder.currency,
                                                sampleOrder.items,
                                                sampleOrder.status,
                                                sampleOrder.delivery_status
                                            ], (err) => {
                                                if (err) {
                                                    console.error('❌ Error creating sample order:', err);
                                                } else {
                                                    console.log('✅ Sample order created successfully');
                                                }
                                            });
                                        } else {
                                            console.log('✅ Sample order already exists');
                                        }
                                    });
                                }, 1000); // Wait 1 second for table updates
                            }
                        });
                    }
                });
            }
        });
    }
});

// Get all products (public)
app.get('/api/products', (req, res) => {
    console.log('📝 GET /api/products request received');
    db.query('SELECT * FROM products', (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({
                error: 'Database connection failed',
                message: 'Please ensure MySQL is running and the database is set up correctly'
            });
        }
        console.log(`📝 Found ${result.length} products in database`);
        res.json(result);
    });
});

// Update product (admin only)
app.put('/api/products/:id', authenticateToken, requireAdmin, (req, res) => {
    const { id } = req.params;
    const { name, price, description } = req.body;
    console.log(`✏️ PUT /api/products/${id} request received`);

    if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required' });
    }

    const sql = "UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?";
    db.query(sql, [name, price, description, id], (err, result) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).json({ error: 'Failed to update product' });
        }

        if (result.affectedRows === 0) {
            console.log(`❌ Product with ID ${id} not found`);
            return res.status(404).json({ error: 'Product not found' });
        }

        console.log(`✅ Product with ID ${id} updated successfully`);
        res.json({ message: 'Product updated successfully' });
    });
});

// Delete product (admin only)
app.delete('/api/products/:id', authenticateToken, requireAdmin, (req, res) => {
    const { id } = req.params;
    console.log(`🗑️ DELETE /api/products/${id} request received`);

    const sql = "DELETE FROM products WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ error: 'Failed to delete product' });
        }

        if (result.affectedRows === 0) {
            console.log(`❌ Product with ID ${id} not found`);
            return res.status(404).json({ error: 'Product not found' });
        }

        console.log(`✅ Product with ID ${id} deleted successfully`);
        res.json({ message: 'Product deleted successfully' });
    });
});



// Add a product (admin only)
app.post('/api/products', authenticateToken, requireAdmin, (req, res) => {
    const { name, price, image } = req.body;
    db.query(
        'INSERT INTO products (name, price, image) VALUES (?, ?, ?)',
        [name, price, image],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ id: result.insertId, name, price, image });
        }
    );
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user in database
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
        if (err) {
            console.error('❌ Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = result[0];

        // Compare password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('❌ Password comparison error:', err);
                return res.status(500).json({ error: 'Authentication error' });
            }

            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            // Generate JWT token
            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    role: user.role
                },
                getJWTSecret(),
                { expiresIn: '24h' }
            );

            console.log(`✅ User ${username} logged in successfully`);
            res.json({
                message: 'Login successful',
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });
        });
    });
});

// Create order after successful payment (public endpoint from payment callback)
app.post('/api/orders', async (req, res) => {
  const axios = require('axios');
  const {
    transaction_id,
    amount,
    currency,
    customer_email,
    customer_phone,
    customer_name,
    customer_address,
    items
  } = req.body;

  if (!transaction_id || !amount || !currency) {
    return res.status(400).json({ error: 'transaction_id, amount, and currency are required' });
  }

  try {
    const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
    if (!FLW_SECRET_KEY) {
      console.warn('⚠️ FLW_SECRET_KEY not set. Rejecting order creation in production.');
      // In dev you may choose to allow; for safety, we block here
      return res.status(500).json({ error: 'Payment verification not configured' });
    }

    // Verify transaction with Flutterwave
    const verifyUrl = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;
    const verifyRes = await axios.get(verifyUrl, {
      headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` }
    });

    const v = verifyRes.data?.data;
    if (!v) {
      return res.status(400).json({ error: 'Invalid verification response' });
    }

    // Check payment status and amounts
    if (v.status !== 'successful') {
      return res.status(400).json({ error: 'Payment not successful', details: v.status });
    }

    // Amount/currency checks
    const verifiedAmount = Number(v.amount);
    const verifiedCurrency = v.currency;
    if (verifiedAmount !== Number(amount) || verifiedCurrency !== currency) {
      return res.status(400).json({ error: 'Amount or currency mismatch', verifiedAmount, verifiedCurrency });
    }

    // Idempotency: ensure we do not duplicate by transaction_id
    db.query('SELECT id FROM orders WHERE transaction_id = ?', [transaction_id], (err, existing) => {
      if (err) {
        console.error('Error checking existing order:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (existing.length > 0) {
        return res.status(200).json({ message: 'Order already exists', orderId: existing[0].id });
      }

      const sql = `INSERT INTO orders (
        transaction_id,
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        total,
        currency,
        items,
        status,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

      const itemsJson = JSON.stringify(items || []);

      db.query(sql, [
        transaction_id,
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        verifiedAmount,
        verifiedCurrency,
        itemsJson,
        'paid'
      ], (err2, result) => {
        if (err2) {
          console.error('Error creating order:', err2);
          return res.status(500).json({ error: 'Failed to create order' });
        }

        res.json({
          message: 'Order created successfully',
          orderId: result.insertId
        });
      });
    });
  } catch (error) {
    console.error('Payment verification failed:', error.response?.data || error.message);
    res.status(400).json({ error: 'Payment verification failed', details: error.response?.data || error.message });
  }
});

app.get('/api/orders', authenticateToken, (req, res) => {
  const sql = "SELECT * FROM orders ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    // Parse items JSON for each order with error handling
    const ordersWithParsedItems = results.map(order => ({
      ...order,
      items: order.items ? (() => {
        try {
          return JSON.parse(order.items);
        } catch (e) {
          console.error('Error parsing order items:', e);
          return [];
        }
      })() : []
    }));

    res.json(ordersWithParsedItems);
  });
});

app.put('/api/orders/:id', authenticateToken, requireAdmin, (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  const sql = "UPDATE orders SET status = ? WHERE id = ?";
  db.query(sql, [status, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Status updated successfully' });
  });
});

// Update delivery status (allow authenticated users)
app.put('/api/orders/:id/delivery', authenticateToken, (req, res) => {
  const { delivery_status } = req.body;
  const { id } = req.params;
  const sql = "UPDATE orders SET delivery_status = ? WHERE id = ?";
  db.query(sql, [delivery_status, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Delivery status updated successfully' });
  });
});

// User management endpoints
app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
  const sql = "SELECT id, username, role, created_at FROM users ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post('/api/users', authenticateToken, requireAdmin, (req, res) => {
  const { username, password, role = 'user' } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Check if username already exists
  const checkSql = "SELECT id FROM users WHERE username = ?";
  db.query(checkSql, [username], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password and create user
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ error: 'Failed to create user' });
      }

      const insertSql = "INSERT INTO users (username, password, role, created_at) VALUES (?, ?, ?, NOW())";
      db.query(insertSql, [username, hash, role], (err, result) => {
        if (err) {
          console.error('Error creating user:', err);
          return res.status(500).json({ error: 'Failed to create user' });
        }

        res.json({
          message: 'User created successfully',
          userId: result.insertId,
          username: username,
          role: role
        });
      });
    });
  });
});

app.delete('/api/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;

  // Prevent deletion of admin user (assuming admin has id 1)
  if (id === '1') {
    return res.status(400).json({ error: 'Cannot delete admin user' });
  }

  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  });
});


// Start server
app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
    console.log(`📝 Test the API at: http://localhost:${port}/api/products`);
});
