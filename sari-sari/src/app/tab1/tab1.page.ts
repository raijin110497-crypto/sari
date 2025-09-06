import { Component, OnInit } from '@angular/core';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  totalSalesToday = 0;
  totalInventory = 0;
  recentSales: any[] = [];

  constructor(private sqlite: SqliteService) {}

  async ngOnInit() {
    await this.load();
  }

  async load() {
    const start = new Date();
    start.setHours(0,0,0,0);
    const end = new Date();
    end.setHours(23,59,59,999);
    this.totalSalesToday = await this.sqlite.getTotalSalesForDay(start.getTime(), end.getTime());
    const products = await this.sqlite.getProducts();
    this.totalInventory = products.length;
    this.recentSales = await this.sqlite.getSales();
  }
}
