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
  EventEmitter,
  forwardRef,
  Input,
  NgZone,
  OnDestroy,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MpSafeAny, OnChangeType, OnTouchedType } from '../core/types';
import { warn } from '../core/logger';
import { inNextTick, InputBoolean } from '../core/util';
import { BehaviorSubject, combineLatest, fromEvent, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  takeUntil
} from 'rxjs/operators';

import { MpCodeEditorService } from './code-editor.service';
import {
  DiffEditorOptions,
  EditorOptions,
  JoinedEditorOptions,
  MpEditorMode
} from './typings';

// Import types from monaco editor.
import { editor } from 'monaco-editor';
import IEditor = editor.IEditor;
import IDiffEditor = editor.IDiffEditor;
import ITextModel = editor.ITextModel;

declare const monaco: MpSafeAny;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'mp-code-editor',
  exportAs: 'mpCodeEditor',
  template: `
    <div class="ant-code-editor-loading" *ngIf="mpLoading">
      <mp-spin></mp-spin>
    </div>

    <div class="ant-code-editor-toolkit" *ngIf="mpToolkit">
      <ng-template [ngTemplateOutlet]="mpToolkit"></ng-template>
    </div>
  `,
  host: {
    '[class.ant-code-editor]': 'true'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MpCodeEditorComponent),
      multi: true
    }
  ]
})
export class MpCodeEditorComponent implements OnDestroy, AfterViewInit {
  @Input() mpEditorMode: MpEditorMode = 'normal';
  @Input() mpOriginalText = '';
  @Input() @InputBoolean() mpLoading = false;
  @Input() @InputBoolean() mpFullControl = false;
  @Input() mpToolkit: TemplateRef<void>;

  @Input() set mpEditorOption(value: JoinedEditorOptions) {
    this.editorOption$.next(value);
  }

  @Output() readonly mpEditorInitialized = new EventEmitter<
    IEditor | IDiffEditor
  >();

  editorOptionCached: JoinedEditorOptions = {};

  private readonly el: HTMLElement;
  private destroy$ = new Subject<void>();
  private resize$ = new Subject<void>();
  private editorOption$ = new BehaviorSubject<JoinedEditorOptions>({});
  private editorInstance: IEditor | IDiffEditor;
  private value = '';
  private modelSet = false;

  constructor(
    private mpCodeEditorService: MpCodeEditorService,
    private ngZone: NgZone,
    elementRef: ElementRef
  ) {
    this.el = elementRef.nativeElement;
  }

  /**
   * Initialize a monaco editor instance.
   */
  ngAfterViewInit(): void {
    this.mpCodeEditorService
      .requestToInit()
      .subscribe(option => this.setup(option));
  }

  ngOnDestroy(): void {
    if (this.editorInstance) {
      this.editorInstance.dispose();
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  writeValue(value: string): void {
    this.value = value;
    this.setValue();
  }

  registerOnChange(fn: OnChangeType): MpSafeAny {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouch = fn;
  }

  onChange: OnChangeType;

  onTouch: OnTouchedType;

  layout(): void {
    this.resize$.next();
  }

  private setup(option: JoinedEditorOptions): void {
    inNextTick().subscribe(() => {
      this.editorOptionCached = option;
      this.registerOptionChanges();
      this.initMonacoEditorInstance();
      this.registerResizeChange();
      this.setValue();

      if (!this.mpFullControl) {
        this.setValueEmitter();
      }

      this.mpEditorInitialized.emit(this.editorInstance);
    });
  }

  private registerOptionChanges(): void {
    combineLatest([this.editorOption$, this.mpCodeEditorService.option$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([selfOpt, defaultOpt]) => {
        this.editorOptionCached = {
          ...this.editorOptionCached,
          ...defaultOpt,
          ...selfOpt
        };
        this.updateOptionToMonaco();
      });
  }

  private initMonacoEditorInstance(): void {
    this.ngZone.runOutsideAngular(() => {
      this.editorInstance =
        this.mpEditorMode === 'normal'
          ? monaco.editor.create(this.el, { ...this.editorOptionCached })
          : monaco.editor.createDiffEditor(this.el, {
              ...(this.editorOptionCached as DiffEditorOptions)
            });
    });
  }

  private registerResizeChange(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'resize')
        .pipe(
          debounceTime(300),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.layout();
        });

      this.resize$
        .pipe(
          takeUntil(this.destroy$),
          filter(() => !!this.editorInstance),
          map(() => ({
            width: this.el.clientWidth,
            height: this.el.clientHeight
          })),
          distinctUntilChanged(
            (a, b) => a.width === b.width && a.height === b.height
          ),
          debounceTime(50)
        )
        .subscribe(() => {
          this.editorInstance.layout();
        });
    });
  }

  private setValue(): void {
    if (!this.editorInstance) {
      return;
    }

    if (this.mpFullControl && this.value) {
      warn(
        `should not set value when you are using full control mode! It would result in ambiguous data flow!`
      );
      return;
    }

    if (this.mpEditorMode === 'normal') {
      if (this.modelSet) {
        (this.editorInstance.getModel() as ITextModel).setValue(this.value);
      } else {
        (this.editorInstance as IEditor).setModel(
          monaco.editor.createModel(
            this.value,
            (this.editorOptionCached as EditorOptions).language
          )
        );
        this.modelSet = true;
      }
    } else {
      if (this.modelSet) {
        const model = (this.editorInstance as IDiffEditor).getModel()!;
        model.modified.setValue(this.value);
        model.original.setValue(this.mpOriginalText);
      } else {
        const language = (this.editorOptionCached as EditorOptions).language;
        (this.editorInstance as IDiffEditor).setModel({
          original: monaco.editor.createModel(this.mpOriginalText, language),
          modified: monaco.editor.createModel(this.value, language)
        });
        this.modelSet = true;
      }
    }
  }

  private setValueEmitter(): void {
    const model = (this.mpEditorMode === 'normal'
      ? (this.editorInstance as IEditor).getModel()
      : (this.editorInstance as IDiffEditor).getModel()!
          .modified) as ITextModel;

    model.onDidChangeContent(() => {
      this.emitValue(model.getValue());
    });
  }

  private emitValue(value: string): void {
    this.value = value;
    this.onChange(value);
  }

  private updateOptionToMonaco(): void {
    if (this.editorInstance) {
      this.editorInstance.updateOptions({ ...this.editorOptionCached });
    }
  }
}
