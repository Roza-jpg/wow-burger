import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');
const publicPath = path.join(__dirname, '..', 'public');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(publicPath));
app.use('/images', express.static(path.join(publicPath, 'images')));

const readDB = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return { branches: [], categories: [], foods: [], branchFoodStatus: [], users: [], reviews: [], orders: [] };
  }
};

const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

// AUTH
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid email or password' });
  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

// BRANCHES
app.get('/api/branches', (req, res) => {
  res.json(readDB().branches);
});
app.post('/api/branches', (req, res) => {
  const db = readDB();
  const newId = db.branches.length > 0 ? Math.max(...db.branches.map(b => b.id)) + 1 : 1;
  const newBranch = { id: newId, ...req.body, status: req.body.status || 'Active' };
  db.branches.push(newBranch);
  db.foods.forEach(f => db.branchFoodStatus.push({ branchId: newId, foodId: f.id, active: true }));
  writeDB(db);
  res.status(201).json(newBranch);
});
app.put('/api/branches/:id', (req, res) => {
  const db = readDB();
  const index = db.branches.findIndex(b => String(b.id) === String(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Branch not found' });
  db.branches[index] = { ...db.branches[index], ...req.body, id: Number(req.params.id) };
  writeDB(db);
  res.json(db.branches[index]);
});
app.delete('/api/branches/:id', (req, res) => {
  const db = readDB();
  db.branches = db.branches.filter(b => String(b.id) !== String(req.params.id));
  db.branchFoodStatus = db.branchFoodStatus.filter(s => String(s.branchId) !== String(req.params.id));
  writeDB(db);
  res.json({ message: 'Branch deleted' });
});

// CATEGORIES
app.get('/api/categories', (req, res) => {
  res.json(readDB().categories);
});
app.post('/api/categories', (req, res) => {
  const db = readDB();
  const newId = db.categories.length > 0 ? Math.max(...db.categories.map(c => c.id)) + 1 : 1;
  const newCat = { id: newId, ...req.body };
  db.categories.push(newCat);
  writeDB(db);
  res.status(201).json(newCat);
});
app.put('/api/categories/:id', (req, res) => {
  const db = readDB();
  const index = db.categories.findIndex(c => String(c.id) === String(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Category not found' });
  db.categories[index] = { ...db.categories[index], ...req.body, id: Number(req.params.id) };
  writeDB(db);
  res.json(db.categories[index]);
});
app.delete('/api/categories/:id', (req, res) => {
  const db = readDB();
  db.categories = db.categories.filter(c => String(c.id) !== String(req.params.id));
  writeDB(db);
  res.json({ message: 'Category deleted' });
});

// FOODS
app.get('/api/foods', (req, res) => {
  res.json(readDB().foods);
});
app.get('/api/foods/:id', (req, res) => {
  const db = readDB();
  const food = db.foods.find(f => String(f.id) === String(req.params.id));
  if (!food) return res.status(404).json({ message: 'Food not found' });
  const reviews = (db.reviews || []).filter(r => String(r.foodId) === String(req.params.id));
  res.json({ ...food, reviews });
});
app.post('/api/foods/:id/reviews', (req, res) => {
  const db = readDB();
  if (!db.reviews) db.reviews = [];
  const newId = db.reviews.length > 0 ? Math.max(...db.reviews.map(r => r.id)) + 1 : 1;
  const review = { id: newId, foodId: Number(req.params.id), author: req.body.author || 'Valued Customer', rating: Number(req.body.rating) || 5, comment: req.body.comment || '', date: new Date().toISOString().split('T')[0] };
  db.reviews.push(review);
  writeDB(db);
  res.status(201).json(review);
});
app.post('/api/foods', (req, res) => {
  const db = readDB();
  const newId = db.foods.length > 0 ? Math.max(...db.foods.map(f => f.id)) + 1 : 101;
  const newFood = { id: newId, categoryId: Number(req.body.categoryId), price: Number(req.body.price), isPopular: !!req.body.isPopular, image: req.body.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', ...req.body, id: newId };
  db.foods.push(newFood);
  db.branches.forEach(b => db.branchFoodStatus.push({ branchId: b.id, foodId: newId, active: true }));
  writeDB(db);
  res.status(201).json(newFood);
});
app.put('/api/foods/:id', (req, res) => {
  const db = readDB();
  const index = db.foods.findIndex(f => String(f.id) === String(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Food not found' });
  db.foods[index] = { ...db.foods[index], ...req.body, id: Number(req.params.id), categoryId: req.body.categoryId ? Number(req.body.categoryId) : db.foods[index].categoryId, price: req.body.price ? Number(req.body.price) : db.foods[index].price };
  writeDB(db);
  res.json(db.foods[index]);
});
app.delete('/api/foods/:id', (req, res) => {
  const db = readDB();
  db.foods = db.foods.filter(f => String(f.id) !== String(req.params.id));
  db.branchFoodStatus = db.branchFoodStatus.filter(s => String(s.foodId) !== String(req.params.id));
  writeDB(db);
  res.json({ message: 'Food deleted' });
});

// USERS
app.get('/api/users', (req, res) => {
  const db = readDB();
  res.json(db.users.map(({ password: _, ...u }) => u));
});
app.post('/api/users', (req, res) => {
  const db = readDB();
  const newId = db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1;
  const newUser = { id: newId, ...req.body };
  db.users.push(newUser);
  writeDB(db);
  const { password: _, ...safe } = newUser;
  res.status(201).json(safe);
});
app.put('/api/users/:id', (req, res) => {
  const db = readDB();
  const index = db.users.findIndex(u => String(u.id) === String(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'User not found' });
  db.users[index] = { ...db.users[index], ...req.body, id: Number(req.params.id) };
  writeDB(db);
  const { password: _, ...safe } = db.users[index];
  res.json(safe);
});
app.delete('/api/users/:id', (req, res) => {
  const db = readDB();
  db.users = db.users.filter(u => String(u.id) !== String(req.params.id));
  writeDB(db);
  res.json({ message: 'User deleted' });
});

// BRANCH FOOD VISIBILITY (Admin)
app.get('/api/branches/:branchId/foods', (req, res) => {
  const db = readDB();
  const branch = db.branches.find(b => String(b.id) === String(req.params.branchId));
  if (!branch) return res.status(404).json({ message: 'Branch not found' });
  const foods = db.foods.map(food => {
    const status = db.branchFoodStatus.find(s => String(s.branchId) === String(req.params.branchId) && String(s.foodId) === String(food.id));
    return { ...food, active: status ? status.active : true };
  });
  res.json({ branch, categories: db.categories, foods });
});
app.post('/api/branches/:branchId/foods/:foodId/toggle', (req, res) => {
  const db = readDB();
  let status = db.branchFoodStatus.find(s => String(s.branchId) === String(req.params.branchId) && String(s.foodId) === String(req.params.foodId));
  if (status) {
    status.active = !status.active;
  } else {
    status = { branchId: Number(req.params.branchId), foodId: Number(req.params.foodId), active: false };
    db.branchFoodStatus.push(status);
  }
  writeDB(db);
  res.json({ active: status.active });
});

// CLIENT MENU (Branch 1 only)
app.get('/api/branch/:branchId/menu', (req, res) => {
  const db = readDB();
  const branch = db.branches.find(b => String(b.id) === String(req.params.branchId));
  if (!branch) return res.status(404).json({ message: 'Branch not found' });
  const foods = db.foods.filter(food => {
    const status = db.branchFoodStatus.find(s => String(s.branchId) === String(req.params.branchId) && String(s.foodId) === String(food.id));
    return status ? status.active : true;
  });
  res.json({ branch, categories: db.categories, foods });
});

// =============================================================
// ORDERS API — Real-world order management
// =============================================================

// Customer places order → saved to DB
app.post('/api/orders', (req, res) => {
  const db = readDB();
  if (!db.orders) db.orders = [];
  const newId = db.orders.length > 0 ? Math.max(...db.orders.map(o => o.id)) + 1 : 1;
  const order = {
    id: newId,
    orderNumber: `WOW-${String(newId).padStart(4, '0')}`,
    branchId: Number(req.body.branchId) || 1,
    customerName: req.body.customerName || 'Walk-in Customer',
    customerPhone: req.body.customerPhone || '',
    tableNumber: req.body.tableNumber || '',
    items: req.body.items || [],
    subtotal: Number(req.body.subtotal) || 0,
    tax: Number(req.body.tax) || 0,
    total: Number(req.body.total) || 0,
    status: 'New',       // New → Preparing → Ready → Completed
    note: req.body.note || '',
    createdAt: new Date().toISOString()
  };
  db.orders.push(order);
  writeDB(db);
  res.status(201).json(order);
});

// Admin gets all orders for their branch
app.get('/api/orders', (req, res) => {
  const db = readDB();
  const branchId = req.query.branchId;
  let orders = db.orders || [];
  if (branchId) orders = orders.filter(o => String(o.branchId) === String(branchId));
  // Return newest first
  res.json(orders.reverse());
});

// Admin updates order status
app.put('/api/orders/:id/status', (req, res) => {
  const db = readDB();
  const order = db.orders.find(o => String(o.id) === String(req.params.id));
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = req.body.status;
  writeDB(db);
  res.json(order);
});

// Admin deletes / archives order
app.delete('/api/orders/:id', (req, res) => {
  const db = readDB();
  db.orders = (db.orders || []).filter(o => String(o.id) !== String(req.params.id));
  writeDB(db);
  res.json({ message: 'Order deleted' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` WOW Burger Server running on port ${PORT}`);
});
