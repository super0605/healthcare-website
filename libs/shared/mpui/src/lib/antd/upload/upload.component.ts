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
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MpSafeAny } from '../core/types';
import { Observable, of, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { InputBoolean, InputNumber, toBoolean } from '../core/util';
import { MpI18nService } from '../i18n';

import {
  ShowUploadListInterface,
  UploadChangeParam,
  UploadFile,
  UploadFilter,
  UploadListType,
  UploadTransformFileType,
  UploadType,
  UploadXHRArgs,
  ZipButtonOptions
} from './interface';
import { MpUploadBtnComponent } from './upload-btn.component';
import { MpUploadListComponent } from './upload-list.component';

@Component({
  selector: 'mp-upload',
  exportAs: 'mpUpload',
  templateUrl: './upload.component.html',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ant-upload-picture-card-wrapper]': 'mpListType === "picture-card"'
  }
})
export class MpUploadComponent implements OnInit, OnChanges, OnDestroy {
  private i18n$: Subscription;
  @ViewChild('uploadComp', { static: false }) uploadComp: MpUploadBtnComponent;
  @ViewChild('listComp', { static: false }) listComp: MpUploadListComponent;

  locale: MpSafeAny = {};

  // #region fields

  @Input() mpType: UploadType = 'select';
  @Input() @InputNumber() mpLimit = 0;
  @Input() @InputNumber() mpSize = 0;

  @Input() mpFileType: string;
  @Input() mpAccept: string | string[];
  @Input() mpAction:
    | string
    | ((file: UploadFile) => string | Observable<string>);
  @Input() @InputBoolean() mpDirectory = false;
  @Input() @InputBoolean() mpOpenFileDialogOnClick = true;
  @Input() mpBeforeUpload: (
    file: UploadFile,
    fileList: UploadFile[]
  ) => boolean | Observable<boolean>;
  @Input() mpCustomRequest: (item: UploadXHRArgs) => Subscription;
  @Input() mpData: {} | ((file: UploadFile) => {} | Observable<{}>);
  @Input() mpFilter: UploadFilter[] = [];
  @Input() mpFileList: UploadFile[] = [];
  @Input() @InputBoolean() mpDisabled = false;
  @Input() mpHeaders: {} | ((file: UploadFile) => {} | Observable<{}>);
  @Input() mpListType: UploadListType = 'text';
  @Input() @InputBoolean() mpMultiple = false;
  @Input() mpName = 'file';

  private _showUploadList: boolean | ShowUploadListInterface = true;

  @Input()
  set mpShowUploadList(value: boolean | ShowUploadListInterface) {
    this._showUploadList =
      typeof value === 'boolean' ? toBoolean(value) : value;
  }

  get mpShowUploadList(): boolean | ShowUploadListInterface {
    return this._showUploadList;
  }

  @Input() @InputBoolean() mpShowButton = true;
  @Input() @InputBoolean() mpWithCredentials = false;

  @Input() mpRemove: (file: UploadFile) => boolean | Observable<boolean>;
  @Input() mpPreview: (file: UploadFile) => void;
  @Input() mpPreviewFile: (file: UploadFile) => Observable<string>;
  @Input() mpTransformFile: (file: UploadFile) => UploadTransformFileType;
  @Input() mpDownload: (file: UploadFile) => void;
  @Input() mpIconRender: TemplateRef<void>;

  @Output() readonly mpChange: EventEmitter<
    UploadChangeParam
  > = new EventEmitter<UploadChangeParam>();
  @Output() readonly mpFileListChange: EventEmitter<
    UploadFile[]
  > = new EventEmitter<UploadFile[]>();

  _btnOptions: ZipButtonOptions;

  private zipOptions(): this {
    if (typeof this.mpShowUploadList === 'boolean' && this.mpShowUploadList) {
      this.mpShowUploadList = {
        showPreviewIcon: true,
        showRemoveIcon: true,
        showDownloadIcon: true
      };
    }
    // filters
    const filters: UploadFilter[] = this.mpFilter.slice();
    if (
      this.mpMultiple &&
      this.mpLimit > 0 &&
      filters.findIndex(w => w.name === 'limit') === -1
    ) {
      filters.push({
        name: 'limit',
        fn: (fileList: UploadFile[]) => fileList.slice(-this.mpLimit)
      });
    }
    if (this.mpSize > 0 && filters.findIndex(w => w.name === 'size') === -1) {
      filters.push({
        name: 'size',
        fn: (fileList: UploadFile[]) =>
          fileList.filter(w => w.size! / 1024 <= this.mpSize)
      });
    }
    if (
      this.mpFileType &&
      this.mpFileType.length > 0 &&
      filters.findIndex(w => w.name === 'type') === -1
    ) {
      const types = this.mpFileType.split(',');
      filters.push({
        name: 'type',
        fn: (fileList: UploadFile[]) =>
          fileList.filter(w => ~types.indexOf(w.type!))
      });
    }
    this._btnOptions = {
      disabled: this.mpDisabled,
      accept: this.mpAccept,
      action: this.mpAction,
      directory: this.mpDirectory,
      openFileDialogOnClick: this.mpOpenFileDialogOnClick,
      beforeUpload: this.mpBeforeUpload,
      customRequest: this.mpCustomRequest,
      data: this.mpData,
      headers: this.mpHeaders,
      name: this.mpName,
      multiple: this.mpMultiple,
      withCredentials: this.mpWithCredentials,
      filters,
      transformFile: this.mpTransformFile,
      onStart: this.onStart,
      onProgress: this.onProgress,
      onSuccess: this.onSuccess,
      onError: this.onError
    };
    return this;
  }

