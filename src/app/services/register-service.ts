import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {CommService}from'../services/comm-service'
import { map } from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  responseSubjects = {
    RegisterUserResponseAddOK:new Subject<any>(),
    RegisterUserExistsResponse:new Subject<any>(),
    RegisterUserResponseDontAdd:new Subject<any>()
}
errorSubject = new Subject<any>()
constructor(private commService:CommService) { }
Register(value:any){

    var obs =  this.commService.Register(value)
    var obs2 = obs.pipe(
            map(response=>[this.responseSubjects[response.ResponseType],response])
    )
    
    obs2.subscribe(
      ([responseSubject,response])=>responseSubject.next(response),
      error=>this.onError().next(error)
      
      )
    
}
onError():Subject<any>{
  return this.errorSubject
}
RegisterUserResponseAddOK():Subject<any>{
  return this.responseSubjects.RegisterUserResponseAddOK;
}
RegisterUserExistsResponse():Subject<any>{
  return this.responseSubjects.RegisterUserExistsResponse;
}
RegisterUserResponseDontAdd():Subject<any>{
return this.responseSubjects.RegisterUserResponseDontAdd;
}
}
