import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import{ReactiveFormsModule}from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MyDocumentsComponent } from './components/my-documents/my-documents.component';
import {  NewdocumentComponent} from './components/new-document/newdocument.component';
import {HttpClientModule} from '@angular/common/http';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { RegisterComponent } from './components/register/register.component';
import { EditDocComponent } from './components/edit-doc/edit-doc.component';
import { MyDocumentService } from './services/my-document.service';
import { CommentComponent } from './components/comment/comment.component';
import { SharingsComponent } from './components/sharings/sharings.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MyDocumentsComponent,
    NewdocumentComponent,
    TopMenuComponent,
    RegisterComponent,
    EditDocComponent,
    CommentComponent,
    SharingsComponent  ],
  imports: [
    BrowserModule,
    AppRoutingModule,ReactiveFormsModule,HttpClientModule
  ],
  providers: [MyDocumentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
