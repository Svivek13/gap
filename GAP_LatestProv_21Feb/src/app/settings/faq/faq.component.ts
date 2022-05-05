import { Component, OnInit } from '@angular/core';
import { MlopsService } from 'src/app/mlops.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  faqs: any;

  constructor(private mlopsService: MlopsService) { }

  ngOnInit(): void {
    this.fetchFaqData();
  }

  fetchFaqData() {
    this.mlopsService.faqData().subscribe((res) => {
      console.log(res);
      this.faqs = res.data;
    },
    err => {
      console.log(err);
    });
}

}

