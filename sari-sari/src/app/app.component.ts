import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SqliteService } from './services/sqlite.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform, private sqlite: SqliteService) {
    this.platform.ready().then(() => {
      this.sqlite.initDB();
    });
  }
}
