import {
  Component,
  HostListener,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'medopad-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DefaultPatientLayoutComponent implements OnInit {
  screenMode: 'desktop' | 'mobile';

  constructor() {
    this.screenMode = 'desktop';
  }

  ngOnInit(): void {
    this.setSidebarAlign();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setSidebarAlign();
  }

  setSidebarAlign() {
    if (window.innerWidth > 900) {
      this.screenMode = 'desktop';
    } else {
      this.screenMode = 'mobile';
    }
  }
}
