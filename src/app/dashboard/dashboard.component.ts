import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  waitCount: number = 0;
  interval: any;
  isDisabled = false;
  style: any = {};
  result: number = 0;

  startTimer() {
    let btnDice = document.getElementById('btnDice')
    this.interval = setInterval(() => {
      if (this.waitCount > 0) {
        this.waitCount--;
      } else {
        clearInterval(this.interval);
        this.isDisabled = false;
        btnDice?.classList.toggle('roll')
        btnDice?.classList.toggle('roll-disabled')
      }
    }, 1000);
  }

  randomIntFromInterval(min: any, max: any) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  randomDice = () => {
    let btnDice = document.getElementById('btnDice')
    btnDice?.classList.toggle('roll')
    btnDice?.classList.toggle('roll-disabled')

    let rollInterval:any;
    let rollCount:number = 5
    rollInterval = setInterval(() => {
      if (rollCount > 0) {
        rollCount--;
        this.rollDice(this.randomIntFromInterval(1, 6))
      } else {
        clearInterval(rollInterval);
      }
    }, 1000)

    this.waitCount = 10
    this.isDisabled = true;
    // let random = this.randomIntFromInterval(1, 6);
    // this.rollDice(random);
    this.startTimer();
  };

  rollDice = (random: any) => {
    this.style.animation = 'rolling 1s';

    setTimeout(() => {
      switch (random) {
        case 1:
          this.style.transform = 'rotateX(0deg) rotateY(0deg)';
          this.result = 1;
          break;

        case 6:
          this.style.transform = 'rotateX(180deg) rotateY(0deg)';
          this.result = 6;
          break;

        case 2:
          this.style.transform = 'rotateX(-90deg) rotateY(0deg)';
          this.result = 2;
          break;

        case 5:
          this.style.transform = 'rotateX(90deg) rotateY(0deg)';
          this.result = 5;
          break;

        case 3:
          this.style.transform = 'rotateX(0deg) rotateY(90deg)';
          this.result = 3;
          break;

        case 4:
          this.style.transform = 'rotateX(0deg) rotateY(-90deg)';
          this.result = 4;
          break;

        default:
          break;
      }

      this.style.animation = 'none';
      console.log(this.result);
    }, 100);
  };
}
