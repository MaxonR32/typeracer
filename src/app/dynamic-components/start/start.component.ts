import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit, OnDestroy {
  @Input() counter
  math = Math
  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy() {

  }

}
