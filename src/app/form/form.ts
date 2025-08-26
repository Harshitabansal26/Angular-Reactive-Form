import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Application } from '../application';  

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './form.html',
  styleUrls: ['./form.css']
})
export class Form implements OnInit {
  applicationForm!: FormGroup;
  uploadedFiles: File[] = [];
  isModalVisible: boolean = false;

  // Static data for dropdowns and checkboxes
  productOptions = [
    { name: 'Lotteries, Cashpot, Lotto ', value: 'lottery' },
    { name: 'OTB/OFF Track Betting/Horse Racing ', value: 'otb' },
    { name: 'Sports Betting - Just Bet ', value: 'sports' }
  ];

  applicationSources = ['Website', 'Referral', 'In-Person'];
  titles = ['Mr.', 'Mrs.', 'Ms.', 'Dr.'];
  countries = ['Jamaica', 'United States', 'Canada'];
  parishes = ['Kingston', 'St. Andrew', 'Trelawny', 'St. Catherine'];
  businessTypes = ['Retail', 'Service', 'Manufacturing'];

  constructor(private fb: FormBuilder, private appService: Application) { }

  ngOnInit(): void {
    this.applicationForm = this.fb.group({
      product: this.fb.array([], [Validators.required]),
      applicationSource: ['', Validators.required],
      residentInfo: this.fb.group({
        isResidentJamaica: ['', Validators.required],
        isExistingRetailer: ['', Validators.required]
      }),
      personalDetails: this.fb.group({
        title: ['', Validators.required],
        firstName: ['', Validators.required],
        middleName: [''],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        dateOfBirth: ['', Validators.required],
        cellphone: ['', Validators.required],
        businessPhone: [''],
        homePhone: [''],
        gender: ['', Validators.required],
        addCoApplicant: ['', Validators.required]
      }),
      businessInformation: this.fb.group({
        businessName: ['', Validators.required],
        typeOfBusiness: ['', Validators.required],
        country: ['', Validators.required],
        parish: ['', Validators.required],
        town: [''],
        district: [''],
        postalCode: [''],
        address: ['', Validators.required],
        doYouOwnBusiness: ['', Validators.required],
        yearsInOperation: ['', Validators.required],
        ownOrRentLocation: ['', Validators.required]
      }),
      fileUpload: ['']
    });

    this.addCheckboxes();
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  openModal(): void {
    if (this.applicationForm.valid) {
      this.isModalVisible = true;
    } else {
      this.markFormGroupTouched(this.applicationForm);
    }
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  // ✅ Updated onSubmit with API call
  onSubmit(): void {
  if (this.applicationForm.valid) {
    const rawData = this.applicationForm.value;

    // ✅ Convert boolean array to product names
    const productOptions = ['lottery', 'casino', 'sports'];
    rawData.product = rawData.product
      ?.map((checked: boolean, i: number) => (checked ? productOptions[i] : null))
      .filter((v: string | null) => v !== null);

    // Save via service
    this.appService.addApplication(rawData).subscribe({
      next: (res) => {
        console.log('Application saved:', res);
        alert('Application submitted successfully!');
        this.closeModal();
      },
      error: (err) => {
        console.error('Error saving application', err);
        alert('Failed to submit application.');
      }
    });
  } else {
    console.log('Form is invalid. Please correct the errors.');
    this.markFormGroupTouched(this.applicationForm); // ✅ kept from old code
  }
}


  private addCheckboxes(): void {
    this.productOptions.forEach(() => (this.applicationForm.get('product') as FormArray).push(this.fb.control(false)));
  }

  get productFormArray() {
    return this.applicationForm.get('product') as FormArray;
  }
  
  get personalDetails() {
    return this.applicationForm.get('personalDetails') as FormGroup;
  }

  get businessInformation() {
    return this.applicationForm.get('businessInformation') as FormGroup;
  }

  get residentInfo() {
    return this.applicationForm.get('residentInfo') as FormGroup;
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    this.handleFiles(files);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFiles(files);
    }
  }

  private handleFiles(files: FileList | null): void {
    if (files) {
      for (let i = 0; i < files.length && this.uploadedFiles.length < 10; i++) {
        this.uploadedFiles.push(files[i]);
      }

      if (this.uploadedFiles.length === 10) {
        alert('You have reached the maximum limit of 10 files.');
      }
    }
  }
}
