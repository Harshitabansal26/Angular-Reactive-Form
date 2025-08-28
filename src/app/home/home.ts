import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Application } from '../application'; 
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // For ngModel

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  applications: any[] = [];

  // Search fields
  searchFields: any = {
    businessName: '',
    email: '',
    mobile: '',
    parish: ''
  };

  constructor(private appService: Application) {} 

  ngOnInit(): void {
    this.loadApplications();
  }

loadApplications(filters: any = {}) {
  this.appService.getApplications(filters).subscribe({
    next: (data) => (this.applications = data),
    error: (err) => console.error('Error fetching applications', err)
  });
}

// Trigger search
onSearch() {
  this.loadApplications(this.searchFields);
}

// Reset
onReset() {
  this.searchFields = {
    businessName: '',
    email: '',
    mobile: '',
    parish: ''
  };
  this.loadApplications();
}
}