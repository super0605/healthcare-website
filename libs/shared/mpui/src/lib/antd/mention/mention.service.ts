/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { MpMentionTriggerDirective } from './mention-trigger';

@Injectable()
export class MpMentionService implements OnDestroy {
  private trigger: MpMentionTriggerDirective;
  private triggerChange$ = new Subject<MpMentionTriggerDirective>();

  triggerChanged(): Observable<MpMentionTriggerDirective> {
    return this.triggerChange$.asObservable();
  }

  registerTrigger(trigger: MpMentionTriggerDirective): void {
    if (this.trigger !== trigger) {
      this.trigger = trigger;
      this.triggerChange$.next(trigger);
    }
  }

  ngOnDestroy(): void {
    this.triggerChange$.complete();
  }
}
