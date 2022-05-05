import { Directive, Renderer2, ElementRef, AfterViewInit, HostListener } from '@angular/core';

@Directive({
  selector: '[appTooltipOnEllipsis]'
})
export class TooltipOnEllipsisDirective implements AfterViewInit {
  domElement: any;
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
    this.domElement = this.elementRef.nativeElement;
    const elipsifyme = {
      'text-overflow': 'ellipsis',
      overflow: 'hidden',
      'white-space': 'nowrap',
    };
    Object.keys(elipsifyme).forEach(newStyle => {
      this.renderer.setStyle(
        this.domElement, `${newStyle}`, elipsifyme[newStyle]
      );
    });
  }

  ngAfterViewInit(): void {
    this.renderer.setProperty(this.domElement, 'scrollTop', 1);
    this.isTitleAttribute();
  }

  @HostListener('window:resize', [''])
  isTitleAttribute() {
    (this.domElement.offsetWidth < this.domElement.scrollWidth) ?
      this.renderer.setAttribute(this.domElement, 'title', this.domElement.textContent) :
      this.renderer.removeAttribute(this.domElement, 'title');
  }

}
