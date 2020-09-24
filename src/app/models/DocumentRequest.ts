import { Guid } from "guid-typescript";
export class DocumentResponse{
    documentDTO:DocumentDTO[];
}
export class DocumentRequest {
    documentDTO: DocumentDTO
    // constructor(documentDTO: DocumentDTO) {
    //     this.documentDTO = documentDTO
    // }
}
export class DocumentDTO {

    UserID: string
    ImageURL: string
    DocName: string
   DocID: Guid
    // constructor(DocId: string, DocName: string, ImageURL: string, UserID: string) {
    //     this.DocId = DocId;
    //     this.DocName = DocName;
    //     this.ImageURL = ImageURL;
    //     this.UserID = UserID;
    // }
}  