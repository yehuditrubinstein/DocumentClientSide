import { Component, OnInit } from '@angular/core';
import { RegisterUserRequest } from 'src/app/models/RegisterUserRequest';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegisterService } from 'src/app/services/register-service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private userRegisterService: RegisterService, private router: Router, private authservice: AuthService) { }
  userForm: FormGroup;
  ngOnInit(): void {
    this.userForm = new FormGroup(
      {
        UserID: new FormControl('', [Validators.required, Validators.email]),
        UserName: new FormControl('')


      }
    )

    console.log(this.userForm)
    this.userRegisterService.RegisterUserResponseAddOK().subscribe(
      response => {
        console.log("Yup we are on client side with OK")

        this.authservice.loginAuth(this.userForm.value.UserID)
        this.router.navigate(['my-document-component'])
      }
    )
    this.userRegisterService.RegisterUserExistsResponse().subscribe(
      //Todo Display message to user 
      response => console.log("Yup we are on client side with Useralready exists")
    )
    this.userRegisterService.RegisterUserResponseDontAdd().subscribe(
      //Todo Display message to user 
      response => console.log("Yup we are on client side with dont add user")
    )
    this.userRegisterService.onError().subscribe
      (
        //Todo Navigate to exit page
        message => console.log("Error", message)
      )
  }

  onSubmit() {
    console.log(this.userForm.value)
    let request = new RegisterUserRequest()
    request.UserDTO = this.userForm.value;

    this.userRegisterService.Register(request)

  }

}
