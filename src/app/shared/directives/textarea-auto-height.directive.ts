import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appTextareaAutoHeight]'
})
export class TextareaAutoHeightDirective {

  constructor() { }

  @HostListener("input",['$event']) onInput(event) {
    // console.log(event.target.value);
    console.log(event.target.value.clientWidth);
    
    const width = Math.ceil(event.target.value.clientWidth)
    
    // Math.ceil()
    
  }

}
