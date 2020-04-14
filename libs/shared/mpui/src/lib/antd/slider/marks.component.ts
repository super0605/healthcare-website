/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { NgStyleInterface } from '../core/types';
import { InputBoolean } from '../core/util';

import { MpDisplayedMark, MpExtendedMark, MpMark, MpMarkObj } from './typings';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  selector: 'mp-slider-marks',
  exportAs: 'mpSliderMarks',
  template: `
    <div class="ant-slider-mark">
      <span
        class="ant-slider-mark-text"
        *ngFor="let attr of marks; trackBy: trackById"
        [class.ant-slider-mark-active]="attr.active"
        [ngStyle]="attr.style"
        [innerHTML]="attr.label"
      >
      </span>
    </div>
  `
})
export class MpSliderMarksComponent implements OnChanges {
  @Input() lowerBound: number | null = null;
  @Input() upperBound: number | null = null;
  @Input() marksArray: MpExtendedMark[];
  @Input() min: number;
  @Input() max: number;
  @Input() @InputBoolean() vertical = false;
  @Input() @InputBoolean() included = false;

  marks: MpDisplayedMark[];

  ngOnChanges(changes: SimpleChanges): void {
    const { marksArray, lowerBound, upperBound } = changes;

    if (marksArray) {
      this.buildMarks();
    }

    if (marksArray || lowerBound || upperBound) {
      this.togglePointActive();
    }
  }

  trackById(_index: number, mark: MpDisplayedMark): number {
    return mark.value;
  }

  private buildMarks(): void {
    const range = this.max - this.min;

    this.marks = this.marksArray.map(mark => {
      const { value, offset, config } = mark;
      const style = this.getMarkStyles(value, range, config);
      const label = isConfigObject(config) ? config.label : config;

      return {
        label,
        offset,
        style,
        value,
        config,
        active: false
      };
    });
  }

  private getMarkStyles(
    value: number,
    range: number,
    config: MpMark
  ): NgStyleInterface {
    let style;

    if (this.vertical) {
      style = {
        marginBottom: '-50%',
        bottom: `${((value - this.min) / range) * 100}%`
      };
    } else {
      style = {
        transform: `translate3d(-50%, 0, 0)`,
        left: `${((value - this.min) / range) * 100}%`
      };
    }

    if (isConfigObject(config) && config.style) {
      style = { ...style, ...config.style };
    }

    return style;
  }

  private togglePointActive(): void {
    if (this.marks && this.lowerBound !== null && this.upperBound !== null) {
      this.marks.forEach(mark => {
        const value = mark.value;
        const isActive =
          (!this.included && value === this.upperBound) ||
          (this.included &&
            value <= this.upperBound! &&
            value >= this.lowerBound!);

        mark.active = isActive;
      });
    }
  }
}

function isConfigObject(config: MpMark): config is MpMarkObj {
  return typeof config !== 'string';
}
