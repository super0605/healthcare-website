module.exports = {
  name: 'shared-clinicians-list',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shared/pages/clinicians-list',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
