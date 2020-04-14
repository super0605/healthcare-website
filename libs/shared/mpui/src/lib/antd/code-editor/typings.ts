/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { InjectionToken } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { editor } from 'monaco-editor';
import IStandAloneEditorConstructionOptions = editor.IStandaloneEditorConstructionOptions;
import IDiffEditorConstructionOptions = editor.IDiffEditorConstructionOptions;

export type EditorOptions = IStandAloneEditorConstructionOptions;
export type DiffEditorOptions = IDiffEditorConstructionOptions;
export type JoinedEditorOptions = EditorOptions | DiffEditorOptions;

export type MpEditorMode = 'normal' | 'diff';

export enum MpCodeEditorLoadingStatus {
  UNLOAD = 'unload',
  LOADING = 'loading',
  LOADED = 'LOADED'
}

export interface MpCodeEditorConfig {
  assetsRoot?: string | SafeUrl;
  defaultEditorOption?: JoinedEditorOptions;
  useStaticLoading?: boolean;

  onLoad?(): void;
  onFirstEditorInit?(): void;
  onInit?(): void;
}

export const NZ_CODE_EDITOR_CONFIG = new InjectionToken<MpCodeEditorConfig>(
  'mp-code-editor-config',
  {
    providedIn: 'root',
    factory: NZ_CODE_EDITOR_CONFIG_FACTORY
  }
);

export function NZ_CODE_EDITOR_CONFIG_FACTORY(): MpCodeEditorConfig {
  return {};
}
