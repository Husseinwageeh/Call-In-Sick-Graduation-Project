import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-nav-bar',

  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  ;
  constructor(private router:Router,private authenticationService:AuthenticationService){}

  public getUserFirstName(){


    const user=this.authenticationService.getAuthenticatedUser()!
   console.log(user)
    return user.fullname.split(' ')[0]

  }
 

  public onLogoutClick(){

    this.authenticationService.logout();
    console.log('clicked')
    this.router.navigateByUrl('/')
  }




}
