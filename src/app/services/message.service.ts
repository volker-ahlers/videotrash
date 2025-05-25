import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { HandleErrorService } from './handle-error.service';
import { IMessage, IGate, IStream, IStreams, Message, ITimeslot, objectsList } from '../more/types';
import { CopyObject, converNumbersFromTextToConcattedInteger } from '../more/helper';
import { SnackBarService } from './snack-bar.service';
import { firstValueFrom, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlarmStates } from '../more/enums';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private snackBarService: SnackBarService = inject(SnackBarService);
  private error: HandleErrorService = inject(HandleErrorService);
  private httpClient: HttpClient = inject(HttpClient);

  objectLabels: string[] = [];

  getLabels(): string[] {
    return this.objectLabels;
  }
  // show debug messages
  debug: boolean = false;


  /**
  * streams with gates and video urls
  * used to set the tabs and gates which later contain the messages
  */
  streams = signal<IStream[]>([]);//getset streams

  setStreamSig(streams: IStream[]) {
    this.streams.set(streams);
  }

  getStreamsSig(): Signal<IStream[]> {
    return computed(this.streams);
  }


  /**
  * by gatename assoziated array containing associated messages.
  * central array which is updated by the message service.
  */
  messagesGroupedByGate = signal<any>({});

  getMessagesGroupedByGate(): Signal<any> {
    this.debug && console.log(this.messagesGroupedByGate());
    return computed(this.messagesGroupedByGate);
  }

  /**
  * set (to signal), transform central gatearray get selected messages updated.
  * @param value gates:any The changed array of all gates
  * @param value prepareByStep: boolean weather update by step or by message
  * */
  setMessagesGroupedByGate(gates: any, prepareByStep: boolean = false) {
    this.messagesGroupedByGate.set(gates);
    this.convertAssociativeToArrayForCockpit(gates);
    if (prepareByStep)
      this.prepareMessagesByStep();
    else
      this.prepareMessages();
    this.debug && console.log(this.messagesGroupedByGate());
  }


  /**
  * object array with by gatename assoziated messages, iterable.
  * Used in Cockpit to display messages by gate.
  */
  messagesArrayForCockpit = signal<IGate[]>([]);

  addMessagesToArrayForCockpit(gate: IGate) {
    this.messagesArrayForCockpit.update(value => [...value, gate]);
    this.debug && console.log(this.messagesArrayForCockpit());
  }

  getMessagesFromArrayForCockpit(): Signal<IGate[]> {
    this.debug && console.log(this.messagesArrayForCockpit());
    return computed(this.messagesArrayForCockpit);
  }

  setMessagesArrayForCockpit(gates: IGate[]) {
    this.messagesArrayForCockpit.set(gates);
  }


  /**
  * selected step (postition) in array of messages in gateview.
  */
  objectStepSig = signal<number>(-1); //get selected object by step

  getObjectStepSig(): Signal<number> {
    return computed(this.objectStepSig);
  }

  setObjectStepSig(step: number) {
    this.objectStepSig.set(step);
    this.prepareMessagesByStep();
  }

  setObjectStepSignal(step: number) {
    console.log("setObjectStepSignal", step);
    this.objectStepSig.set(step);
  }

  updateObjectStepSig(step: number) {
    this.objectStepSig.update(value => value + step);
    this.prepareMessagesByStep();
  }


  /**
  * selected gatesname.
  */
  sensorLabel = signal<string>("");

  setSensorLabelSig(label: string) {
    this.sensorLabel.set(label);
  }

  getSensorLabelSig() {
    return computed(this.sensorLabel);
  }


  /**
  * selected single message (normally selected by it's key).
  */
  selectedMessage = signal<IMessage | null>(null);

  getSelectedMessageSig() {
    return computed(this.selectedMessage);
  }

  setSelectedMessage(msg: IMessage | null) {
    this.selectedMessage.set(msg);
  }

  /**
  * all messages of a selected gate.
  */
  messagesPerGate = signal<IMessage[]>([]);

  getMessagesPerGateSig() {
    return computed(this.messagesPerGate);
  }

  setMessagesPerGateSig(msgs: IMessage[]) {
    this.messagesPerGate.set(msgs);
  }

  /**
  * http request to get streams from docker-config.
  * if there is no response get dummi streams.
  * @returns streams with gates and video urls
  */
  async getStreamsFromDocker(): Promise<any> {
    let response: any = {};
    try {
      response = await firstValueFrom(this.httpClient.get<any>(environment.docker_rest_service_url));
    } catch {
      // TODO Dummidata 
      if (!environment.production) {
        response = await this.getDummiStreams();
      }
      catchError(this.error.handleError('GetStreamsFromDocker', undefined))
    } finally {
      this.prepareGatesAndMessages(response);
    }
    return response;
  }

  /**
   * Sort streams by extracted number of the gatesname.
   * @param value Streams from response
   */
  sortStreams(streams: IStream[]) {

    streams.forEach((s: IStream) => {
      s.sortNr = converNumbersFromTextToConcattedInteger(s.name);
    });
    streams.sort((a: any, b: any) => a.sortNr < b.sortNr ? -1 : a.sortNr > b.sortNr ? 1 : 0);
    this.setStreamSig(streams);
    this.debug && console.log(streams);
  }

  /**
   * Call sort streams and call assoziated messages.
   * @param value Streams from response
   */
  prepareGatesAndMessages(response: IStreams) {
    this.sortStreams(response.streams); // gates
    this.getMessagesFromStorage(); // stored messages
    this.debug && console.log("response", response);
  }

  /**
   * http request to get messages either from database 
   * or from localstorage if theres no response.
  */
  async getMessagesFromStorage(): Promise<void> {
    try {
      // this.restoreMessagesFromLocalStorage(); return;
      const response: Promise<IMessage[]> = await firstValueFrom(this.httpClient.get<any>(environment.docker_message_storage_url));
      this.convertToAssociativeObject(response);
      this.debug && console.log(response);
    } catch {
      this.getMessagesFromLocalStorage();
      catchError(this.error.handleError('restoreMessagesFromStorage', undefined));
    }
  }

  /**
  * get messagesfrom localstorage.
  */
  getMessagesFromLocalStorage(): void {
    let sessString = localStorage.getItem('gates') ?? '{}', gates, e;
    try {
      gates = JSON.parse(sessString);
      this.debug && console.log("local", gates);
      this.setMessagesGroupedByGate(gates);
    } catch (ex: unknown) {
      e = ex instanceof Error ? ex.message : ex;
      console.error(e, sessString);
    }
  }

  /**
  * save central messages array in localstorage.
  */
  saveMessagesToStorage(): void {
    this.debug && console.log("saveMessagesToStorage", this.messagesGroupedByGate());
    localStorage.setItem('gates', JSON.stringify(this.messagesGroupedByGate()));
  }

  /**
  * update arrays of selected messages by actual sensorLabel and/or step .
  * select message by the selected index
  */
  prepareMessagesByStep() {
    const msgs = this.messagesGroupedByGate()[this.sensorLabel()]?.filter((msg: { state: string; }) => msg.state === AlarmStates.Active);
    const step = this.objectStepSig();
    this.debug && console.log(`prepareMessagesByStep with step ${step} label ${this.sensorLabel()} in messages`, msgs);

    try {
      if (step > -1) {
        this.setSelectedMessage(msgs[step]);// msgs.filterbymessageId
      } else {
        this.setSelectedMessage(null);
      }
      this.setMessagesPerGateSig(msgs);
    } catch {
      console.log(`error on prepareMessagesByStep with step ${step} label ${this.sensorLabel()} in messages ${msgs}`);
    }
  }

  /**
  * update arrays of selected messages by actual sensorLabel and/or message .
  * set the index of the selected message by message_id
  */
  prepareMessages() {

    /*
    check if gate is existing    
    */
    if (!this.checkIfStreamExists(this.sensorLabel())) return; // maybe doublechecked

    const msgs = this.messagesGroupedByGate()[this.sensorLabel()]?.filter((msg: { state: string; }) => msg.state === AlarmStates.Active);
    this.debug && console.log(msgs, this.sensorLabel(), this.messagesGroupedByGate());
    const msg_id = this.selectedMessage() ? this.selectedMessage()?.message_id : null;
    this.debug && console.log(`prepareMessages with messageID ${msg_id} label ${this.sensorLabel()} in messages`, msgs);
    try {
      if (msgs)
        this.setMessagesPerGateSig(msgs);
      if (msg_id)
        this.setObjectStepSignal(msgs.map(function (obj: any) { return obj.message_id; }).indexOf(msg_id));
    } catch {
      console.log(`error on prepareMessages with messageID ${msg_id} label ${this.sensorLabel()} in messages ${msgs}`);
    }
  }

  /**
  * get number of active messages from selected gate.
  * @param value The name of the chosen gate
  */
  getActiveMessagesCnt(gate: string, component?: string): number {
    this.debug && console.log("getActiveMessagesCnt", component, this.messagesGroupedByGate());
    try {
      return this.messagesGroupedByGate()[gate]?.filter((msg: { state: string; }) => msg.state === AlarmStates.Active).length;
    } catch (e: unknown) {
      console.error(e);
      return 0;
    }
  }

  /**
  * add incoming message to central gatearray and inform the user.
  * @param value The chosen message
  */
  addMessageToGates(message: IMessage) {
    this.debug && console.log("addMessageToGates", this.messagesGroupedByGate());

    if (!this.checkIfStreamExists(message.sensor_label)) return;

    let gatesObj = CopyObject(this.messagesGroupedByGate());

    if (!gatesObj[message.sensor_label.toString()])
      gatesObj[message.sensor_label.toString()] = [];
    gatesObj[message.sensor_label.toString()].push(message);
    gatesObj[message.sensor_label.toString()].sort((a: any, b: any) => a.timestamp > b.timestamp ? -1 : a.timestamp > b.timestamp ? 0 : 1);

    this.setMessagesGroupedByGate(gatesObj);
    this.snackBarService.snackBarInfo("Incoming Message at " + message.sensor_label);
    this.debug && console.log("addMessageToGatestmp", gatesObj)
  }

  /**
  * mark in gate selected messages as cleared and set a category in the array and messages-table.
  * @param value The name of the chosen gate
  * @param value The id of the chosen message
  * @param value Chosen category
  */
  markMessageFromGate(gate: string, message_id: string, category: string) {
    const gates = CopyObject(this.messagesGroupedByGate());
    if (gates[gate]) {
      for (let msg of gates[gate]) {
        if (msg.message_id === message_id) {
          msg.state = AlarmStates.Cleared;
          msg.category = category;
        }
      }
      this.snackBarService.snackBarSuccess("Message marked as cleared from Gate " + gate);
      this.setMessagesGroupedByGate(gates, true);
    } else {
      console.log("messages not found on " + gate);
    }
  }

  /**
  * empty central array of gates and localstore.
  */
  clearMessages() {
    this.setMessagesGroupedByGate({});
    this.setMessagesPerGateSig([]);
    this.setObjectStepSignal(-1);
    this.setSelectedMessage(null);
    this.saveMessagesToStorage();
  }

  /**
  * test if gate from message is active
  */
  checkIfStreamExists(gate: string): boolean {
    const stream = this.streams()?.filter((stream: { name: string; }) => stream.name === gate);
    this.debug && console.log(stream, stream.length);
    if (stream.length === 0) {
      if (gate !== "")
        this.snackBarService.snackBarFail(`Message for Gate ${gate} not added, gate not found`);
      return false;
    }
    return true;
  }
  /**
   * converts incoming flat messageslist into an assoziated array.
   * updates the messagesGroupedByGate signal
   */
  convertToAssociativeObject(obj: any) {

    let messagesTMP: any = {};
    obj.forEach((msg: IMessage) => {
      // todo test me with getMessagesFromStorage !!
      if (!this.checkIfStreamExists(msg.sensor_label)) return;
      if (!messagesTMP[msg.sensor_label]) {
        messagesTMP[msg.sensor_label] = [];
        this.debug && console.log(msg.sensor_label);
      }
      if (msg.state === "") {
        msg.state = AlarmStates.Active;
      }
      messagesTMP[msg.sensor_label].push(msg)
    });
    this.debug && console.log("convertJsonToAssociativeObject", messagesTMP);
    this.setMessagesGroupedByGate(messagesTMP);
  }

  /**
  * convert incoming transformed copy of central gatearray, make it iterable for Cockpit 
  * and add the extracted number of the gatesname as sortnumber and sort it by this number.
  * @param value Transformed copy of central gatearray
  */
  convertAssociativeToArrayForCockpit(gatesObj: any) {
    let messagesArray: any = [];

    for (let msg in gatesObj) {
      this.debug && console.log("msg", msg, "gatesObj", gatesObj[msg]);
      if (!this.checkIfStreamExists(msg)) continue;
      messagesArray.push(
        {
          name: msg,
          sortNr: converNumbersFromTextToConcattedInteger(msg),
          messages: gatesObj[msg]
        }
      )
    }
    messagesArray.sort((a: any, b: any) => a.sortNr < b.sortNr ? -1 : a.sortNr > b.sortNr ? 1 : 0);
    this.setMessagesArrayForCockpit(messagesArray);
    this.debug && console.log("convertMessagesStructure", messagesArray);
  }

  /**
   * http request to update state and category of selected message in table.
   * @param value gate/streamname
   * @param value message_id
   * @param value category
   */
  async messageHandleService(gate: string, message_id: string, category: string): Promise<void> {
    try {
      const http: any = await firstValueFrom(this.httpClient.post<any>(`${environment.docker_message_update_url}/${category}/${message_id}`, {}));
      //just marc on success
      this.markMessageFromGate(gate, message_id, category);
      this.debug && console.log(http);
    } catch {
      catchError(this.error.handleError('upsertMessagesFromStorage', undefined));
      if (!environment.production) {
        //testcases
        this.markMessageFromGate(gate, message_id, category);
      }
    }
  }

  /**
   * http request to update state and category of selected message in table.
   * @param value timeslot
   */
  async setTimeslot(timeslot: ITimeslot) {
    try {
      const http: any = await firstValueFrom(this.httpClient.post<any>(`${environment.docker_message_timeslot_url}`, timeslot));
      this.snackBarService.snackBarSuccess("Timeslot sent");
      this.debug && console.log(timeslot, http);
    } catch {
      this.snackBarService.snackBarFail("Timeslot not sent");
      catchError(this.error.handleError('setTimeslot', undefined));
    }
  }

  /**
 * http request to get object labels from docker-config.
 */
  async getObjectLabels() {
    try {
      this.objectLabels = await firstValueFrom(this.httpClient.get<string[]>(`${environment.docker_message_labels_url}`));
      this.debug && console.log("this.objectLabels", this.objectLabels);
    } catch {
      this.objectLabels = objectsList;
      catchError(this.error.handleError('getObjectLabels', undefined));
    }
  }

  /**
   * http request to get dummi stream if there is no response from docker-config
   */
  async getDummiStreams(): Promise<any> {
    try {
      return await firstValueFrom(this.httpClient.get<any>(`assets/streamslikeDocker.json`));
    } catch {
      catchError(this.error.handleError('GetDummiStreams', undefined))
    }
  }
}
