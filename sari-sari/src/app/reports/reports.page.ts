import { Component, OnInit } from '@angular/core';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss']
})
export class ReportsPage implements OnInit {
  dailyTotal = 0;
  sales: any[] = [];

  constructor(private sqlite: SqliteService) {}

  async ngOnInit() {
    await this.load();
  }

  async load() {
    const start = new Date();
    start.setHours(0,0,0,0);
    const end = new Date();
    end.setHours(23,59,59,999);
    this.dailyTotal = await this.sqlite.getTotalSalesForDay(start.getTime(), end.getTime());
    this.sales = await this.sqlite.getSales();
  }
}
