// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { Form } from './form/form';
import { Home } from './home/home';
import { FormsModule } from '@angular/forms';

export const routes: Routes = [
  { path: '', component: Home},   // default page
  { path: 'form', component: Form }    // your form page
];
