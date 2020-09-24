import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { CommService } from './comm-service';
import { map } from "rxjs/operators";
import { DocumentDTO } from '../models/DocumentRequest';
@Injectable({
  providedIn: 'root'
})
export class MyDocumentService {
 
  selectedDoc:DocumentDTO;
  responseSubjects = {
    DocumentResponse: new Subject<any>(),
    DocumentResponseEmpty: new Subject<any>()

  }
  errorSubject = new Subject<any>()
  constructor(private commService: CommService) { }
  GettAllDocuments(value: any) {

    var obs = this.commService.GettAllDocuments(value)
    var obs2 = obs.pipe(
      map(response => [this.responseSubjects[response.ResponseType], response])
    )

    obs2.subscribe(
      ([responseSubject, response]) =>{
        
        responseSubject.next(response)
      } ,
      error => {
        
        this.onError().next(error)
      }

    )

  }

  onDocumentShareResponse() {
    throw new Error('Method not implemented.');
  }
  onError(): Subject<any> {
    return this.errorSubject
  }
  onDocumentResponse(): Subject<any> {
    return this.responseSubjects.DocumentResponse;
  }
  onDocumentResponseEmpty(): Subject<any> {
    return this.responseSubjects.DocumentResponseEmpty;
  }
 
}
