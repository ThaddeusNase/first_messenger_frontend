import { Directive, ElementRef, OnChanges, OnInit, SimpleChanges } from "@angular/core";

@Directive({
    selector: "[appAutoLineBreak]"
})
export class AutoLineBreakDirective {

    constructor(private elRef: ElementRef) {
    }
    // WICHTIG: in ngAfterViewInit() aufrufen (statt in ngOnInit(), da sonst der content aus der string interpolation 
    // {{ message.content }} nicht übernommen wird/ gerendert wurde)
    ngAfterViewInit() {
        // const content: string = this.elRef.nativeElement.innerText
        // // const msgStringWidth = this.elRef.nativeElement.offsetWidth
        // console.log("msg-bubble-content-innerHtml: ", content);
        // const splittedContent = content.split(" ")

        // let transformedContent: string;

        // splittedContent.forEach(
        //     (singleWord: string, i: number) => {
        //         if (singleWord.length >= 20) {
        //             console.log("Todo: split string");
        //             if (i % 20 == 0) {
        //                 con transformedWord = this.insert

        //             }
                    
                    
                    
        //         }
        //     }
        //     // this.elRef.nativeElement.innerText = transformedContent
        // )
        // console.log(splittedContent);
        
        // console.log("msg-bubble-widht: ", bubbleWidth);
    }

    insert(str, index, value) {
        return str.substr(0, index) + value + str.substr(index);
    }


}