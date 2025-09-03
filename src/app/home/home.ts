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
  currentPage = 1;
limit = 10;
totalPages = 1;

  constructor(private applicationService: Application, private router: Router) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  createNewApplication(): void {
    this.router.navigate(['/form']);
  }

  loadApplications(): void {
  const filters: any = {
   
    page: this.currentPage,
    limit: this.limit,
    isAll: !!this.searchFields.applicantName
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
        
      this.totalPages = res?.result?.pageInfo?.totalPage || 1;
      this.currentPage = res?.result?.pageInfo?.currentPage || 1;

      console.log('TotalPages:', this.totalPages, 'CurrentPage:', this.currentPage);

        // Client-side filtering for mobile
        if (this.searchFields.mobile) {
          const mobileSearch = this.searchFields.mobile.trim();
          data = data.filter((app: any) => app.cellPhone?.includes(mobileSearch));
        }

        // Client-side filtering for applicantName (handles full name or first name)
        if (this.searchFields.applicantName) {
  const nameSearch = this.searchFields.applicantName.trim().toLowerCase();

  data = data.filter((app: any) => {
    const fullName = (app.applicantName || '')
      .replace(/\s+/g, ' ') // normalize spaces
      .trim()
      .toLowerCase();

    const nameParts = fullName.split(' ').filter(Boolean); // remove empty parts

    // ✅ Match if:
    // 1. Full name exactly equals search (full name search)
    // 2. Any word exactly equals search (exact word match)
    // 3. Any word starts with search (optional partial match at start)
    return (
      fullName === nameSearch || 
      nameParts.some((part: string) => part === nameSearch) ||
      nameParts.some((part: string) => part.startsWith(nameSearch)) // allows searching "ash" → Ashish
    );
  });

  // ✅ Recalculate pagination for filtered data
  const totalCount = data.length;
  this.totalPages = Math.ceil(totalCount / this.limit);
  const startIndex = (this.currentPage - 1) * this.limit;
  const endIndex = startIndex + this.limit;
  data = data.slice(startIndex, endIndex);
}




        // Map data dynamically for table display (include ALL fields)
this.filteredApplications = data.map((app: any) => {
  return {
    ...app,
    // ✅ Normalize cellPhone to mobile so it matches your searchFields
    mobile: app.cellPhone || '',
    // ✅ Optional: make existingRetailer more user-friendly
    existingRetailer:
      app.existingRetailer?.toUpperCase() === 'YES' ? 'Existing Retailer' :
      app.existingRetailer?.toUpperCase() === 'NO' ? 'New Retailer' : app.existingRetailer
  };
});

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
  goToPage(page: number): void {
  if (page < 1 || page > this.totalPages) return;
  this.currentPage = page;
  this.loadApplications();
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
