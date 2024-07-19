import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationService } from 'src/app/services/registration.service';
import { SicknessCallService } from 'src/app/services/sickness-call.service';
import { SicknessCall } from 'src/app/models/sicknessCall';

@Component({
  selector: 'app-sickness-call-list',
  templateUrl: './sickness-call-list.component.html',
  styleUrl: './sickness-call-list.component.css',
})
export class SicknessCallListComponent {

  public sicknessList!:SicknessCall[];
  private animationDelay:number=0
  ngOnInit(){
    this.sicknessList=SicknessCallService.getSupportedSicknessCalls();
    this.animationDelay=0;
    

  }

  public getAnimationDelayForCard(){

    this.animationDelay+=500;
    return this.animationDelay;



  }





}
