import { Component, OnInit } from '@angular/core';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  products: any[] = [];
  showAdd = false;
  newProduct: any = { name: '', price: null, stock: null, barcode: '' };

  constructor(private sqlite: SqliteService) {}

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.products = await this.sqlite.getProducts();
  }

  async addProduct() {
    if (!this.newProduct.name) return;
    await this.sqlite.addProduct({ name: this.newProduct.name, price: Number(this.newProduct.price), stock: Number(this.newProduct.stock), barcode: this.newProduct.barcode });
    this.newProduct = { name: '', price: null, stock: null, barcode: '' };
    this.showAdd = false;
    await this.load();
  }

  cancelAdd() {
    this.showAdd = false;
    this.newProduct = { name: '', price: null, stock: null, barcode: '' };
  }

  async editProduct(p: any) {
    const updatedName = prompt('Edit name', p.name);
    if (updatedName === null) return;
    p.name = updatedName;
    await this.sqlite.updateProduct(p.id, p);
    await this.load();
  }

  async deleteProduct(id: number) {
    if (!confirm('Delete product?')) return;
    await this.sqlite.deleteProduct(id);
    await this.load();
  }
}
