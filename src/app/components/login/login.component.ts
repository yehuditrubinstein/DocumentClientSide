import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { RegisterUserRequest } from "../../models/RegisterUserRequest";
import { AuthService } from 'src/app/services/auth.service';
import { DocumentSharingService } from 'src/app/services/document-sharing.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

   constructor(private DocumentSharingService:DocumentSharingService, private loginService: LoginService, private router: Router, private authservice: AuthService) { }
  userForm: FormGroup;
  ngOnInit(): void {
    this.userForm = new FormGroup(
      {
        UserID: new FormControl('', [Validators.required, Validators.email]),
        UserName: new FormControl('')


      }
    )

    this.loginService.RegisterUserExistsResponse().subscribe(
      response => {
        debugger
        console.log("hi!!!!")
        this.authservice.loginAuth(this.userForm.value.UserID);
        this.router.navigate(['my-document-component'])
      })
    this.loginService.onError().subscribe
      (
        message => console.log("Error", message)
      )
  }

  onSubmit() {
    console.log(this.userForm.value)
    let request = new RegisterUserRequest()
    request.UserDTO = this.userForm.value;
    this.loginService.Login(request)

  }
}
