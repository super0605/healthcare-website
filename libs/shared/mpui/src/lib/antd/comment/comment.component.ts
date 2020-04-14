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
  ContentChildren,
  Input,
  QueryList,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { MpCommentActionComponent as CommentAction } from './comment-cells';

@Component({
  selector: 'mp-comment',
  exportAs: 'mpComment',
  template: `
    <div class="ant-comment-inner">
      <div class="ant-comment-avatar">
        <ng-content select="mp-avatar[mp-comment-avatar]"></ng-content>
      </div>
      <div class="ant-comment-content">
        <div class="ant-comment-content-author">
          <span *ngIf="mpAuthor" class="ant-comment-content-author-name">
            <ng-container *mpStringTemplateOutlet="mpAuthor">{{
              mpAuthor
            }}</ng-container>
          </span>
          <span *ngIf="mpDatetime" class="ant-comment-content-author-time">
            <ng-container *mpStringTemplateOutlet="mpDatetime">{{
              mpDatetime
            }}</ng-container>
          </span>
        </div>
        <ng-content select="mp-comment-content"></ng-content>
        <ul class="ant-comment-actions" *ngIf="actions?.length">
          <li *ngFor="let action of actions">
            <span
              ><ng-template [mpCommentActionHost]="action.content"></ng-template
            ></span>
          </li>
        </ul>
      </div>
    </div>
    <div class="ant-comment-nested">
      <ng-content></ng-content>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ant-comment'
  }
})
export class MpCommentComponent {
  @Input() mpAuthor: string | TemplateRef<void>;
  @Input() mpDatetime: string | TemplateRef<void>;

  @ContentChildren(CommentAction) actions: QueryList<CommentAction>;
  constructor() {}
}
