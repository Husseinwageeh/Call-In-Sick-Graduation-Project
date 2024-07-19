import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { RegistrationService } from 'src/app/services/registration.service';
import { RegisteringUser } from 'src/app/models/RegisteringUser';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-registeration',

  templateUrl: './registeration.component.html',
  styleUrl: './registeration.component.css',
})
export class RegisterationComponent {
  constructor(
    private modalService: NgbModal,
    private registrationService: RegistrationService
  ) {}
  isCardAppeared: string = 'false';
  isLoading: boolean = false;

  public registeringUser: RegisteringUser = {
    fullname: '',
    phone: '',
    email: '',
    password: '',
    formData: new FormData(),
  };

  ngOnInit() {
    setTimeout(() => {
      this.isCardAppeared = 'true';
    }, 500);
  }
  public onIdSelected(event: any) {
    console.log('trigerred');

    const file: File = <File>event.target.files[0];
    this.registeringUser.formData.append('idFile', file);
  }
  public onMultiplePhotosSelected(event: any) {
    const files = <File[]>event.target.files;

    for (let photo of files) {
      this.registeringUser.formData.append('multiplePhotos', photo);
    }
  }

  uploadData() {
    this.isLoading = true;
    this.registeringUser.formData.append('email', this.registeringUser.email);
    this.registeringUser.formData.append(
      'fullName',
      this.registeringUser.fullname
    );
    this.registeringUser.formData.append('phone', this.registeringUser.phone);
    this.registeringUser.formData.append(
      'password',
      this.registeringUser.password
    );
    this.registrationService.setRegisteringUser(this.registeringUser);

    this.registrationService.register().subscribe((res: ApiResponse<any>) => {
      this.isLoading = false;
      console.log(res);
      if (res.error) {
        console.log(res.error);

        alert(res.error.toString());
      } else {
        alert('signed up successfully' + res.data.status);
      }
      this.resetFormData();
    });
  }

  resetFormData() {
    this.registeringUser.formData.delete('email');
    this.registeringUser.formData.delete('idFile');
    this.registeringUser.formData.delete('multiplePhotos');
    this.registeringUser.formData.delete('phone');
    this.registeringUser.formData.delete('password');
    this.registeringUser.formData.delete('fullName');
    this.registeringUser.email = '';
    this.registeringUser.phone = '';
    this.registeringUser.password = '';
    this.registeringUser.fullname = '';
  }
  log() {
    console.log(this.registeringUser.email);
  }
}
