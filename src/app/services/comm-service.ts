import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentDTO, DocumentRequest, DocumentRequestGetForUser, DocumentRequestRemove } from '../models/DocumentRequest';
import { MarkerRequestAdd, RequestGetMarkers } from "../models/MarkerRequest";
import { MarkerDTO, MarkerRequestRemove, MarkerResponse } from "../models/Marker";
import { Guid } from 'guid-typescript';
import { DocumentSharingRequest, DocumentSharingRequestGetForDoc } from '../models/Sharing';
import { CommentRequest, CommentRequestDelete, CommentRequestGetByDocID } from '../models/Comment';
import { map } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
@Injectable({
  providedIn: 'root'
})
export class CommService {
  
  _subject: WebSocketSubject<unknown>
  //  MarkerDelete_AddSubject;
  constructor(private http: HttpClient) { }
  openSocket(ShareText: string) {
    this._subject = webSocket(
      { url: "wss://localhost:44350/ws?id=" + ShareText, deserializer: msg => msg })
    var sockety$ = this._subject.pipe(
      map((response: any) => JSON.parse(response.data))
    )
    sockety$.subscribe((response:string) => {
      debugger
      console.log(response);
    })
  }
  Register(value: any): Observable<any> {
    console.log(value)
    return this.http.post('api/RegisterUser/RegisterUser', value)
  }
  Login(value: any): Observable<any> {
    console.log(value)
    return this.http.post('api/RegisterUser/Login', value)
  }
  //documents----------
  GettAllDocuments(req: DocumentRequestGetForUser): Observable<any> {

    return this.http.post('api/Document/GetDocumentsForUser' ,req )
  }
  UploaNewDocument(doc: DocumentRequest): Observable<any> {
    return this.http.post('api/Document/AddDocument', doc)
  }
  removeDoc(req: DocumentRequestRemove):Observable<any> {
    return this.http.post('api/Document/RemoveDocument',req)
  }

  //**-------------------- */
  
  ///*------markers
  AddMarker(request: MarkerRequestAdd): Observable<any> {
    return this.http.post('api/Markers/AddMarker',request)
  }
  getAllMarkers(req:RequestGetMarkers): Observable<MarkerResponse> {

    return this.http.post<MarkerResponse>('api/Markers/GetMarkers', req)
  }
  RemoveMarker(MarkerRequest:MarkerRequestRemove):Observable<any>{
    return this.http.post('api/Markers/RemoveMarker',MarkerRequest)
  }
  //---------------------------
  //sharing*----------------
  AddSharing(req:DocumentSharingRequest):Observable<any>{
    return this.http.post('api/DocumentSharing/AddSharing',req)
  }
  GetShareForDoc(req:DocumentSharingRequestGetForDoc):Observable<any>{
    
    return this.http.post('api/DocumentSharing/GetShareForDoc',req)
  }
  RemoveSharing(req:DocumentSharingRequest):Observable<any>{
    return this.http.post('api/DocumentSharing/RemoveSharing',req)
  }
//-comment
addComment(CommentRequest: CommentRequest):Observable<any> {
  debugger
  return this.http.post('api/Comment/AddComment',CommentRequest);
}
getComments(req:CommentRequestGetByDocID):Observable<any>{
  return this.http.post( 'api/Comment/GetCommentsForDoc',req);
}
deleteComment(req:CommentRequestDelete):Observable<any>{
  return this.http.post('api/Comment/DeleteComment',req);
}
}
