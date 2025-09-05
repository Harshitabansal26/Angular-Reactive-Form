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
  loading = false;

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
    this.loading = true;

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

    this.applicationService.getApplications(filters).subscribe({
      next: (res: any) => {
        let data = res?.result?.data || [];

        this.totalPages = res?.result?.pageInfo?.totalPage || 1;
        this.currentPage = res?.result?.pageInfo?.currentPage || 1;

        // Mobile filter
        if (this.searchFields.mobile) {
          const mobileSearch = this.searchFields.mobile.trim();
          data = data.filter((app: any) => app.cellPhone?.includes(mobileSearch));
        }

        // Applicant name filter
        if (this.searchFields.applicantName) {
          const nameSearch = this.searchFields.applicantName.trim().toLowerCase();
          data = data.filter((app: any) => {
            const fullName = (app.applicantName || '').replace(/\s+/g, ' ').trim().toLowerCase();
            const nameParts = fullName.split(' ').filter(Boolean);
            return (
              fullName === nameSearch ||
              nameParts.some((part: string) => part === nameSearch) ||
              nameParts.some((part: string) => part.startsWith(nameSearch))
            );
          });

          const totalCount = data.length;
          this.totalPages = Math.ceil(totalCount / this.limit);
          const startIndex = (this.currentPage - 1) * this.limit;
          data = data.slice(startIndex, startIndex + this.limit);
        }

        
        this.filteredApplications = data.map((app: any) => ({
          ...app,
          mobile: app.cellPhone || '',
          existingRetailer:
            app.existingRetailer?.toUpperCase() === 'YES'
              ? 'Existing Retailer'
              : app.existingRetailer?.toUpperCase() === 'NO'
              ? 'New Retailer'
              : app.existingRetailer
        }));

        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching applications:', err);
        this.loading = false;
      }
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

  /** Keys to display dynamically  */
  getKeys(obj: any): string[] {
    if (!obj) return [];
    const exclude = [
      'cellPhone',           
      'createdAt',           
      'applicationDate',     
    ];
    return Object.keys(obj).filter(k => !exclude.includes(k));
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


  getApplicationDate(app: any): string | null {
    return app?.applicationDate || app?.createdAt || null;
  }

  isDateLike(val: any): boolean {
    if (!val) return false;
    const t = Date.parse(val);
    return !Number.isNaN(t);
  }

  formatStatus(status: string | null | undefined): string {
    if (!status) return '';
    const map: Record<string, string> = {
      NEW_APPLICATION: 'New Application',
      COMPLETED: 'Completed',
      IN_PROGRESS: 'In Progress'
    };
    return map[status] || status;
  }

  statusClass(status: string | null | undefined): string {
    if (!status) return '';
    const s = status.toUpperCase();
    if (s === 'COMPLETED') return 'status-completed';
    if (s === 'IN_PROGRESS') return 'status-progress';
    if (s === 'NEW_APPLICATION') return 'status-new';
    return '';
  }
}