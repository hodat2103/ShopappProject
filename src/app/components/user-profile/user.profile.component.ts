import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { UserResponse } from '../../responses/users/user.detail.response';
import validator from 'validator';
import { ValidationError } from 'class-validator';
import { UpdateUserDTO } from '../../dtos/user/update.user.profile.dto';

@Component({
  selector: 'user-profile',
  templateUrl: './user.profile.component.html',
  styleUrl: './user.profile.component.scss'
})
export class UserComponent implements OnInit {
  userResponse?: UserResponse;
  userProfileForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private activedRoute: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService
  ) {
    this.userProfileForm = this.formBuilder.group({
      fullname: [''],
      password: ['', Validators.minLength(3)],
      retype_password: ['', Validators.minLength(3)],
      date_of_birth: [''],
      email: ['', Validators.minLength(5)],
      address: ['', Validators.minLength(5)]


    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    debugger
    let token: string = this.tokenService.getToken() ?? '';
    this.userService.getUserDetail(token).subscribe({
      next: (response: any) => {
        debugger
        this.userResponse = {
          ...response,
          date_of_birth: new Date(response.date_of_birth)
        };
        this.userProfileForm.patchValue({
          fullname: this.userResponse?.fullname ?? '',
          email: this.userResponse?.email ?? '',
          address: this.userResponse?.address ?? '',
          date_of_birth: this.userResponse?.date_of_birth.toISOString().substring(0, 10)
        });
        this.userService.saveUserResponseToLocalStorage(this.userResponse);

      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        debugger
        alert(error.error.message);
      }

    });
  }
  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = this.userProfileForm.get('password')?.value;
      const retypedPassword = this.userProfileForm.get('retype_password')?.value;
      if (password !== retypedPassword) {
        return { passwordMismatch: true };
      }
      return null;
    }
  }
  save(): void {
    debugger
    if (this.userProfileForm.valid) {
      const updateUserDTO: UpdateUserDTO = {
        fullname: this.userProfileForm.get('fullname')?.value,
        email: this.userProfileForm.get('email')?.value,
        address: this.userProfileForm.get('address')?.value,
        password: this.userProfileForm.get('password')?.value,
        retype_password: this.userProfileForm.get('retype_password')?.value,
        date_of_birth: this.userProfileForm.get('date_of_birth')?.value
      };
      const token: string = this.tokenService.getToken() ?? '';
      const userId: number = this.userResponse?.id ?? 0;
      this.userService.updateUserDetail(userId,token, updateUserDTO).subscribe({
        next: (response: any) => {

          this.userService.removeUserFromLocalStorage();
          this.tokenService.removeToken();
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          debugger
          alert(error.error.message);
        }

      });
    } else {
      if (this.userProfileForm.hasError('passwordMismatch')) {
        alert('Mật khẩu chưa trùng khớp !')
      }
    }
  }
  

}