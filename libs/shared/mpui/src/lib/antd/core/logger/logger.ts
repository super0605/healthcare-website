/**
 * @license
 * Copyright Alibaba.com All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { isDevMode } from '@angular/core';
import { environment } from '../environments';
import { MpSafeAny } from '../types';

const record: Record<string, boolean> = {};

export const PREFIX = '[NG-ZORRO]:';

function notRecorded(...args: MpSafeAny[]): boolean {
  const asRecord = args.reduce((acc, c) => acc + c.toString(), '');

  if (record[asRecord]) {
    return false;
  } else {
    record[asRecord] = true;
    return true;
  }
}

function consoleCommonBehavior(
  consoleFunc: (...args: MpSafeAny) => void,
  ...args: MpSafeAny[]
): void {
  if (environment.isTestMode || (isDevMode() && notRecorded(...args))) {
    consoleFunc(...args);
  }
}

// Warning should only be printed in dev mode and only once.
export const warn = (...args: MpSafeAny[]) =>
  consoleCommonBehavior(
    (...arg: MpSafeAny[]) => console.warn(PREFIX, ...arg),
    ...args
  );

export const warnDeprecation = (...args: MpSafeAny[]) => {
  if (!environment.isTestMode) {
    const stack = new Error().stack;
    return consoleCommonBehavior(
      (...arg: MpSafeAny[]) =>
        console.warn(PREFIX, 'deprecated:', ...arg, stack),
      ...args
    );
  } else {
    return () => {};
  }
};

// Log should only be printed in dev mode.
export const log = (...args: MpSafeAny[]) => {
  if (isDevMode()) {
    console.log(PREFIX, ...args);
  }
};
