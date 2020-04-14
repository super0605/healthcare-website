import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'mp-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {
  @Input() loading: boolean;
  @Input() disabled: boolean;
  @Input() title: string;
  @Input() items: [];
  @Input() icon: string;
  @Input() style: string;
  @Output() public clicked = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  public onChange(event) {
    this.clicked.emit(event);
  }
}
