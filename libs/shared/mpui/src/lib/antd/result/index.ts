export * from './result.module';
export * from './result.component';
export * from './result-cells';

// Making these partial components not visible to users but comprehensible to ng-packagr.
export {
  MpResultNotFoundComponent as ɵMpResultNotFoundComponent
} from './partial/not-found';
export {
  MpResultServerErrorComponent as ɵMpResultServerErrorComponent
} from './partial/server-error.component';
export {
  MpResultUnauthorizedComponent as ɵMpResultUnauthorizedComponent
} from './partial/unauthorized';
