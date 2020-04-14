import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'mp-default-layout',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.less']
})
export class DefaultLayoutComponent {
  constructor(private route: ActivatedRoute) {
    const data = route.snapshot.hasOwnProperty('data')
      ? route.snapshot.data
      : {};
  }
}
