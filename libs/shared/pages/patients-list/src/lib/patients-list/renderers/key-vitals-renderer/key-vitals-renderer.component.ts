import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { constants } from '../../../constants';

@Component({
  selector: 'mp-key-vitals-renderer',
  templateUrl: './key-vitals-renderer.component.html',
  styleUrls: ['./key-vitals-renderer.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class KeyVitalsRendererComponent implements OnInit {
  @Input() data;

  public hiddenKeys = {
    red: 0,
    amber: 0,
    green: 0
  };

  private constants = constants;
  public displayKeys = [];

  constructor() {}

  ngOnInit(): void {
    this.createDisplayKeys(this.data);
  }

  createDisplayKeys(item) {
    const allItems = item['redModuleNames']
      .concat(item['amberModuleNames'])
      .concat(item['greenModuleNames']);
    this.displayKeys = allItems.slice(0, 3);
    this.setOverItems(allItems);
  }

  setOverItems(list) {
    for (let i = 3; i < list.length; i++) {
      this.hiddenKeys[list[i].type]++;
    }
  }
}
