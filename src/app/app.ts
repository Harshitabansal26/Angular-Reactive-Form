import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Application } from './application';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet , FormsModule], 
  template:  `<router-outlet></router-outlet>` 
})
export class App implements OnInit {
  constructor(private appService: Application) {}

  ngOnInit() {
    
  }
}