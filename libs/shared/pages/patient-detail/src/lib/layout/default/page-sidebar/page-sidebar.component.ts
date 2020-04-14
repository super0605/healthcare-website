import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'medopad-page-sidebar',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './page-sidebar.component.html',
  styleUrls: ['./page-sidebar.component.less']
})
export class PageSidebarComponent {
  @Input() mode = 'inline';

  public profileId;

  constructor(public router: Router, public route: ActivatedRoute) {
    this.profileId = this.route.snapshot.params.id;
  }
}
