import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mp-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.less']
})
export class IconComponent implements OnInit {
  @Input() type: '';
  @Input() theme: 'fill' | 'outline' | 'twotone';
  @Input() spin: boolean;
  @Input() twoToneColor: string;
  @Input() iconFont: string;
  @Input() rotate: number;
  @Input() inlineSVG: string;

  constructor() {}

  ngOnInit(): void {}
}
