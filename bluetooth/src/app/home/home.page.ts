import { Component } from '@angular/core';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { ToastController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(public bluetoothle: BluetoothLE, public toastController: ToastController, public plt: Platform) {




    // constructor(public bluetoothle: BluetoothLE, public plt: Platform) {

    this.plt.ready().then((readySource) => {

      console.log('Platform ready from', readySource);

      this.bluetoothle.initialize().subscribe(ble => {
        console.log('ble', ble.status) // logs 'enabled'
        setTimeout(() => {

          // this.scan();
        }, 2000);
      });

    });
  }

  scan() {


    let scanSubscription = this.bluetoothle.startScan({
      // "services": [],
      // "allowDuplicates": true,
      // "scanMode": this.ble.SCAN_MODE_LOW_LATENCY,
      // "matchMode": this.ble.MATCH_MODE_AGGRESSIVE,
      // "matchNum": this.ble.MATCH_NUM_MAX_ADVERTISEMENT,
      // "callbackType": this.ble.CALLBACK_TYPE_ALL_MATCHES,
    }).subscribe(result => {
      console.log(JSON.stringify(result))
      if (result.status === 'scanResult') {
        // if (result.name == this.reservation.bluetooth_address) {
        // clearTimeout(scanTimeout)
        this.presentToast('connected');
        this.bluetoothle.stopScan().then(() => {
          // console.log('scan Stopped 1')
          // let device: GocarDevice = {
          //   address: result.address,
          //   characteristic: this.reservation.bluetooth_characteristic,
          //   service: this.reservation.bluetooth_service
          // }
          // this.connect2(device)
          scanSubscription.unsubscribe()
        })
        // }
      } else if (result.status === 'scanStarted') {
        console.log('scan started')
        this.presentToast('scan started');
      } else {
        // TODO handle error
        // this.isDisabledBluetooth
        console.log('start scan error: ' + JSON.stringify(result))
        this.presentToast(result);
      }
    }, err => {
      console.log('start scan error 1', err)
      this.presentToast(err.message);
      // this.gocarToast.showToast({ message: err.message })
      // this.isDisabledBluetooth = false
      // this.isBluetooth = false
      // setTimeout(() => {
      //   this.isBluetooth = false
      // })
      // clearTimeout(scanTimeout)
    })

    let scanTimeout = setTimeout(() => {
      // this.smsService.resetCar(this.reservation.id).subscribe((data) => {
      //   console.log('Car is unlocked', data)
      // }, err => {
      //   console.log('cannot unlocked', err)
      // })
      this.bluetoothle.stopScan().then(() => {
        console.log('scan Stopped 2')
        this.presentToast('scan Stopped 2');
        scanSubscription.unsubscribe()
        // this.isDisabledBluetooth = false
        // this.gocarToast.showToast({ message: 'Cannot find your car' })
        // this.isBluetooth = false
      })
    }, 5000)
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
