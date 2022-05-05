import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tech-doc',
  templateUrl: './tech-doc.component.html',
  styleUrls: ['./tech-doc.component.scss']
})
export class TechDocComponent implements OnInit {
  @Input() tdType: string;
  constructor() { }

  ngOnInit(): void {
  }

}
