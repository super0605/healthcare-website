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
  ContentChildren,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  QueryList,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { defer, merge, Observable, of, Subject } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'mp-list-item-extra, [mp-list-item-extra]',
  exportAs: 'mpListItemExtra',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content></ng-content>
  `,
  host: {
    class: 'ant-list-item-extra'
  }
})
export class MpListItemExtraComponent {
  constructor() {}
}

@Component({
  selector: 'mp-list-item-action',
  exportAs: 'mpListItemAction',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template><ng-content></ng-content></ng-template>
  `
})
export class MpListItemActionComponent {
  @ViewChild(TemplateRef) templateRef: TemplateRef<void>;
  constructor() {}
}

@Component({
  selector: 'ul[mp-list-item-actions]',
  exportAs: 'mpListItemActions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <li *ngFor="let i of actions; let last = last">
      <ng-template [ngTemplateOutlet]="i"></ng-template>
      <em *ngIf="!last" class="ant-list-item-action-split"></em>
    </li>
  `,
  host: {
    class: 'ant-list-item-action'
  }
})
export class MpListItemActionsComponent implements OnChanges, OnDestroy {
  @Input() mpActions: Array<TemplateRef<void>> = [];
  @ContentChildren(MpListItemActionComponent) mpListItemActions: QueryList<
    MpListItemActionComponent
  >;

  actions: Array<TemplateRef<void>> = [];
  private destroy$ = new Subject();
  private inputActionChanges$ = new Subject<null>();
  private contentChildrenChanges$: Observable<null> = defer(() => {
    if (this.mpListItemActions) {
      return of(null);
    }
    return this.ngZone.onStable.asObservable().pipe(
      take(1),
      switchMap(() => this.contentChildrenChanges$)
    );
  });

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {
    merge(this.contentChildrenChanges$, this.inputActionChanges$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.mpActions.length) {
          this.actions = this.mpActions;
        } else {
          this.actions = this.mpListItemActions.map(
            action => action.templateRef
          );
        }
        this.cdr.markForCheck();
      });
  }

  ngOnChanges(): void {
    this.inputActionChanges$.next(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
