import { Component, OnInit, Input, TemplateRef } from '@angular/core';

@Component({
  selector: '[mp-input-group]',
  templateUrl: './input-group.component.html',
  styleUrls: ['./input-group.component.less']
})
export class InputGroupComponent implements OnInit {
  @Input() addOnAfter: string | TemplateRef<void>;
  @Input() addOnBefore: string | TemplateRef<void>;
  @Input() prefix: string | TemplateRef<void>;
  @Input() suffix: string | TemplateRef<void>;
  @Input() compact: boolean;
  @Input() size: 'large' | 'small' | 'default';
  private className: string;

  constructor() {}

  ngOnInit(): void {}
}
