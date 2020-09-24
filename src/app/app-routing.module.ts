import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyDocumentsComponent } from './components/my-documents/my-documents.component';
import { NewdocumentComponent } from './components/new-document/newdocument.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from "./components/register/register.component";
import { EditDocComponent } from "./components/edit-doc/edit-doc.component";
const routes: Routes = [
  { path: 'my-document-component', component: MyDocumentsComponent ,canActivate: [AuthGuard] },
  { path: 'newdocument-component', component: NewdocumentComponent ,canActivate: [AuthGuard] }, 
   { path: 'login-component', component: LoginComponent  },  
    { path: 'register-component', component: RegisterComponent  },
    { path: 'edit-doc', component: EditDocComponent  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
