import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CommentDTO, CommentRequest, CommentRequestDelete, CommentRequestGetByDocID } from '../models/Comment';
import { AuthService } from './auth.service';
import { CommService } from './comm-service';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  responseSubjects={
    CommentResponseDontAdd: new Subject<any>(),
    CommentResponseAddOK: new Subject<any>(),
    CommentResonseRemoveOk:new Subject<any>(),
    CommentResponseDontRemove:new Subject<any>(),
  }
  errorSubject = new Subject<any>()

  constructor(private commservice:CommService,private authservice:AuthService) { }
  addComment(CommentRequest: CommentRequest) {
    var obs = this.commservice.addComment(CommentRequest)
    var obs2 = obs.pipe(tap(data=>console.log("from add comment: "+data)),map(res => [this.responseSubjects[res.ResponseType], res]))
    obs2.subscribe(([responsesubject, res]) => {responsesubject.next(res);debugger}, error => this.onError().next(error))

  }
  getComments(docID: Guid) {
    var req=new CommentRequestGetByDocID()
    req.DocID=docID
    return this.commservice.getComments(req)
    
  }
  deleteComment(item: CommentDTO) {
    var req=new CommentRequestDelete();
    req.CommentID=item.CommentID
    req.DocId=this.authservice.GetEditDoc().DocID;
    var obs= this.commservice.deleteComment(req)
    var obs2 = obs.pipe(map(res => [this.responseSubjects[res.ResponseType], res]))
    obs2.subscribe(([responsesubject, res]) => responsesubject.next(res), error => this.onError().next(error))
  
}
onCommentResponseAddOK(): Subject<any> {
  return this.responseSubjects.CommentResponseAddOK;
}
onCommentResponseDontAdd(): Subject<any> {
  return this.responseSubjects.CommentResponseDontAdd;
}
onCommentResponseRemoveOK():Subject<any>{
  return this.responseSubjects.CommentResonseRemoveOk;
}
onCommentResponseDontRemove(): Subject<any> {
  return this.responseSubjects.CommentResponseDontRemove;
}
onError(): Subject<any> {
  return this.errorSubject;
}
}
