import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'mp-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.less']
})
export class CardComponent implements OnInit {
  @Input() class: string;
  @Input() actions: Array<TemplateRef<void>> = [];
  @Input() bodyStyle: string;
  @Input() bordered: boolean;
  @Input() cover: TemplateRef<void>;
  @Input() extra: string | TemplateRef<void>;
  @Input() hoverable: boolean = false;
  @Input() loading: boolean = false;
  @Input() title: string | TemplateRef<void>;
  @Input() type: 'inner'; //Card style type, can be set to inner or not set
  @Input() size: 'default' | 'small' = 'default';
  @Output() public clicked = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  public onClick() {
    this.clicked.emit();
  }
}
