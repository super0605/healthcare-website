/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  Optional,
  Renderer2,
  SkipSelf,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MpIsMenuInsideDropDownToken } from './menu.token';

export function MenuGroupFactory(isMenuInsideDropDownToken: boolean): boolean {
  return isMenuInsideDropDownToken ? isMenuInsideDropDownToken : false;
}
@Component({
  selector: '[mp-menu-group]',
  exportAs: 'mpMenuGroup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    /** check if menu inside dropdown-menu component **/
    {
      provide: MpIsMenuInsideDropDownToken,
      useFactory: MenuGroupFactory,
      deps: [[new SkipSelf(), new Optional(), MpIsMenuInsideDropDownToken]]
    }
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      [class.ant-menu-item-group-title]="!isMenuInsideDropDown"
      [class.ant-dropdown-menu-item-group-title]="isMenuInsideDropDown"
      #titleElement
    >
      <ng-container *mpStringTemplateOutlet="mpTitle">{{
        mpTitle
      }}</ng-container>
      <ng-content select="[title]" *ngIf="!mpTitle"></ng-content>
    </div>
    <ng-content></ng-content>
  `,
  preserveWhitespaces: false
})
export class MpMenuGroupComponent implements AfterViewInit {
  @Input() mpTitle: string | TemplateRef<void>;
  @ViewChild('titleElement') titleElement: ElementRef;

  constructor(
    public elementRef: ElementRef,
    private renderer: Renderer2,
    @Inject(MpIsMenuInsideDropDownToken) public isMenuInsideDropDown: boolean
  ) {
    const className = this.isMenuInsideDropDown
      ? 'ant-dropdown-menu-item-group'
      : 'ant-menu-item-group';
    this.renderer.addClass(elementRef.nativeElement, className);
  }
  ngAfterViewInit(): void {
    const ulElement = this.renderer.nextSibling(
      this.titleElement.nativeElement
    );
    if (ulElement) {
      /** add classname to ul **/
      const className = this.isMenuInsideDropDown
        ? 'ant-dropdown-menu-item-group-list'
        : 'ant-menu-item-group-list';
      this.renderer.addClass(ulElement, className);
    }
  }
}
