import { Shape } from './Shape'
import { Guid } from "guid-typescript";

// export class MarkerDTO implements Shape {
//       centerX: number
//       docID: Guid
//       markerType: string
//       userId: string
//       radiusX: number
//       radiusY: number
//       centerY: number
//       backColor: string
//       foreColor: string
//       constructor(cx: number, cy: number, radiusx: number, radiusy: number, foreColor: string, backColor: string, DocID: Guid, UserID: string, markerType: string) {
//             this.centerX = cx;
//             this.centerY = cy;
//             this.radiusX = radiusx;
//             this.radiusY = radiusy;
//             this.foreColor = foreColor;
//             this.backColor = backColor;
//             this.docID = DocID;
//             this.userId = UserID
//             this.markerType = markerType

//       }
// }
export class MarkerDTO implements Shape {
      MarkerID:Guid;
      CenterX: number
      DocID: Guid
      MarkerType: string
      userId: string
      RadiusX: number
      RadiusY: number
      CenterY: number
      BackColor: string
      ForeColor: string
      IsNew:boolean 
      constructor(cx: number, cy: number, radiusx: number, radiusy: number, foreColor: string, backColor: string, DocID: Guid, UserID: string, markerType: string) {
            this.CenterX =Math.ceil(cx);
            this.CenterY = Math.ceil(cy);
            this.RadiusX = Math.ceil(radiusx);
            this.RadiusY = Math.ceil(radiusy);
            this.ForeColor = foreColor;
            this.BackColor = backColor;
            this.DocID = DocID;
            this.userId = UserID
            this.MarkerType = markerType

      }
}
export class MarkerResponse{
      Markers:MarkerDTO[];
}
export class MarkerRequestRemove{
      MarkerId:Guid
      DocID:Guid
      UserID:String;
}