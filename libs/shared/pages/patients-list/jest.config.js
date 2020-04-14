module.exports = {
  name: 'shared-patients-list',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shared/pages/patients-list',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
