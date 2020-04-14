/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  Directive,
  ElementRef,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional
} from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { MpWaveRenderer } from './mp-wave-renderer';

export interface MpWaveConfig {
  disabled?: boolean;
}

export const NZ_WAVE_GLOBAL_DEFAULT_CONFIG: MpWaveConfig = {
  disabled: false
};

export const NZ_WAVE_GLOBAL_CONFIG = new InjectionToken<MpWaveConfig>(
  'mp-wave-global-options',
  {
    providedIn: 'root',
    factory: NZ_WAVE_GLOBAL_CONFIG_FACTORY
  }
);

export function NZ_WAVE_GLOBAL_CONFIG_FACTORY(): MpWaveConfig {
  return NZ_WAVE_GLOBAL_DEFAULT_CONFIG;
}

@Directive({
  selector: '[mp-wave],button[mp-button]',
  exportAs: 'mpWave'
})
export class MpWaveDirective implements OnInit, OnDestroy {
  @Input() mpWaveExtraNode = false;

  private waveRenderer: MpWaveRenderer;
  private waveDisabled: boolean = false;

  get disabled(): boolean {
    return this.waveDisabled;
  }

  get rendererRef(): MpWaveRenderer {
    return this.waveRenderer;
  }

  constructor(
    private ngZone: NgZone,
    private elementRef: ElementRef,
    @Optional() @Inject(NZ_WAVE_GLOBAL_CONFIG) private config: MpWaveConfig,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) private animationType: string
  ) {
    this.waveDisabled = this.isConfigDisabled();
  }

  isConfigDisabled(): boolean {
    let disabled = false;
    if (this.config && typeof this.config.disabled === 'boolean') {
      disabled = this.config.disabled;
    }
    if (this.animationType === 'NoopAnimations') {
      disabled = true;
    }
    return disabled;
  }

  ngOnDestroy(): void {
    if (this.waveRenderer) {
      this.waveRenderer.destroy();
    }
  }

  ngOnInit(): void {
    this.renderWaveIfEnabled();
  }

  renderWaveIfEnabled(): void {
    if (!this.waveDisabled && this.elementRef.nativeElement) {
      this.waveRenderer = new MpWaveRenderer(
        this.elementRef.nativeElement,
        this.ngZone,
        this.mpWaveExtraNode
      );
    }
  }

  disable(): void {
    this.waveDisabled = true;
    if (this.waveRenderer) {
      this.waveRenderer.removeTriggerEvent();
      this.waveRenderer.removeStyleAndExtraNode();
    }
  }

  enable(): void {
    // config priority
    this.waveDisabled = this.isConfigDisabled() || false;
    if (this.waveRenderer) {
      this.waveRenderer.bindTriggerEvent();
    }
  }
}
