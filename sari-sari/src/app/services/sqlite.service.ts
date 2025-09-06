import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({ providedIn: 'root' })
export class SqliteService {
  private db: SQLiteDBConnection | null = null;
  private readonly DB_NAME = 'sarisari.db';

  constructor() {}

  async initDB() {
    try {
      const platform = Capacitor.getPlatform();
      const sqlite = CapacitorSQLite;
      const ret = await sqlite.createConnection({ database: this.DB_NAME, version: 1 });
      this.db = await sqlite.open({ database: this.DB_NAME });
      await this.createTables();
      await this.seedSampleData();
    } catch (e) {
      console.error('initDB error', e);
    }
  }

  async createTables() {
    if (!this.db) return;
    const createProducts = `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL,
      barcode TEXT
    );`;

    const createSales = `CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER NOT NULL,
      productName TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      total REAL NOT NULL,
      paymentMode TEXT NOT NULL,
      date INTEGER NOT NULL
    );`;

    await this.db.execute(createProducts);
    await this.db.execute(createSales);
  }

  async seedSampleData() {
    const products = await this.getProducts();
    if (products && products.length > 0) return;
    // Insert sample products
    await this.addProduct({ name: 'Rice (1kg)', price: 50, stock: 20, barcode: '1234567890' });
    await this.addProduct({ name: 'Sugar (1kg)', price: 55, stock: 15, barcode: '0987654321' });
    await this.addProduct({ name: 'Instant Noodles', price: 12, stock: 50 });

    // Insert sample sales
    await this.addSale({ productId: 1, productName: 'Rice (1kg)', quantity: 2, total: 100, paymentMode: 'Cash', date: Date.now() });
    await this.addSale({ productId: 3, productName: 'Instant Noodles', quantity: 3, total: 36, paymentMode: 'GCash', date: Date.now() });
  }

  async getProducts() {
    if (!this.db) return [];
    const res = await this.db.query('SELECT * FROM products ORDER BY id DESC;');
    return res.values || [];
  }

  async addProduct(p: { name: string; price: number; stock: number; barcode?: string }) {
    if (!this.db) return;
    const stmt = 'INSERT INTO products (name, price, stock, barcode) VALUES (?, ?, ?, ?);';
    await this.db.run(stmt, [p.name, p.price, p.stock, p.barcode || null]);
  }

  async updateProduct(id: number, p: { name: string; price: number; stock: number; barcode?: string }) {
    if (!this.db) return;
    const stmt = 'UPDATE products SET name=?, price=?, stock=?, barcode=? WHERE id=?;';
    await this.db.run(stmt, [p.name, p.price, p.stock, p.barcode || null, id]);
  }

  async deleteProduct(id: number) {
    if (!this.db) return;
    await this.db.run('DELETE FROM products WHERE id=?;', [id]);
  }

  async addSale(s: { productId: number; productName: string; quantity: number; total: number; paymentMode: string; date?: number }) {
    if (!this.db) return;
    const dt = s.date || Date.now();
    const stmt = 'INSERT INTO sales (productId, productName, quantity, total, paymentMode, date) VALUES (?, ?, ?, ?, ?, ?);';
    await this.db.run(stmt, [s.productId, s.productName, s.quantity, s.total, s.paymentMode, dt]);
  }

  async getSales() {
    if (!this.db) return [];
    const res = await this.db.query('SELECT * FROM sales ORDER BY date DESC;');
    return res.values || [];
  }

  async getTotalSalesForDay(dayStartTs: number, dayEndTs: number) {
    if (!this.db) return 0;
    const res = await this.db.query('SELECT SUM(total) as total FROM sales WHERE date BETWEEN ? AND ?;', [dayStartTs, dayEndTs]);
    const val = res.values && res.values[0] ? res.values[0].total : 0;
    return val || 0;
  }

  async findProductByBarcode(code: string) {
    if (!this.db) return null;
    const res = await this.db.query('SELECT * FROM products WHERE barcode=? LIMIT 1;', [code]);
    return res.values && res.values[0] ? res.values[0] : null;
  }
}
