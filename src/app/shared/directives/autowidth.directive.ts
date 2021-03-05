import {Directive, ElementRef, HostListener, OnInit} from '@angular/core'

// MARK: AutoWidthDirective in app.module.ts in declarations deklarieren!!!
// appAutowidth wird zb u.a im profile.component.html template aufgerufen
@Directive({
    selector: '[appAutowidth]'
})
export class AutoWidthDirective implements OnInit {

    // el (bzw ElementRef) == html/dom element, welches das directive (appAutowidth) besitzt
    // el.native.element hat dann alle normalen attribute, die eine normales html/dom element hat hat
    // (zB input.value.length)
    constructor(private el: ElementRef) {
    }

    ngOnInit(): void {
        // this.el.nativeElement.setAttribute("size", this.el.nativeElement.value.length)
        console.log("----------init");
        

    }


    // @HostListener("keyup") onKeyUp() {
    //     this.resize()
    // } 

    // @HostListener("focus") onFocus() {
    //     this.resize()
    // }




    resize() {
        this.el.nativeElement.setAttribute("size", 20)
    }

}