import { Guid } from "guid-typescript";

export class DocumentSharingRequest{
 SharingDTO:sharingDTO
}
export class sharingDTO{
    DocID:Guid
    UserId:string
}
export class DocumentsharingResponse{
    DocumentSharingDTO:sharingDTO[]
}
export class DocumentSharingRequestGetForUser{
    userID:string
}
export class DocumentSharingRequestGetForDoc{
    DocID:Guid
}
export class DocumentsharingResponseAddOK implements DocumentsharingResponse{
    DocumentSharingDTO: sharingDTO[];

}