import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Application } from './application';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet], 
  template:  `<router-outlet></router-outlet>` 
})
export class App implements OnInit {
  constructor(private appService: Application) {}

  ngOnInit() {
    
  }
}