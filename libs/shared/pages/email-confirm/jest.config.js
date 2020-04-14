module.exports = {
  name: 'shared-pages-email-confirm',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/shared/pages/email-confirm',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
