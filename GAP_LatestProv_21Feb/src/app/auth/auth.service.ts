import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  public isAuthenticated(): boolean {
    const userId = localStorage.getItem('userId');

    if (userId != null )
    {
        return true;
    }
    else{

      return false;

    }
  }
}
