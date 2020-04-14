import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: '[mp-typography]',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.less']
})
export class TypographyComponent implements OnInit {
  @Input() content: string;
  @Input() tag: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4';
  @Input() copyable: boolean;
  @Input() copyText: string;
  @Input() editable: boolean;
  @Input() ellipsis: boolean;
  @Input() disabled: boolean;
  @Input() expandable: boolean;
  @Input() ellipsisRows: number = 1;
  @Input() type: 'secondary' | 'warning' | 'danger';
  @Output() public onContentChange = new EventEmitter<string>();
  @Output() public onExpandChange = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  public onContentChangeEvent(content: string) {
    this.onContentChange.emit(content);
  }

  public onExpandChangeEvent() {
    this.onExpandChange.emit();
  }
}
