import { Injectable } from '@angular/core';
import { CommService } from './comm-service';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {FileRequest  } from "../models/File";
@Injectable({
  providedIn: 'root'
})
export class NewDocumentService {
  responseSubjects = {
    DocumentResponseAddOK: new Subject<any>(),
  }
  errorSubject = new Subject<any>()

  constructor(private commService: CommService,private http:HttpClient) { }
  UploadFile(files: File[], FileName:string,doc) {
    debugger
    var fileRequest=new FileRequest()
    var formData = new FormData();
    Array.from(files).forEach(f => formData.append("files", f));
    formData.append(FileName,FileName);
    fileRequest.FileName=FileName;
    fileRequest.formData=formData;
    this.http
      .post("api/Document/UploadFile",formData )
      .subscribe(event => {this.UploaNewDocument(doc)}); 
  }
  UploaNewDocument(doc) {
    var obs = this.commService.UploaNewDocument(doc)
    var obs2 = obs.pipe(map(response => [this.responseSubjects[response.ResponseType], response]))
    obs2.subscribe(([responseSubjects, response]) => responseSubjects.next(response))
  }
  onDocumenrResponseUploadOK(): Subject<any> {
    return this.responseSubjects.DocumentResponseAddOK;
  }
  onError(): Subject<any> {
    return this.errorSubject;
  }
}
