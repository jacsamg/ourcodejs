import { IncomingMessage, ServerResponse } from 'node:http';
import EventEmitter from 'node:events';

export function createMockReq(): IncomingMessage {
  const req: IncomingMessage = new IncomingMessage(<any>new EventEmitter());
  req.method = 'GET';
  req.url = '/';

  return req;
}

export function createMockRes(): ServerResponse {
  const res: ServerResponse = new ServerResponse(new IncomingMessage(<any>new EventEmitter()));
  return res;
}

export function getRiverEvent() {
  return {
    req: createMockReq(),
    res: createMockRes(),
    store: new Map()
  };
}