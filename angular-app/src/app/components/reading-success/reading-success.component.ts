import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ImageProcessingService } from 'src/app/services/image-processing.service';
import { SicknessCallService } from 'src/app/services/sickness-call.service';

@Component({
  selector: 'app-reading-success',
  templateUrl: './reading-success.component.html',
  styleUrl: './reading-success.component.css',
})
export class ReadingSuccessComponent {
  public readingTaken: string | number | undefined = '';
  constructor(
    private imageProcessingService: ImageProcessingService,
    private authenticationService: AuthenticationService,

    private sicknessCallService: SicknessCallService,
    private router: Router
  ) {}
  ngOnInit() {
    this.readingTaken = this.imageProcessingService.getTakenReading();
  }

  onSubmit() {
    const authenticatedUser = this.authenticationService.getAuthenticatedUser();



    if (this.readingTaken){
      
       


      this.sicknessCallService
        .postUserReading(
          authenticatedUser?.id!,
          this.readingTaken as unknown as string,
          'High Temperature'
        )
        .subscribe((res) => {
          console.log(res);
          if (res.error) {
            alert('Failed to upload your reading, Check your connection');
          } else {
            alert('Your Reading is Successfully uploaded');
            this.router.navigate(['/']);
          }
        });
      }
  }
}
