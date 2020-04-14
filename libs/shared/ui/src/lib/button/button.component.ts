import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mp-button, [mp-button]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.less']
})
export class ButtonComponent implements OnInit {
  @Input() type: 'primary' | 'default' | 'dashed' | 'danger' | 'link';
  @Input() disabled: boolean;
  @Input() block: boolean;
  @Input() ghost: boolean;
  @Input() class: string;
  @Input() prefixIcon: string;
  @Input() suffixIcon: string;
  @Input() loading: boolean;
  @Input() size: 'large' | 'small' | 'default' = 'default';
  @Input() shape: 'circle' | 'round';
  @Output() public clicked = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  public onClick() {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
