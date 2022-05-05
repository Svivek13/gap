import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {

  @Input() dropdownLabel: any;
  @Input() dropdownName: string;
  @Input() options: object;
  @Input() multiOptions: object;
  @Input() multi: boolean;
  @Input() multiPlaceholder: string;
  @Input() placeholder: string;

  constructor() { }

  ngOnInit(): void {
  }

}
