import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MlopsService } from 'src/app/mlops.service';

@Component({
  selector: 'app-drilldown-table',
  templateUrl: './drilldown-table.component.html',
  styleUrls: ['./drilldown-table.component.scss']
})
export class DrilldownTableComponent implements OnInit {
  loader = false;
  drillDownData: any;
  displayedColumns: string[] = ['Decile','Brand', 'source_name', 'source_count', 'sink_count', 'sink_name'];
  sinkTable: any;
  sourceTable: any;
  math=Math;
  constructor(private mlopsService: MlopsService,@Inject(MAT_DIALOG_DATA) public data: any,) {
    this.sinkTable = data.sink_name;
    this.sourceTable = data.source_name;
   }

  ngOnInit(): void {
    this.getDrillDownResult( this.sinkTable, this.sourceTable)
  }
  getDrillDownResult(sinkName, sourceName) {
    const obj = {
      sink_name: sinkName,
      source_name: sourceName
    }
    this.loader = true;
    this.mlopsService.getDrillDownResult(obj)
      .subscribe((res) => {
        this.loader = false;
        this.drillDownData = res.data;

      })
  }
  getPerVal(val){  
    if(val > 5){
      return true;
    }else{
      return false;
    }
  }
}
