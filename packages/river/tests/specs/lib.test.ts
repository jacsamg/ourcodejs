import { expect } from 'chai';
import sinon from 'sinon';
import { createMockReq, createMockRes } from '../utils/event-mock';
import { timeout } from '../utils/timer';
import { RiverEvent } from '../../src/types';
import {
  createEndpoint,
  createErrorHandler,
  createHandler,
  createMiddleware
} from '../../src/lib';

describe('lib', () => {
  describe('createEndpoint', () => {
    const params = new Map();

    it('Should call handler when no middleware are present', async () => {
      const store = new Map();
      const handler = createHandler((e: RiverEvent) => { e.store.set('test', true); });
      const endpoint = createEndpoint({ handler });

      await endpoint(createMockReq(), createMockRes(), params, store);
      expect(store.get('test')).to.be.true;
    });

    it('Should run sync/async middleware/handler in order', async () => {
      const store = new Map();
      const middleware01 = createMiddleware(async (e: RiverEvent) => {
        e.store.set('test', [1]);
        return true;
      });
      const middleware02 = createMiddleware(async (e: RiverEvent) => {
        const test = <[] | undefined>e.store.get('test');
        if (test) e.store.set('test', [...test, 2]);
        await timeout();
        return true;
      });
      const middleware03 = createMiddleware((e: RiverEvent) => {
        const test = <[] | undefined>e.store.get('test');
        if (test) e.store.set('test', [...test, 3]);
        return true;
      });
      const handler = createHandler(async (e: RiverEvent) => {
        const test = <[] | undefined>e.store.get('test');
        await timeout();
        if (test) e.store.set('test', [...test, 4]);
      });
      const endpoint = createEndpoint({
        handler,
        middlewares: [middleware01, middleware02, middleware03]
      });

      await endpoint(createMockReq(), createMockRes(), params, store);
      expect(store.get('test')).to.deep.equal([1, 2, 3, 4]);
    });

    it('Should call custom error logger when error is thrown', async () => {
      const handler = createHandler((e: RiverEvent) => {
        throw new Error("Test error");
      });
      let changeOnError = false;
      const endpoint = createEndpoint({
        handler,
        errorLogger: () => {
          changeOnError = true;
        }
      });

      await endpoint(createMockReq(), createMockRes(), params, new Map());
      expect(changeOnError).to.be.true;
    });

    it('Should call default error handler when error is thrown', async () => {
      const response = createMockRes();
      const setHeaderSpy = sinon.spy(response, 'setHeader');
      const endSpy = sinon.spy(response, 'end');
      const handler = createHandler((e: RiverEvent) => {
        throw new Error("Test error");
      });
      const endpoint = createEndpoint({
        handler,
        errorLogger: () => void 0
      });

      await endpoint(createMockReq(), response, params, new Map());

      expect(response.statusCode).to.equal(500);
      sinon.assert.calledWith(setHeaderSpy, 'Content-Type', 'text/plain');
      sinon.assert.calledWith(endSpy, 'Internal server error');
    });

    it('Should call custom error handler when error is thrown', async () => {
      const store = new Map();
      const handler = createHandler((e: RiverEvent) => {
        throw new Error("Test error");
      });
      const errorHandler = createErrorHandler((e: RiverEvent, error: Error) => {
        e.store.set('error', true);
      });
      const endpoint = createEndpoint({
        handler, errorHandler,
        errorLogger: () => void 0
      });

      await endpoint(createMockReq(), createMockRes(), params, store);
      expect(store.get('error')).to.be.true;
    });

    it('Should not write headers/body if headers already sent', async () => {
      const req = createMockReq();
      const res = createMockRes();
      // Simulate headers already sent by writing head and some data
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write('partial');

      const setHeaderSpy = sinon.spy(res, 'setHeader');

      const handler = createHandler((e: RiverEvent) => {
        throw new Error('Test error after headers');
      });
      const endpoint = createEndpoint({
        handler,
        errorLogger: () => void 0
      });

      await endpoint(req, res, params, new Map());

      // headers were already sent, defaultErrorHandler should not set headers
      sinon.assert.notCalled(setHeaderSpy);
      // response should end gracefully
      expect(res.writableEnded).to.be.true;
    });

    it('Should not call error handler if response already ended', async () => {
      const req = createMockReq();
      const res = createMockRes();
      // end response before the error occurs
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('done');

      const spy = sinon.spy();

      const handler = createHandler((e: RiverEvent) => {
        throw new Error('Late error');
      });
      const errorHandler = createErrorHandler((_e: RiverEvent, _err: Error) => {
        spy();
      });

      const endpoint = createEndpoint({
        handler,
        errorHandler,
        errorLogger: () => void 0
      });

      await endpoint(req, res, params, new Map());
      sinon.assert.notCalled(spy);
    });
  });
});
