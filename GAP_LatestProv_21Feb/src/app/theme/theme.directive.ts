import { Directive, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { ThemeService } from './theme.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Theme } from './symbols';

@Directive({
  selector: '[app-theme]'
})
export class ThemeDirective implements OnInit {

  private unsubscribe = new Subject();
  constructor(
    private renderer: Renderer2,
    private _elementRef: ElementRef,
    private _themeService: ThemeService
  ) {}

  ngOnInit() {
    const active = this._themeService.getActiveTheme();
    if (active) {
      this.updateTheme(active);
    }
    this._themeService.themeChange.pipe(takeUntil(this.unsubscribe))
      .subscribe((theme: Theme) => this.updateTheme(theme));
  }

  updateTheme(theme: Theme) {
    if (theme.name === 'light') {
      this.renderer.addClass(document.body, 'light-mode');
      this.renderer.removeClass(document.body, 'dark-mode');
      
      // elementRef pe dark and light mode not required, it seems, to check and clean code later
      // this.renderer.removeClass(this._elementRef.nativeElement, 'dark-mode');
      // this.renderer.addClass(this._elementRef.nativeElement, 'light-mode');
      
      localStorage.setItem('theme', 'light');
    } else if (theme.name === 'dark') {
      this.renderer.addClass(document.body, 'dark-mode');
      this.renderer.removeClass(document.body, 'light-mode');
      
      // elementRef pe dark and light mode not required, it seems, to check and clean code later
      // this.renderer.removeClass(this._elementRef.nativeElement, 'light-mode');
      // this.renderer.addClass(this._elementRef.nativeElement, 'dark-mode');
      
      localStorage.setItem('theme', 'dark');
    }
    // for (const key in theme.properties) {
    //   this._elementRef.nativeElement.style.setProperty(key, theme.properties[key]);
    // }
  }

}
