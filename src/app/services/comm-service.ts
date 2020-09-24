import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentRequest } from '../models/DocumentRequest';
import { MarkerRequestAdd, RequestGetMarkers } from "../models/MarkerRequest";
import { MarkerDTO, MarkerResponse } from "../models/Marker";
import { Guid } from 'guid-typescript';
@Injectable({
  providedIn: 'root'
})
export class CommService {

  constructor(private http: HttpClient) { }

  Register(value: any): Observable<any> {
    console.log(value)
    return this.http.post('api/RegisterUser/RegisterUser', value)
  }
  Login(value: any): Observable<any> {
    console.log(value)
  
    return this.http.post('api/RegisterUser/Login', value)
  }
  //documents----------
  GettAllDocuments(id: string): Observable<any> {
    return this.http.get('api/Document/GetDocumentsForUser?UserID=' + id)
  }
  UploaNewDocument(doc: DocumentRequest): Observable<any> {
    return this.http.post('api/Document/AddDocument', doc)
  }
  //**-------------------- */
  AddMarker(request: MarkerRequestAdd): Observable<any> {
      //  var ob= {"MarkerRequestAdd":{"MarkerDTO":[{"DocID":request.MarkerDTO.DocID},{"MarkerType":request.MarkerDTO.MarkerType},{"userId":request.MarkerDTO.userId},{"radiusX":request.MarkerDTO.RadiusX},{"radiusY":request.MarkerDTO.RadiusY},{"centerX":request.MarkerDTO.centerX},{"centerY":request.MarkerDTO.centerY},{"BackColor":request.MarkerDTO.backColor},{"ForeColor":request.MarkerDTO.foreColor}]}}

debugger
    return this.http.post('api/Markers/AddMarker',request)
  }
  ///*------markers
  getAllMarkers(req:RequestGetMarkers): Observable<MarkerResponse> {

    return this.http.post<MarkerResponse>('api/Markers/GetMarkers', req)
  }
}
