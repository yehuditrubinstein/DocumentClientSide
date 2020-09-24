import { Injectable } from '@angular/core';
import { CommService } from './comm-service';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewDocumentService {
  responseSubjects={
    DocumentResponseAddOK:new Subject<any>(),
}
errorSubject = new Subject<any>()

  constructor(private commService:CommService) { }

  UploaNewDocument(doc){
   var obs= this.commService.UploaNewDocument(doc)
   var obs2=obs.pipe(map(response=> [this.responseSubjects[response.ResponseType], response]))
   obs2.subscribe(([responseSubjects,response])=>responseSubjects.next(response))
  }
onDocumenrResponseUploadOK():Subject<any>{
  return this.responseSubjects.DocumentResponseAddOK;
}
onError():Subject<any>{
  return this.errorSubject;
}
}
