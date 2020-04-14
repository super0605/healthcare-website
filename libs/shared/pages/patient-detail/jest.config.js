module.exports = {
  name: 'shared-patient-detail',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/shared/pages/patient-detail',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
