/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { AnimationEvent } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  ViewEncapsulation
} from '@angular/core';
import { fadeMotion } from '../core/animation';
import { warnDeprecation } from '../core/logger';
import { InputBoolean } from '../core/util';

@Component({
  selector: 'mp-tag',
  exportAs: 'mpTag',
  preserveWhitespaces: false,
  animations: [fadeMotion],
  template: `
    <ng-content></ng-content>
    <i
      mp-icon
      mpType="close"
      *ngIf="mpMode === 'closeable'"
      tabindex="-1"
      (click)="closeTag($event)"
    ></i>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[@fadeMotion]': '',
    '[@.disabled]': 'mpNoAnimation',
    '[style.background-color]': 'presetColor? null : mpColor',
    '[class]': 'hostClassMap',
    '(click)': 'updateCheckedStatus()',
    '(@fadeMotion.done)': 'afterAnimation($event)'
  }
})
export class MpTagComponent implements OnInit, OnChanges {
  presetColor = false;
  hostClassMap = {};
  @Input() mpMode: 'default' | 'closeable' | 'checkable' = 'default';
  @Input() mpColor: string;
  @Input() @InputBoolean() mpChecked = false;
  @Input() @InputBoolean() mpNoAnimation = false;
  @Output() readonly mpAfterClose = new EventEmitter<void>();
  @Output() readonly mpOnClose = new EventEmitter<MouseEvent>();
  @Output() readonly mpCheckedChange = new EventEmitter<boolean>();

  private isPresetColor(color?: string): boolean {
    if (!color) {
      return false;
    }

    return (
      /^(pink|red|yellow|orange|cyan|green|blue|purple|geekblue|magenta|volcano|gold|lime)(-inverse)?$/.test(
        color
      ) || /^(success|processing|error|default|warning)$/.test(color)
    );
  }

  private updateClassMap(): void {
    this.presetColor = this.isPresetColor(this.mpColor);
    this.hostClassMap = {
      ['ant-tag']: true,
      ['ant-tag-has-color']: this.mpColor && !this.presetColor,
      ['ant-tag-checkable']: this.mpMode === 'checkable',
      ['ant-tag-checkable-checked']: this.mpChecked,
      [`ant-tag-${this.mpColor}`]: this.presetColor
    };
  }

  updateCheckedStatus(): void {
    if (this.mpMode === 'checkable') {
      this.mpChecked = !this.mpChecked;
      this.mpCheckedChange.emit(this.mpChecked);
      this.updateClassMap();
    }
  }

  closeTag(e: MouseEvent): void {
    this.mpOnClose.emit(e);
    if (!e.defaultPrevented) {
      this.renderer.removeChild(
        this.renderer.parentNode(this.elementRef.nativeElement),
        this.elementRef.nativeElement
      );
    }
  }

  afterAnimation(e: AnimationEvent): void {
    if (e.toState === 'void') {
      this.mpAfterClose.emit();
      if (this.mpAfterClose.observers.length) {
        warnDeprecation(
          `'(mpAfterClose)' Output is going to be removed in 9.0.0. Please use '(mpOnClose)' instead.`
        );
      }
    }
  }

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.updateClassMap();
  }

  ngOnChanges(): void {
    this.updateClassMap();
  }
}
