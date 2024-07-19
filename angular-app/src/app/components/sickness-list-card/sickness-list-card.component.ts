import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sickness-list-card',

  templateUrl: './sickness-list-card.component.html',
  styleUrl: './sickness-list-card.component.css',
})
export class SicknessListCardComponent {
  @Input() sicknessName!: string;
  @Input() requiredDevice!: string;
  @Input() imageUrl!: string;
  @Input() desc!: string;
  @Input() animationDelay!:number;

  isCardAppeared: string = 'false';

  constructor(private router: Router) {}

  ngOnInit() {
   setTimeout( ()=>this.isCardAppeared = 'true',this.animationDelay);
  }

  public goToSession() {
    this.router.navigate(['/session']);
  }
}
