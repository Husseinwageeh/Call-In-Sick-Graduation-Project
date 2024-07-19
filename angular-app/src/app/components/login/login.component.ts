import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { AuthenticatedUser } from 'src/app/models/AuthenticatedUser';
import { RegistrationService } from 'src/app/services/registration.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private registrationService: RegistrationService,
    private authenticationService: AuthenticationService
  ) {}
  isCardAppeared: string = 'false';
  email: string = '';
  password: string = '';

  ngOnInit() {
    //check first if the user logged in previously
    if (this.authenticationService.isLoggedIn()) {
      this.goToSicknessOptionsPage();
    }

    setTimeout(() => {
      this.isCardAppeared = 'true';
    }, 500);
  }

  public onSubmit() {
    this.authenticationService
      .login(this.email, this.password)
      .subscribe((res: ApiResponse<any>) => {
        if (res.error) {
          alert(res.error);
        } else {
          this.goToSicknessOptionsPage();
          console.log(res.data.body);
          console.log('Authenticated user ');
          console.log(this.authenticationService.getAuthenticatedUser());
        }
      });
  }

  public goToSicknessOptionsPage() {
    this.router.navigateByUrl('/sickness-calls-list');
  }
}
