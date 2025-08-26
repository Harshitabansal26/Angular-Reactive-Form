import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Application } from '../application'; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  applications: any[] = [];

  constructor(private appService: Application) {} 

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications() {
    this.appService.getApplications().subscribe({
      next: (data) => (this.applications = data),
      error: (err) => console.error('Error fetching applications', err)
    });
  }
}
