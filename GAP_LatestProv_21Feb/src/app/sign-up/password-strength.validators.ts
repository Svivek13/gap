import { AbstractControl, ValidationErrors } from '@angular/forms';

export const PasswordStrengthValidator = (control: AbstractControl): ValidationErrors | null => {

  const value: string = control.value || '';
  const msg = '';
  if (!value) {
    return null;
  }

  const upperCaseCharacters = /[A-Z]+/g;
  const lowerCaseCharacters = /[a-z]+/g;
  const numberCharacters = /[0-9]+/g;
  const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.\/?]+/;
  if (upperCaseCharacters.test(value) === false || lowerCaseCharacters.test(value) === false ||
   numberCharacters.test(value) === false || specialCharacters.test(value) === false) {
    return {
      passwordStrength: 'Password must contain at least each of the following: numbers, lowercase letters, uppercase letters, or special characters. Do not use < or >'
    };
  }
};
