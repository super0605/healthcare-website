/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Inject, Injectable, Optional } from '@angular/core';
import { MpSafeAny } from '../types';
import { Observable, Subject } from 'rxjs';

import { filter, mapTo } from 'rxjs/operators';

import { NZ_CONFIG, MpConfig, MpConfigKey } from './config';

const isDefined = function(value?: MpSafeAny): boolean {
  return value !== undefined;
};

@Injectable({
  providedIn: 'root'
})
export class MpConfigService {
  private configUpdated$ = new Subject<keyof MpConfig>();

  /** Global config holding property. */
  private config: MpConfig;

  constructor(@Optional() @Inject(NZ_CONFIG) defaultConfig?: MpConfig) {
    this.config = defaultConfig || {};
  }

  getConfigForComponent<T extends MpConfigKey>(componentName: T): MpConfig[T] {
    return this.config[componentName];
  }

  getConfigChangeEventForComponent(
    componentName: MpConfigKey
  ): Observable<void> {
    return this.configUpdated$.pipe(
      filter(n => n === componentName),
      mapTo(undefined)
    );
  }

  set<T extends MpConfigKey>(componentName: T, value: MpConfig[T]): void {
    this.config[componentName] = { ...this.config[componentName], ...value };
    this.configUpdated$.next(componentName);
  }
}

// tslint:disable:no-invalid-this

/**
 * This decorator is used to decorate properties. If a property is decorated, it would try to load default value from
 * config.
 */
// tslint:disable-next-line:typedef
export function WithConfig<T>(
  componentName: MpConfigKey,
  innerDefaultValue?: T
) {
  return function ConfigDecorator(
    target: MpSafeAny,
    propName: MpSafeAny,
    originalDescriptor?: TypedPropertyDescriptor<T>
  ): MpSafeAny {
    const privatePropName = `$$__assignedValue__${propName}`;

    Object.defineProperty(target, privatePropName, {
      configurable: true,
      writable: true,
      enumerable: false
    });

    return {
      get(): T | undefined {
        const originalValue =
          originalDescriptor && originalDescriptor.get
            ? originalDescriptor.get.bind(this)()
            : this[privatePropName];

        if (isDefined(originalValue)) {
          return originalValue;
        }

        const componentConfig =
          this.mpConfigService.getConfigForComponent(componentName) || {};
        const configValue = componentConfig[propName];

        return isDefined(configValue) ? configValue : innerDefaultValue;
      },
      set(value?: T): void {
        if (originalDescriptor && originalDescriptor.set) {
          originalDescriptor.set.bind(this)(value);
        } else {
          this[privatePropName] = value;
        }
      },
      configurable: true,
      enumerable: true
    };
  };
}
