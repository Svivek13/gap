import { Directive } from '@angular/core';

@Directive({
  selector: '[appTrack]'
})
export class TrackDirective {

  constructor() { }

}

// (focus)="myMethod()"
// (blur)="myMethod()" 
// (submit)="myMethod()"  
// (scroll)="myMethod()"

// (cut)="myMethod()"
// (copy)="myMethod()"
// (paste)="myMethod()"

// (keydown)="myMethod()"
// (keypress)="myMethod()"
// (keyup)="myMethod()"

// (mouseenter)="myMethod()"
// (mousedown)="myMethod()"
// (mouseup)="myMethod()"

// (click)="myMethod()"
// (dblclick)="myMethod()"

// (drag)="myMethod()"
// (dragover)="myMethod()"
// (drop)="myMethod()"

// wheel, touchstart
// blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error