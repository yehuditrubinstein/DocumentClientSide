import { Injectable, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentDTO } from '../models/DocumentRequest';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // @Output() getLoggedInName: EventEmitter<boolean> = new EventEmitter();

  constructor(private router: Router) { }
  getUser() {
    return sessionStorage.getItem('currentUser')
  }
  isAuth() {
    if (sessionStorage.getItem('currentUser'))
      return true;
  }
  loginAuth(user: string) {
    debugger
    sessionStorage.setItem('currentUser', user);
    this.router.navigate(["/my-document-component"]);
  }
  logout() {
    sessionStorage.removeItem('currentUser');
    this.router.navigate(["/login-component"]);
  }
  SetEditDoc(MyDoc: DocumentDTO) {
    sessionStorage.setItem("MyDoc", JSON.stringify(MyDoc));
  }
  GetEditDoc() {

   var item = sessionStorage.getItem("MyDoc");
   var retval:DocumentDTO=JSON.parse(item)
   return retval;
  }
}
