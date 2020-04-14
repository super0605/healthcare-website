/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { NgStyleInterface } from '../core/types';
import { InputBoolean } from '../core/util';

import { MpTooltipDirective } from '../tooltip';
import { MpSliderService } from './slider.service';
import { MpSliderShowTooltip } from './typings';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'mp-slider-handle',
  exportAs: 'mpSliderHandle',
  preserveWhitespaces: false,
  template: `
    <div
      #handle
      class="ant-slider-handle"
      tabindex="0"
      mp-tooltip
      [ngStyle]="style"
      [mpTooltipTitle]="
        tooltipFormatter === null || tooltipVisible === 'never'
          ? null
          : tooltipTitle
      "
      [mpTooltipTrigger]="null"
      [mpTooltipPlacement]="tooltipPlacement"
    ></div>
  `,
  host: {
    '(mouseenter)': 'enterHandle()',
    '(mouseleave)': 'leaveHandle()'
  }
})
export class MpSliderHandleComponent implements OnChanges {
  @ViewChild('handle', { static: false }) handleEl: ElementRef;
  @ViewChild(MpTooltipDirective, { static: false }) tooltip: MpTooltipDirective;

  @Input() vertical: string;
  @Input() offset: number;
  @Input() value: number;
  @Input() tooltipVisible: MpSliderShowTooltip = 'default';
  @Input() tooltipPlacement: string;
  @Input() tooltipFormatter: (value: number) => string;
  @Input() @InputBoolean() active = false;

  tooltipTitle: string;
  style: NgStyleInterface = {};

  constructor(
    private sliderService: MpSliderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { offset, value, active, tooltipVisible } = changes;

    if (offset) {
      this.updateStyle();
    }

    if (value) {
      this.updateTooltipTitle();
      this.updateTooltipPosition();
    }

    if (active) {
      if (active.currentValue) {
        this.toggleTooltip(true);
      } else {
        this.toggleTooltip(false);
      }
    }

    if (tooltipVisible && tooltipVisible.currentValue === 'always') {
      Promise.resolve().then(() => this.toggleTooltip(true, true));
    }
  }

  enterHandle = () => {
    if (!this.sliderService.isDragging) {
      this.toggleTooltip(true);
      this.updateTooltipPosition();
      this.cdr.detectChanges();
    }
  };

  leaveHandle = () => {
    if (!this.sliderService.isDragging) {
      this.toggleTooltip(false);
      this.cdr.detectChanges();
    }
  };

  focus(): void {
    this.handleEl.nativeElement.focus();
  }

  private toggleTooltip(show: boolean, force: boolean = false): void {
    if (!force && (this.tooltipVisible !== 'default' || !this.tooltip)) {
      return;
    }

    if (show) {
      this.tooltip.show();
    } else {
      this.tooltip.hide();
    }
  }

  private updateTooltipTitle(): void {
    this.tooltipTitle = this.tooltipFormatter
      ? this.tooltipFormatter(this.value)
      : `${this.value}`;
  }

  private updateTooltipPosition(): void {
    if (this.tooltip) {
      Promise.resolve().then(() => this.tooltip.updatePosition());
    }
  }

  private updateStyle(): void {
    this.style = {
      [this.vertical ? 'bottom' : 'left']: `${this.offset}%`,
      transform: this.vertical ? null : 'translateX(-50%)'
    };
    this.cdr.markForCheck();
  }
}
