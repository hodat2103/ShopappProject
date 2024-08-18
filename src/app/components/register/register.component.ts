import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RegisterDTO } from '../../dtos/register.dto';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm
  //declare
  phoneNumber: String;
  password: String;
  retypePassword: String;
  fullname: String;
  address: String;
  isAccepted: boolean;
  dateOfBirth: Date;

  constructor(private router: Router, private userService: UserService) {
    this.phoneNumber = '';
    this.password = '';
    this.retypePassword = '';
    this.fullname = '';
    this.address = '';
    this.isAccepted = true;
    this.dateOfBirth = new Date();
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18);

  }
  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);

  }
  register() {
    const message = `phone: ${this.phoneNumber}` +
      `password: ${this.password}` +
      `retypePassword: ${this.retypePassword}` +
      `fullname: ${this.fullname}` +
      `address: ${this.address}` +
      `isAccepted: ${this.isAccepted}` +
      `dateOfBirth: ${this.dateOfBirth}`;
    // const apiUrl = "http://localhost:8080/api/v1/users/register";
    const registerDTO: RegisterDTO = {
      "fullname": this.fullname,
      "phone_number": this.phoneNumber,
      "address": this.address,
      "password": this.password,
      "retype_password": this.retypePassword,
      "date_of_birth": this.dateOfBirth,
      "facebook_account_id": 0,
      "google_account_id": 0,
      "role_id": 1
    }
    this.userService.register(registerDTO).subscribe({
      next: (response: any) => {
        debugger
        // console.log('Đăng ký thành công', response);
        this.router.navigate(['/login']);

      },
      complete: () => {
        debugger
        // console.log('Yêu cầu đăng ký đã hoàn thành');
      },
      error: (error: any) => {
        alert(`Cannot register, error: ${error.error}`)
      }
    });

  }
    checkPasswordsMatch(){
      if (this.password !== this.retypePassword) {
        this.registerForm.form.controls['retypePassword'].setErrors({ 'passwordMismatch': true });
      } else {
        this.registerForm.form.controls['retypePassword'].setErrors(null);
      }
    }
    checkAge(){
      if (this.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(this.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 18) {
          this.registerForm.form.controls['dateOfBirth'].setErrors({ 'invalidAge': true });

        } else {
          this.registerForm.form.controls['dateOfBirth'].setErrors(null);
        }
      }
    }
  }