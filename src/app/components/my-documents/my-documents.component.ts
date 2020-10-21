import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentDTO, DocumentRequestRemove, DocumentResponse } from 'src/app/models/DocumentRequest';
import { DocumentSharingRequest, sharingDTO } from 'src/app/models/Sharing';
import { AuthService } from 'src/app/services/auth.service';
import { MyDocumentService } from "../../services/my-document.service";
@Component({
  selector: 'app-my-documents',
  templateUrl: './my-documents.component.html',
  styleUrls: ['./my-documents.component.css']

})
export class MyDocumentsComponent implements OnInit {
  myDocs: DocumentDTO[] = [];
  myShareDocs: DocumentDTO[] = [];
  constructor(private MyDocumentService: MyDocumentService, private router: Router, private authservice: AuthService) { }
  fill() {
    this.MyDocumentService.GettAllDocuments(this.authservice.getUser());
    var fill = this.MyDocumentService.onDocumentResponse().pipe(map((res: DocumentResponse) => res.documentDTO.forEach(element => {
      element.UserID == this.authservice.getUser() ? this.myDocs.push(element) : this.myShareDocs.push(element)
    }, res)))
    fill.subscribe()
    this.MyDocumentService.onDocumentResponseEmpty().subscribe(response => {
      alert("אין לך מסמכים")
    })
    this.MyDocumentService.onError().subscribe(error => console.log("Error", error))
  }
  ngOnInit(): void {
    this.fill();
     this.MyDocumentService.onDocumentResponseRemoveOK().subscribe(response => {
      this.router.navigateByUrl('/edit-doc', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/my-document-component']);
      });
    }, err => console.log(err))
    var res = this.MyDocumentService.onDocumentSharingResponseRemoveOK().subscribe(response => {
      this.router.navigateByUrl('/edit-doc', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/my-document-component']);
      });
    }
      , err => console.log(err))
    this.MyDocumentService.onDocumentResponseDontRemove().subscribe((res) => { }, (err) => { })
    this.MyDocumentService.onDocumentSharingResponseDontRemove().subscribe((res) => { }, (err) => { })
    this.MyDocumentService.onError().subscribe(()=>console.log("error in my documet"+res))
  }
  OpenAddDoc() {
    this.router.navigate(['/newdocument-component'])
  }
  removefile(doc: DocumentDTO) {
    debugger
    var req = new DocumentRequestRemove()
    req.DocID = doc.DocID;
    this.MyDocumentService.removeDoc(req)
  }
  removeShareFile(doc: DocumentDTO) {
    var req = new DocumentSharingRequest()
    req.SharingDTO = new sharingDTO()
    req.SharingDTO.DocID = doc.DocID;
    req.SharingDTO.UserId = this.authservice.getUser();
    this.MyDocumentService.removeShareDoc(req)
  }
  OpenEditDoc(item: DocumentDTO) {
    //   this.MyDocumentService.selectedDoc=item;
    this.authservice.SetEditDoc(item);
    this.router.navigate(['/edit-doc']);
  }

}
