import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-session-closed',
  templateUrl: './session-closed.component.html',
  styleUrls: ['./session-closed.component.css'],
})
export class SessionClosedComponent {
  isClosedDueToWrongAction!: boolean;
  sessionClosingReason!:string

  constructor(private router: Router, private route: ActivatedRoute) {}
  ngOnInit() {
    this.isClosedDueToWrongAction = JSON.parse(
      this.route.snapshot.paramMap.get('wrongAction')!
    
    );
    this.sessionClosingReason=
      this.route.snapshot.paramMap.get('message')!
    

  }

  goBackToHealthAuthentication(): void {
    this.router.navigate(['/session']);
  }
}
