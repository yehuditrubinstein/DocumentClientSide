import { Guid } from "guid-typescript";

export class CommentDTO {
    isOfMarker: boolean
    CommentID: Guid
    UserId: string
    MarkerID: Guid
    Content: string
    CommentDate: Date
}
export class CommentRequestDelete{
    CommentID:Guid
    DocId:Guid
    
}
export class CommentRequestGetByDocID{
    DocID:Guid
}
export class CommentRequest {
    CommentDTO: CommentDTO
}
export class CommentResponse {
    comments: CommentDTO[]

}
