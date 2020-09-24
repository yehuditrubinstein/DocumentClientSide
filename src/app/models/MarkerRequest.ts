import { Guid } from 'guid-typescript';
import { MarkerDTO } from '../models/Marker'
export class MarkerRequestAdd {
    MarkerDTO: MarkerDTO;
}
export class RequestGetMarkers {
    DocID: Guid;
}