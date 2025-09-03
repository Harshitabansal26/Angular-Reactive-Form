import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Application } from '../application';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  filteredApplications: any[] = [];

  searchFields = {
    businessName: '',
    applicationId: '',
    email: '',
    mobile: '',
    applicantName: '',
    parish: '',
    status: '',
    retailerType: ''
  };

  constructor(private applicationService: Application, private router: Router) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  createNewApplication(): void {
    this.router.navigate(['/form']);
  }

  loadApplications(): void {
    // Backend filters
    const filters: any = {
      page: 1,
      limit: 10,
      isAll: false
    };

    if (this.searchFields.applicationId) filters.applicationId = this.searchFields.applicationId;
    if (this.searchFields.businessName) filters.businessName = this.searchFields.businessName;
    if (this.searchFields.email) filters.email = this.searchFields.email;
    if (this.searchFields.parish) filters.parish = this.searchFields.parish;
    if (this.searchFields.status) filters.status = this.searchFields.status;
    if (this.searchFields.retailerType) filters.existingRetailer = this.searchFields.retailerType;

    // Fetch from backend
    this.applicationService.getApplications(filters).subscribe({
      next: (res: any) => {
        let data = res?.result?.data || [];

        // Client-side filtering for mobile
        if (this.searchFields.mobile) {
          const mobileSearch = this.searchFields.mobile.trim();
          data = data.filter((app: any) => app.cellPhone?.includes(mobileSearch));
        }

        // Client-side filtering for applicantName (handles full name or first name)
        if (this.searchFields.applicantName) {
  const nameSearch = this.searchFields.applicantName.trim().toLowerCase();
  data = data.filter((app: any) => {
    const fullName = `${app.applicantName || ''}`.replace(/\s+/g, ' ').toLowerCase();
    const nameParts = fullName.split(' ');

    // Check if full name contains search string OR any word matches
    return fullName.includes(nameSearch) || nameParts.some(part => part.includes(nameSearch));
  });
}



        // Map data for table display
        this.filteredApplications = data.map((app: any) => ({
          applicationId: app.applicationId || '',
          businessName: app.businessName || '',
          email: app.email || '',
          mobile: app.cellPhone || '',
          parish: app.parish || '',
          status: app.status || '',
          applicantName: app.applicantName || '',
          existingRetailer:
            app.existingRetailer === 'Yes' ? 'Existing Retailer' :
            app.existingRetailer === 'No' ? 'New Retailer' : app.existingRetailer
        }));
      },
      error: (err) => console.error('Error fetching applications:', err)
    });
  }

  onSearch(): void {
    this.loadApplications();
  }

  resetSearch(): void {
    this.searchFields = {
      businessName: '',
      applicationId: '',
      email: '',
      mobile: '',
      applicantName: '',
      parish: '',
      status: '',
      retailerType: ''
    };
    this.loadApplications();
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  displayKey(key: string): string {
    const map: any = {
      applicantName: 'Applicant Name',
      existingRetailer: 'Retailer Type',
      mobile: 'Mobile'
    };
    return map[key] || key;
  }
}
