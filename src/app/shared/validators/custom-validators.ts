import { FormControl, FormGroup } from '@angular/forms';

export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName]
        const matchingControl = formGroup.controls[matchingControlName]

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl(required etc...)
            return;

        } 
        if (control.value !== matchingControl.value) {
            // WICHTIG: nicht formGroup.setErrors(...) sondern matchingControl.setErrors(...) 
            // (= control Object -> call by reference: https://stackoverflow.com/questions/35473404/pass-by-value-and-pass-by-reference-in-javascript
            matchingControl.setErrors({mustMatch: true})
        } else {
            matchingControl.setErrors(null)
        }
    }
}