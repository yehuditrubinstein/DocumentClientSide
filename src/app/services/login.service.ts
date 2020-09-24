import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CommService } from './comm-service';
import { map } from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class LoginService {

   responseSubjects = {
    RegisterUserExistsResponse:new Subject<any>()
   }
errorSubject = new Subject<any>()
constructor(private commService:CommService) { }
Login(value:any){

    var obs =  this.commService.Login(value)
    var obs2 = obs.pipe(
            map(response=>[this.responseSubjects[response.ResponseType],response])
    )
    
    obs2.subscribe(
      ([responseSubject,response])=>{
        
        responseSubject.next(response)},
      error=>this.onError().next(error)
      
      )
    
}
onError():Subject<any>{
  return this.errorSubject
}

RegisterUserExistsResponse():Subject<any>{
  return this.responseSubjects.RegisterUserExistsResponse;
}

}
