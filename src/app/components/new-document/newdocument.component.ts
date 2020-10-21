import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { error } from '@angular/compiler/src/util';
import { AuthService } from 'src/app/services/auth.service';
import { NewDocumentService } from "../../services/new-document.service";
import { DocumentDTO, DocumentRequest } from "../../models/DocumentRequest";
import { Router } from '@angular/router';
@Component({
  selector: 'app-newdocument',
  templateUrl: './newdocument.component.html',
  styleUrls: ['./newdocument.component.css']
})
export class NewdocumentComponent implements OnInit {
  DocForm: FormGroup
  constructor(private authservice: AuthService, private newdocservice: NewDocumentService, private router: Router) { }

  ngOnInit(): void {
    this.DocForm = new FormGroup(
      {
        DocName: new FormControl(''),
        ImageUrl: new FormControl('', [Validators.required])
      })
    this.newdocservice.onDocumenrResponseUploadOK().subscribe(response => this.router.navigate(['/my-document-component']))
    this.newdocservice.onError().subscribe(message => console.log(message))
  }
  onSubmit() {
    console.log(this.DocForm.value)
    let request = new DocumentRequest()
    request.documentDTO = new DocumentDTO();
    request.documentDTO.DocName = this.DocForm.value.DocName;
    request.documentDTO.ImageURL = this.DocForm.value.ImageUrl;
    request.documentDTO.UserID = this.authservice.getUser()
    this.newdocservice.UploaNewDocument(request)
  }
  upload(files: File[]) {
    debugger
    let request = new DocumentRequest()
    request.documentDTO = new DocumentDTO();
    request.documentDTO.DocName = this.DocForm.value.DocName;
    request.documentDTO.ImageURL = this.DocForm.value.ImageUrl;
    request.documentDTO.UserID = this.authservice.getUser()
    this.newdocservice.UploadFile(files, this.DocForm.value.DocName,request);
  }

}