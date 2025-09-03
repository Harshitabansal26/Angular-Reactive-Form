import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Application } from '../application';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrls: ['./form.css']
})
export class Form implements OnInit {
  applicationForm!: FormGroup;
  lookupData: any = {};
  uploadedFiles: File[] = [];
  isModalVisible = false;

  constructor(private fb: FormBuilder, private appService: Application) {}

  ngOnInit(): void {
    this.applicationForm = this.fb.group({
      product: this.fb.array([], [this.minSelectedCheckboxes(1)]),
      applicationSource: ['', Validators.required],
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
        addCoApplicant: ['', Validators.required],
        isJamaicaResident: ['', Validators.required],
        existingRetailer: ['', Validators.required],
        retailerId: [''],
        otherCreationReason: ['']
      }),
      businessInformation: this.fb.group({
        businessName: ['', Validators.required],
        typeOfBusiness: [''],
        country: ['', Validators.required],
        parish: ['', Validators.required],
        town: [''],
        district: [''],
        postalCode: [''],
        address: ['', Validators.required],
        doYouOwnBusiness: ['', Validators.required],
        yearsInOperation: ['', Validators.required],
        monthsInOperation: ['', Validators.required],
        ownOrRentLocation: ['', Validators.required]
      }),
      fileUpload: ['']
    });

    this.fetchLookups();
    this.addCheckboxes();
  }

  get personalDetails() { return this.applicationForm.get('personalDetails') as FormGroup; }
  get businessInformation() { return this.applicationForm.get('businessInformation') as FormGroup; }
  get productFormArray() { return this.applicationForm.get('product') as FormArray; }

  get productOptions() {
    return this.lookupData.productOptions || [
      { name: 'Lotteries, Cashpot, Lotto', value: 'LOTTERY' },
      { name: 'OTB/Off-Track Betting/Horse Racing', value: 'OTB' },
      { name: 'Sports Betting – Just Bet', value: 'SPORTS' }
    ];
  }
  onExistingRetailerChange(event: any): void {
  const retailerControl = this.personalDetails.get('retailerId');
  if (event.target.value === 'YES') {
    retailerControl?.setValidators([Validators.required]);
  } else {
    retailerControl?.clearValidators();
    retailerControl?.setValue('');
  }
  retailerControl?.updateValueAndValidity();
}

  private addCheckboxes() {
    const productArray = this.applicationForm.get('product') as FormArray;
    productArray.clear();
    this.productOptions.forEach(() => productArray.push(this.fb.control(false)));
  }

  fetchLookups() {
    this.appService.getLookups().subscribe({
      next: (data: any) => {
        this.lookupData = {
          applicationReceiveFrom: data.result.applicationReceiveFrom || [],
          title: data.result.title || [],
          gender: data.result.gender || [],
          countryCode: data.result.countryCode || [],
          parishCounty: data.result.parishCounty || [],
          userType: data.result.userType || [],
          productOptions: [
            { name: 'Lotteries, Cashpot, Lotto', value: 'LOTTERY' },
            { name: 'OTB/Off-Track Betting/Horse Racing', value: 'OTB' },
            { name: 'Sports Betting – Just Bet', value: 'SPORTS' }
          ]
        };
        this.addCheckboxes();
      },
      error: err => console.error('Failed to fetch lookups', err)
    });
  }

  
  closeModal(): void { this.isModalVisible = false; }

  openModal(): void {
  if (this.applicationForm.valid) {
    this.isModalVisible = true; // open modal only if form is valid
  } else {
    this.markFormGroupTouched(this.applicationForm); // show errors
  }
}


  onSubmit(): void {
    if (!this.applicationForm.valid) {
      this.markFormGroupTouched(this.applicationForm);
      return;
    }

    const raw = this.applicationForm.value;

    const services: string[] = raw.product
      .map((checked: boolean, i: number) => checked ? this.productOptions[i].value : null)
      .filter((v: string | null): v is string => v !== null);

    const payload: any = {
      services,
      isJamaicaResident: raw.personalDetails.isJamaicaResident,
      existingRetailer: raw.personalDetails.existingRetailer,
      title: raw.personalDetails.title,
      firstName: raw.personalDetails.firstName,
      middleName: raw.personalDetails.middleName,
      lastName: raw.personalDetails.lastName,
      dateOfBirth: raw.personalDetails.dateOfBirth,
      retailerId: raw.personalDetails.retailerId || null,
      gender: raw.personalDetails.gender,
      email: raw.personalDetails.email,
      cellPhone: raw.personalDetails.cellphone,
      businessPhone: raw.personalDetails.businessPhone,
      homePhone: raw.personalDetails.homePhone,
      coApplicant: raw.personalDetails.addCoApplicant,
      coApplicantData: [],
      businessName: raw.businessInformation.businessName,
      addressStreet: raw.businessInformation.address,
      parish: raw.businessInformation.parish,
      county: raw.businessInformation.county || 'MIDDLESEX',
      district: raw.businessInformation.district,
      town: raw.businessInformation.town,
      postalCode: raw.businessInformation.postalCode,
      country: raw.businessInformation.country,
      yearsInOperation: raw.businessInformation.yearsInOperation,
      monthsInOperation: raw.businessInformation.monthsInOperation,
      locationOwnership: raw.businessInformation.ownOrRentLocation,
      creator: 'SELF',
      otherCreationReason: raw.personalDetails.otherCreationReason,
      screenName: 'APPLICATION',
      businessType: 'CAR_WASH_AUTO_STORE',
      businessOwnership: raw.businessInformation.doYouOwnBusiness,
      document1: this.uploadedFiles[0] || null
    };

    const formData = new FormData();
    Object.keys(payload).forEach(key => {
      if (payload[key] !== null && payload[key] !== undefined) {
        formData.append(key, payload[key]);
      }
    });

    this.appService.addApplication(formData).subscribe({
      next: _res => {
        alert('Application submitted successfully!');
        this.closeModal();
        this.applicationForm.reset();
        this.uploadedFiles = [];
        this.addCheckboxes();
      },
      error: err => {
        console.error(err);
        alert('Failed to submit application.');
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) this.markFormGroupTouched(control);
      else control.markAsTouched();
    });
  }

  // File upload
  onFileSelected(event: any): void { this.handleFiles(event.target.files); }
  onDragOver(event: DragEvent): void { event.preventDefault(); event.stopPropagation(); }
  onDragLeave(event: DragEvent): void { event.preventDefault(); event.stopPropagation(); }
  onDrop(event: DragEvent): void {
    event.preventDefault(); event.stopPropagation();
    if (event.dataTransfer?.files) this.handleFiles(event.dataTransfer.files);
  }
  handleFiles(files: FileList): void {
    for (let i = 0; i < files.length; i++) this.uploadedFiles.push(files[i]);
  }

  private minSelectedCheckboxes(min = 1) {
    return (control: AbstractControl) => {
      const formArray = control as FormArray;
      const totalSelected = formArray.controls.map(c => c.value).reduce((prev, next) => next ? prev + 1 : prev, 0);
      return totalSelected >= min ? null : { required: true };
    };
  }
}

