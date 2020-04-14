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
  Input,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';

import { MpConfigService, WithConfig } from '../core/config';
import { InputBoolean } from '../core/util';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MpCollapsePanelComponent } from './collapse-panel.component';

const NZ_CONFIG_COMPONENT_NAME = 'collapse';

@Component({
  selector: 'mp-collapse',
  exportAs: 'mpCollapse',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content></ng-content>
  `,
  host: {
    '[class.ant-collapse]': 'true',
    '[class.ant-collapse-icon-position-left]': `mpExpandIconPosition === 'left'`,
    '[class.ant-collapse-icon-position-right]': `mpExpandIconPosition === 'right'`,
    '[class.ant-collapse-borderless]': '!mpBordered'
  }
})
export class MpCollapseComponent implements OnDestroy {
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, false)
  @InputBoolean()
  mpAccordion: boolean;
  @Input()
  @WithConfig(NZ_CONFIG_COMPONENT_NAME, true)
  @InputBoolean()
  mpBordered: boolean;
  @Input() mpExpandIconPosition: 'left' | 'right' = 'left';
  private listOfMpCollapsePanelComponent: MpCollapsePanelComponent[] = [];
  private destroy$ = new Subject();
  constructor(
    public mpConfigService: MpConfigService,
    private cdr: ChangeDetectorRef
  ) {
    this.mpConfigService
      .getConfigChangeEventForComponent(NZ_CONFIG_COMPONENT_NAME)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

  addPanel(value: MpCollapsePanelComponent): void {
    this.listOfMpCollapsePanelComponent.push(value);
  }

  removePanel(value: MpCollapsePanelComponent): void {
    this.listOfMpCollapsePanelComponent.splice(
      this.listOfMpCollapsePanelComponent.indexOf(value),
      1
    );
  }

  click(collapse: MpCollapsePanelComponent): void {
    if (this.mpAccordion && !collapse.mpActive) {
      this.listOfMpCollapsePanelComponent
        .filter(item => item !== collapse)
        .forEach(item => {
          if (item.mpActive) {
            item.mpActive = false;
            item.mpActiveChange.emit(item.mpActive);
            item.markForCheck();
          }
        });
    }
    collapse.mpActive = !collapse.mpActive;
    collapse.mpActiveChange.emit(collapse.mpActive);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
