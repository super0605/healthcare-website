/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Observable, Subscription } from 'rxjs';

import { IndexableObject, MpSafeAny } from '../core/types';

/** Status */
export type UploadFileStatus =
  | 'error'
  | 'success'
  | 'done'
  | 'uploading'
  | 'removed';

/** Uploading type. */
export type UploadType = 'select' | 'drag';

/** Built-in styles of the uploading list. */
export type UploadListType = 'text' | 'picture' | 'picture-card';

/** File object. */
export interface UploadFile {
  uid: string;
  size?: number;
  name: string;
  filename?: string;
  lastModified?: string;
  lastModifiedDate?: Date;
  url?: string;
  status?: UploadFileStatus;
  originFileObj?: File;
  percent?: number;
  thumbUrl?: string;
  response?: MpSafeAny;
  error?: MpSafeAny;
  linkProps?: { download: string };
  type?: string;

  [key: string]: MpSafeAny;
}

export interface UploadChangeParam {
  file: UploadFile;
  fileList: UploadFile[];
  event?: { percent: number };
  /** Callback type. */
  type?: string;
}

export interface ShowUploadListInterface {
  showRemoveIcon?: boolean;
  showPreviewIcon?: boolean;
  showDownloadIcon?: boolean;
}

export type UploadTransformFileType =
  | string
  | Blob
  | File
  | Observable<string | Blob | File>;

export interface ZipButtonOptions {
  disabled?: boolean;
  accept?: string | string[];
  action?: string | ((file: UploadFile) => string | Observable<string>);
  directory?: boolean;
  openFileDialogOnClick?: boolean;
  beforeUpload?(
    file: UploadFile,
    fileList: UploadFile[]
  ): boolean | Observable<MpSafeAny>;
  customRequest?(item: MpSafeAny): Subscription;
  data?: {} | ((file: UploadFile) => {} | Observable<{}>);
  headers?: {} | ((file: UploadFile) => {} | Observable<{}>);
  name?: string;
  multiple?: boolean;
  withCredentials?: boolean;
  filters?: UploadFilter[];
  transformFile?(file: UploadFile): UploadTransformFileType;
  onStart?(file: UploadFile): void;
  onProgress?(e: MpSafeAny, file: UploadFile): void;
  onSuccess?(ret: MpSafeAny, file: UploadFile, xhr: MpSafeAny): void;
  onError?(err: MpSafeAny, file: UploadFile): void;
}

export interface UploadFilter {
  name: string;
  fn(fileList: UploadFile[]): UploadFile[] | Observable<UploadFile[]>;
}

export interface UploadXHRArgs {
  action?: string;
  name?: string;
  headers?: IndexableObject;
  file: UploadFile;
  postFile: string | Blob | File | UploadFile;
  data?: IndexableObject;
  withCredentials?: boolean;
  onProgress?(e: MpSafeAny, file: UploadFile): void;
  onSuccess?(ret: MpSafeAny, file: UploadFile, xhr: MpSafeAny): void;
  onError?(err: MpSafeAny, file: UploadFile): void;
}
