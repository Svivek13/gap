import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MlopsService } from 'src/app/mlops.service';
import { SettingsComponent } from '../settings.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  userName: string;
  videoId: any;

  constructor(private mlopsService: MlopsService, private router: Router, private help: SettingsComponent) { }

  ngOnInit(): void {
    this.userName = this.mlopsService.loggedInUsername ? this.mlopsService.loggedInUsername
    : localStorage.getItem('username') ? localStorage.getItem('username') : 'User';
    this.getVideo();
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }

  getVideo() {
    const obj = {
      type: 'video',
      name: 'welcome_video'
    };
    this.mlopsService.videoWelcomePage(obj).subscribe((res) => {
      console.log(res);
      this.videoId = res.data.properties.yt_id;
    });
  }

  linkPages(name) {
    if (name === 'cockpit') {
      this.router.navigate(['/overview']);
    } else if (name === 'faq') {
      this.help.getSettingsDetails('FAQs');
    } else if (name === 'feedback') {
      this.help.getSettingsDetails('Provide Feedback');
    }
  }

}