  // #endregion

  constructor(private cdr: ChangeDetectorRef, private i18n: MpI18nService) {}

  // #region upload

  private fileToObject(file: UploadFile): UploadFile {
    return {
      lastModified: file.lastModified,
      lastModifiedDate: file.lastModifiedDate,
      name: file.filename || file.name,
      size: file.size,
      type: file.type,
      uid: file.uid,
      response: file.response,
      error: file.error,
      percent: 0,
      originFileObj: file as MpSafeAny
    };
  }

  private getFileItem(file: UploadFile, fileList: UploadFile[]): UploadFile {
    return fileList.filter(item => item.uid === file.uid)[0];
  }

  private removeFileItem(
    file: UploadFile,
    fileList: UploadFile[]
  ): UploadFile[] {
    return fileList.filter(item => item.uid !== file.uid);
  }

  private onStart = (file: UploadFile): void => {
    if (!this.mpFileList) {
      this.mpFileList = [];
    }
    const targetItem = this.fileToObject(file);
    targetItem.status = 'uploading';
    this.mpFileList = this.mpFileList.concat(targetItem);
    this.mpFileListChange.emit(this.mpFileList);
    this.mpChange.emit({
      file: targetItem,
      fileList: this.mpFileList,
      type: 'start'
    });
    this.detectChangesList();
  };

  private onProgress = (e: { percent: number }, file: UploadFile): void => {
    const fileList = this.mpFileList;
    const targetItem = this.getFileItem(file, fileList);
    targetItem.percent = e.percent;
    this.mpChange.emit({
      event: e,
      file: { ...targetItem },
      fileList: this.mpFileList,
      type: 'progress'
    });
    this.detectChangesList();
  };

  private onSuccess = (res: {}, file: UploadFile): void => {
    const fileList = this.mpFileList;
    const targetItem = this.getFileItem(file, fileList);
    targetItem.status = 'done';
    targetItem.response = res;
    this.mpChange.emit({
      file: { ...targetItem },
      fileList,
      type: 'success'
    });
    this.detectChangesList();
  };

  private onError = (err: {}, file: UploadFile): void => {
    const fileList = this.mpFileList;
    const targetItem = this.getFileItem(file, fileList);
    targetItem.error = err;
    targetItem.status = 'error';
    this.mpChange.emit({
      file: { ...targetItem },
      fileList,
      type: 'error'
    });
    this.detectChangesList();
  };

  // #endregion

  // #region drag

  private dragState: string;

  // skip safari bug
  fileDrop(e: DragEvent): void {
    if (e.type === this.dragState) {
      return;
    }
    this.dragState = e.type;
    this.setClassMap();
  }

  // #endregion

  // #region list

  private detectChangesList(): void {
    this.cdr.detectChanges();
    this.listComp.detectChanges();
  }

  onRemove = (file: UploadFile): void => {
    this.uploadComp.abort(file);
    file.status = 'removed';
    const fnRes =
      typeof this.mpRemove === 'function'
        ? this.mpRemove(file)
        : this.mpRemove == null
        ? true
        : this.mpRemove;
    (fnRes instanceof Observable ? fnRes : of(fnRes))
      .pipe(filter((res: boolean) => res))
      .subscribe(() => {
        this.mpFileList = this.removeFileItem(file, this.mpFileList);
        this.mpChange.emit({
          file,
          fileList: this.mpFileList,
          type: 'removed'
        });
        this.mpFileListChange.emit(this.mpFileList);
        this.cdr.detectChanges();
      });
  };

  // #endregion

  // #region styles

  private prefixCls = 'ant-upload';
  classList: string[] = [];

  private setClassMap(): void {
    let subCls: string[] = [];
    if (this.mpType === 'drag') {
      if (this.mpFileList.some(file => file.status === 'uploading')) {
        subCls.push(`${this.prefixCls}-drag-uploading`);
      }
      if (this.dragState === 'dragover') {
        subCls.push(`${this.prefixCls}-drag-hover`);
      }
    } else {
      subCls = [`${this.prefixCls}-select-${this.mpListType}`];
    }

    this.classList = [
      this.prefixCls,
      `${this.prefixCls}-${this.mpType}`,
      ...subCls,
      (this.mpDisabled && `${this.prefixCls}-disabled`) || ''
    ].filter(item => !!item);

    this.cdr.detectChanges();
  }

  // #endregion

  ngOnInit(): void {
    this.i18n$ = this.i18n.localeChange.subscribe(() => {
      this.locale = this.i18n.getLocaleData('Upload');
      this.detectChangesList();
    });
  }

  ngOnChanges(): void {
    this.zipOptions().setClassMap();
  }

  ngOnDestroy(): void {
    this.i18n$.unsubscribe();
  }
}
