import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';   
import { Application } from '../application';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  applications: any[] = [];

  searchFields = {
    applicationId: '',
    businessName: '',
    email: '',
    mobile: ''
  };

  constructor(private appService: Application) {}

  ngOnInit(): void {
    this.loadApplications();
  }

   loadApplications(): void {
    this.appService.getApplications(this.searchFields).subscribe({
      next: (res: any) => {
    this.applications = res?.result?.data || [];
}
,
      error: (err) => {
        console.error('Error fetching applications:', err);
      }
    });
  }

  searchApplications(): void {
    this.loadApplications();
  }
}
