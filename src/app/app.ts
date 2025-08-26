import { Component } from '@angular/core';
import { Form } from './form/form'; // Import the Form component

@Component({
  selector: 'app-root',
  standalone: true, // The standalone flag is required for this modern setup
  imports: [Form], // Import the Form component directly here
  template: '<app-form></app-form>' // Render the Form component
})
export class App { }