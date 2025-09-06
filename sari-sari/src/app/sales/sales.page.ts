import { Component, OnInit } from '@angular/core';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss']
})
export class SalesPage implements OnInit {
  products: any[] = [];
  selectedProduct: any = null;
  quantity = 1;
  paymentMode = 'Cash';
  sales: any[] = [];
  paymentModes = ['Cash','GCash','Advance','Overpayment','Office Payment','Absent'];

  constructor(private sqlite: SqliteService) {}

  async ngOnInit() {
    await this.loadProducts();
    await this.loadSales();
  }

  async loadProducts() {
    this.products = await this.sqlite.getProducts();
  }

  async addSale() {
    if (!this.selectedProduct) return;
    const total = this.quantity * Number(this.selectedProduct.price);
    await this.sqlite.addSale({ productId: this.selectedProduct.id, productName: this.selectedProduct.name, quantity: this.quantity, total, paymentMode: this.paymentMode });
    this.quantity = 1;
    this.selectedProduct = null;
    await this.loadSales();
    await this.loadProducts();
  }

  async loadSales() {
    this.sales = await this.sqlite.getSales();
  }
}
