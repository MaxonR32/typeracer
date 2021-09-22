import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {

  @Output() secondsEmitter = new EventEmitter<number>()
  
  seconds: number = 60
  interval: any
  
  constructor() { }

  ngOnInit(): void {
  }

  startCountdown() {
    this.seconds = 60
    clearInterval(this.interval)
    this.interval = setInterval(() => {
      this.seconds -= 1
      this.secondsEmitter.emit(this.seconds)
    }, 1000)      

  }

  stopCountdown() {
    clearInterval(this.interval)
  }

  restartCountdown() {
    this.seconds = 60    
  }

}
