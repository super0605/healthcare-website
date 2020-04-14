module.exports = {
  name: 'shared-login',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shared/pages/login',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
