import { Component } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import jsQR from 'jsqr';
import Quagga from 'quagga';
import { SqliteService } from '../services/sqlite.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  result: string | null = null;
  foundProduct: any = null;

  constructor(private sqlite: SqliteService) {}

  async scan() {
    try {
      const photo = await Camera.getPhoto({ resultType: CameraResultType.Base64, allowEditing: false, quality: 80 });
      const base64 = photo.base64String;
      if (!base64) return;

      const img = new Image();
      img.src = 'data:image/jpeg;base64,' + base64;
      await new Promise(res => (img.onload = res));

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // try jsQR for QR codes
      const qr = jsQR(imageData.data, imageData.width, imageData.height);
      if (qr && qr.data) {
        this.result = qr.data;
        return;
      }

      // try Quagga for barcodes
      try {
        const dataUrl = canvas.toDataURL('image/png');
        Quagga.decodeSingle({
          src: dataUrl,
          numOfWorkers: 0,
          inputStream: {
            size: 800
          },
          decoder: {
            readers: ['ean_reader','code_128_reader','upc_reader','code_39_reader']
          }
        }, (res: any) => {
          if (res && res.codeResult && res.codeResult.code) {
            this.result = res.codeResult.code;
          } else {
            this.result = 'No code found';
          }
        });
      } catch (e) {
        console.warn('Quagga decode failed', e);
        this.result = 'No code found';
      }
    } catch (e) {
      console.error('scan error', e);
    }
  }

  async findByBarcode(code: string) {
    const p = await this.sqlite.findProductByBarcode(code);
    this.foundProduct = p;
    if (!p) {
      alert('Product not found');
    }
  }
}
