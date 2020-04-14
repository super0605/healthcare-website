/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  Directive,
  EmbeddedViewRef,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { MpSafeAny } from '../types';

@Directive({
  selector: '[mpStringTemplateOutlet]',
  exportAs: 'mpStringTemplateOutlet'
})
export class MpStringTemplateOutletDirective implements OnChanges {
  private embeddedViewRef: EmbeddedViewRef<MpSafeAny> | null = null;
  @Input() mpStringTemplateOutletContext: MpSafeAny | null = null;
  @Input() mpStringTemplateOutlet:
    | string
    | TemplateRef<MpSafeAny>
    | null = null;

  private recreateView(): void {
    this.viewContainer.clear();
    const isTemplateRef = this.mpStringTemplateOutlet instanceof TemplateRef;
    const templateRef = (isTemplateRef
      ? this.mpStringTemplateOutlet
      : this.templateRef) as MpSafeAny;
    this.embeddedViewRef = this.viewContainer.createEmbeddedView(
      templateRef,
      this.mpStringTemplateOutletContext
    );
  }

  private updateContext(): void {
    const newCtx = this.mpStringTemplateOutletContext;
    const oldCtx = this.embeddedViewRef!.context as MpSafeAny;
    if (newCtx) {
      for (const propName of Object.keys(newCtx)) {
        oldCtx[propName] = newCtx[propName];
      }
    }
  }

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<MpSafeAny>
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const shouldRecreateView = (ctxChanges: SimpleChanges): boolean => {
      const {
        mpStringTemplateOutletContext,
        mpStringTemplateOutlet
      } = ctxChanges;
      let shouldOutletRecreate = false;
      if (mpStringTemplateOutlet) {
        if (mpStringTemplateOutlet.firstChange) {
          shouldOutletRecreate = true;
        } else {
          const isPreviousOutletTemplate =
            mpStringTemplateOutlet.previousValue instanceof TemplateRef;
          const isCurrentOutletTemplate =
            mpStringTemplateOutlet.currentValue instanceof TemplateRef;
          shouldOutletRecreate =
            isPreviousOutletTemplate || isCurrentOutletTemplate;
        }
      }
      const hasContextShapeChanged = (ctxChange: SimpleChange): boolean => {
        const prevCtxKeys = Object.keys(ctxChange.previousValue || {});
        const currCtxKeys = Object.keys(ctxChange.currentValue || {});
        if (prevCtxKeys.length === currCtxKeys.length) {
          for (const propName of currCtxKeys) {
            if (prevCtxKeys.indexOf(propName) === -1) {
              return true;
            }
          }
          return false;
        } else {
          return true;
        }
      };
      const shouldContextRecreate =
        mpStringTemplateOutletContext &&
        hasContextShapeChanged(mpStringTemplateOutletContext);
      return shouldContextRecreate || shouldOutletRecreate;
    };
    const recreateView = shouldRecreateView(changes);
    if (recreateView) {
      /** recreate view when context shape or outlet change **/
      this.recreateView();
    } else {
      /** update context **/
      this.updateContext();
    }
  }
}
