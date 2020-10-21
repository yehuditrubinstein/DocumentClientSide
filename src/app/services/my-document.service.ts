import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { CommService } from './comm-service';
import { map, subscribeOn } from "rxjs/operators";
import { DocumentDTO, DocumentRequestGetForUser, DocumentRequestRemove } from '../models/DocumentRequest';
import { Guid } from 'guid-typescript';
import { DocumentSharingRequest } from '../models/Sharing';
@Injectable({
  providedIn: 'root'
})
export class MyDocumentService {


  selectedDoc: DocumentDTO;
  responseSubjects = {
    DocumentResponseRemoveOK: new Subject<any>(),
    DocumentResponseDontRemove: new Subject<any>(),
    DocumentResponse: new Subject<any>(),
    DocumentResponseEmpty: new Subject<any>(),
    DocumentSharingResponseRemoveOK: new Subject<any>(),
    DocumentSharingResponseDontRemove: new Subject<any>(),
  }
  errorSubject = new Subject<any>()
  constructor(private commService: CommService) { }
  GettAllDocuments(userid: string) {
   var req=new DocumentRequestGetForUser()
   req.UserID=userid
    var obs = this.commService.GettAllDocuments(req)
    var obs2 = obs.pipe(
      map(response => [this.responseSubjects[response.ResponseType], response]))

    obs2.subscribe(
      ([responseSubject, response]) => {

        responseSubject.next(response)
      },
      error => {

        this.onError().next(error)
      }

    )

  }
  removeDoc(req: DocumentRequestRemove) {
    var obs = this.commService.removeDoc(req)
    var obs2 = obs.pipe(map(response => [this.responseSubjects[response.ResponseType], response]))
    obs2.subscribe(([subject,response])=>subject.next(response),error=>console.log(error))
  }
  removeShareDoc(req: DocumentSharingRequest) {
    debugger
    var obs=this.commService.RemoveSharing(req)
    var obs2 = obs.pipe(map(response => [this.responseSubjects[response.ResponseType], response]))
    obs2.subscribe(([subject,response])=>subject.next(response),error=>console.log(error))
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
  onDocumentResponseRemoveOK(): Subject<any> {
    return this.responseSubjects.DocumentResponseRemoveOK;
  }
  onDocumentResponseDontRemove(): Subject<any> {
    return this.responseSubjects.DocumentResponseDontRemove;
  }
  onDocumentSharingResponseDontRemove(): Subject<any> {
    return this.responseSubjects.DocumentSharingResponseDontRemove;
  }onDocumentSharingResponseRemoveOK(): Subject<any> {
    return this.responseSubjects.DocumentSharingResponseRemoveOK;
  }
}
