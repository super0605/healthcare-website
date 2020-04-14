/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { PlatformModule } from '@angular/cdk/platform';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MpButtonModule } from '../../button';
import { MpCheckboxModule } from '../../checkbox';
import { MpOutletModule } from '../../core/outlet';
import { MpResizeObserversModule } from '../../core/resize-observers';
import { MpDropDownModule } from '../../dropdown';
import { MpEmptyModule } from '../../empty';
import { MpI18nModule } from '../../i18n';
import { MpIconModule } from '../../icon';
import { MpMenuModule } from '../../menu';
import { MpPaginationModule } from '../../pagination';
import { MpRadioModule } from '../../radio';
import { MpSpinModule } from '../../spin';
import { MpFilterTriggerComponent } from './addon/filter-trigger.component';
import { MpTableFilterComponent } from './addon/filter.component';
import { MpRowExpandButtonDirective } from './addon/row-expand-button.directive';
import { MpRowIndentDirective } from './addon/row-indent.directive';
import { MpTableSelectionComponent } from './addon/selection.component';
import { MpTableSortersComponent } from './addon/sorters.component';
import { MpCellFixedDirective } from './cell/cell-fixed.directive';
import { MpTableCellDirective } from './cell/cell.directive';
import { MpTdAddOnComponent } from './cell/td-addon.component';
import { MpThAddOnComponent } from './cell/th-addon.component';
import { MpThMeasureDirective } from './cell/th-measure.directive';
import { MpThSelectionComponent } from './cell/th-selection.component';
import { MpCellAlignDirective } from './styled/align.directive';
import { MpCellEllipsisDirective } from './styled/ellipsis.directive';
import { MpCellBreakWordDirective } from './styled/word-break.directive';
import { MpTableContentComponent } from './table/table-content.component';
import { MpTableFixedRowComponent } from './table/table-fixed-row.component';
import { MpTableInnerDefaultComponent } from './table/table-inner-default.component';
import { MpTableInnerScrollComponent } from './table/table-inner-scroll.component';
import { MpTableVirtualScrollDirective } from './table/table-virtual-scroll.directive';
import { MpTableComponent } from './table/table.component';
import { MpTbodyComponent } from './table/tbody.component';
import { MpTheadComponent } from './table/thead.component';
import { MpTableTitleFooterComponent } from './table/title-footer.component';
import { MpTrExpandDirective } from './table/tr-expand.directive';
import { MpTrMeasureComponent } from './table/tr-measure.component';
import { MpTrDirective } from './table/tr.directive';

@NgModule({
  declarations: [
    MpTableComponent,
    MpThAddOnComponent,
    MpTableCellDirective,
    MpThMeasureDirective,
    MpTdAddOnComponent,
    MpTheadComponent,
    MpTbodyComponent,
    MpTrDirective,
    MpTrExpandDirective,
    MpTableVirtualScrollDirective,
    MpCellFixedDirective,
    MpTableContentComponent,
    MpTableTitleFooterComponent,
    MpTableInnerDefaultComponent,
    MpTableInnerScrollComponent,
    MpTrMeasureComponent,
    MpRowIndentDirective,
    MpRowExpandButtonDirective,
    MpCellBreakWordDirective,
    MpCellAlignDirective,
    MpTableSortersComponent,
    MpTableFilterComponent,
    MpTableSelectionComponent,
    MpCellEllipsisDirective,
    MpFilterTriggerComponent,
    MpTableFixedRowComponent,
    MpThSelectionComponent
  ],
  exports: [
    MpTableComponent,
    MpThAddOnComponent,
    MpTableCellDirective,
    MpThMeasureDirective,
    MpTdAddOnComponent,
    MpTheadComponent,
    MpTbodyComponent,
    MpTrDirective,
    MpTableVirtualScrollDirective,
    MpCellFixedDirective,
    MpFilterTriggerComponent,
    MpTrExpandDirective,
    MpCellBreakWordDirective,
    MpCellAlignDirective,
    MpCellEllipsisDirective,
    MpTableFixedRowComponent,
    MpThSelectionComponent
  ],
  imports: [
    MpMenuModule,
    FormsModule,
    MpOutletModule,
    MpRadioModule,
    MpCheckboxModule,
    MpDropDownModule,
    MpButtonModule,
    CommonModule,
    PlatformModule,
    MpPaginationModule,
    MpResizeObserversModule,
    MpSpinModule,
    MpI18nModule,
    MpIconModule,
    MpEmptyModule,
    ScrollingModule
  ]
})
export class MpTableModule {}
