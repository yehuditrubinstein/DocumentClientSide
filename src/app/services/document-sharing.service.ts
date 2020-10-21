import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import { map } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { CommService } from './comm-service';
import { sharingDTO, DocumentSharingRequest, DocumentSharingRequestGetForDoc } from "../models/Sharing";
import { AuthService } from './auth.service';
import { Guid } from 'guid-typescript';
@Injectable({
  providedIn: 'root'
})
export class DocumentSharingService {
 
  responseSubjects = {
    DocumentSharingResponseAddOK: new Subject<any>(),
    DocumentSharingResponseDontAdd: new Subject<any>(),
    DocumentsharingResponse: new Subject<any>(),
    DcumentSharingResponseEmpty: new Subject<any>(),
    DocumentSharingResponseDontRemove: new Subject<any>(),
    DocumentSharingResponseRemoveOK: new Subject<any>()
  }
  errorSubject = new Subject<any>()
  constructor(private authservice: AuthService, private http: HttpClient, private commservice: CommService) { }

  
  addSharing(text: string) {
    if (text != '' && text != null)
      var request: DocumentSharingRequest = new DocumentSharingRequest();
    request.SharingDTO = new sharingDTO()
    request.SharingDTO.DocID = this.authservice.GetEditDoc().DocID;
    request.SharingDTO.UserId = text;
    var obs = this.commservice.AddSharing(request)
    var obs2 = obs.pipe(map((response) => [this.responseSubjects[response.ResponseType], response]))
    obs2.subscribe(([responsesubject, response]) =>{debugger; responsesubject.next(response)}, error => this.onError().next(error)
    )
  }

  GetShareForDoc(docID: Guid) {
    var req = new DocumentSharingRequestGetForDoc()
    req.DocID = docID
    var obs = this.commservice.GetShareForDoc(req);
    var obs2 = obs.pipe(map(res => [this.responseSubjects[res.ResponseType], res]))
    obs2.subscribe(([responsesubject, res]) => responsesubject.next(res), error => this.onError().next(error))
  }
  RemoveSharing(req: DocumentSharingRequest) {
    var obs = this.commservice.RemoveSharing(req)
    var obs2 = obs.pipe(map(res => [this.responseSubjects[res.ResponseType], res]))
    obs2.subscribe(([responsesubject, res]) => responsesubject.next(res), error => this.onError().next(error))
  }
  onDocumentSharingResponseAddOK(): Subject<any> {
    return this.responseSubjects.DocumentSharingResponseAddOK;
  }
  onDocumentSharingResponseDontAdd() {
    return this.responseSubjects.DocumentSharingResponseDontAdd;

  }
  onDocumentSharingResponseRemoveOK(): Subject<any> {
    return this.responseSubjects.DocumentSharingResponseRemoveOK;
  }
  onDocumentSharingResponseDontRemove(): Subject<any> {
    return this.responseSubjects.DocumentSharingResponseDontRemove;
  }
  onError(): Subject<any> {
    return this.errorSubject
  }
  onDocumentSharingResponse(): Subject<any> {
    return this.responseSubjects.DocumentsharingResponse;
  }
  onDcumentSharingResponseEmpty(): Subject<any> {
    return this.responseSubjects.DcumentSharingResponseEmpty;
  }
}
