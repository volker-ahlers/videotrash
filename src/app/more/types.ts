export interface IStreams {
  streams: IStream[];
  mqtt: IMqtt;
  streaming_options: any;
}

export interface IStream {
  name: string;
  user_stream_dir_raw: string;
  user_stream_dir_detection: string;
  sortNr: number;
}

export class Stream implements IStream {
  name: string = "";
  user_stream_dir_raw: string = "";
  user_stream_dir_detection: string = "";
  sortNr: number = 0;
}

export interface IGate {
  name: string;
  sortNr: number;
  messages: IMessage[];
}

export class Gate {
  name: string = "";
  sortNr: number = 0;
  messages: IMessage[] = [];
}

export interface IMqtt {
  username: string;
  password: string;
  host: string;
  topic: string;
  port: number;
}

export interface IMessage {
  message_id: string;
  sensor_id: number;
  sensor_label: string;
  mds_version: string;
  frame_id: number;
  image_path: string;
  timestamp: string;
  buf_pts: number;
  state: string;
  object: Objects;
  step: number;
  category: string;
  lpn: string;
  time?: number;
}

export class Message implements IMessage {
  message_id: string = "";
  sensor_id: number = 0;
  sensor_label: string = "";
  mds_version: string = "";
  frame_id = 0;
  image_path = "";
  timestamp: string = "";
  buf_pts: number = 0;
  state: string = "";
  object: Objects = new Objects();
  step: number = 0;
  category: string = "";
  lpn: string = "";
}

export interface IObject {
  label_id: number;
  label: string;
  confidence: number;
  bbox: Bbox
}

export class Objects implements IObject {
  label_id: number = 0;
  label: string = "";
  confidence: number = 0;
  bbox: Bbox = new Bbox()
}

export interface IBbox {
  topleftx: number,
  toplefty: number,
  bottomrightx: number,
  bottomrighty: number
}

export class Bbox implements IBbox {
  topleftx: number = 0;
  toplefty: number = 0;
  bottomrightx: number = 0;
  bottomrighty: number = 0;
}

export interface ITimeslot {
  start_frame: number,
  end_frame: number,
  object_id: string | null,
  sensor_label: string
}

export class Timeslot implements ITimeslot {
  start_frame = 0;
  end_frame = 0;
  object_id = null;
  sensor_label = "";
}

export const objectsList: string[] =
  [
    "Matratze",
    "Gummimatte (Teerpappe, Gummistreifen)",
    "Stange (Gitter)",
    "Styropor",
    "Rohr (Rolle)",
    "Blech (Metallfolie)",
    "Bänderhaufen",
    "Big Packs",
    "Federkern",
    "Klumpen (Unidentifizierbar)",
    "Reifen",
    "didn't get objectlist from config via http"
  ]