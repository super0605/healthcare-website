module.exports = {
  name: 'shared-pages-signup',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/shared/pages/signup',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
