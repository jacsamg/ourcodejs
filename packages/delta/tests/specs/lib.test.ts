import { expect } from 'chai';
import { createRouter } from '../../src/lib';
import {ERROR_MSG} from '../../src/data';
import { BASIC_ROUTE, PARAM_ROUTE } from '../utils/data';

describe('lib', () => {
  describe('DeltaRouter', () => {
    it('Should add and return route', () => {
      const router = createRouter(BASIC_ROUTE);
      expect(router.getRoute('GET', '/a/b/c')).to.not.be.null;
    });

    it('Should return null when method is not found', () => {
      const router = createRouter(BASIC_ROUTE);
      expect(router.getRoute('POST', '/a/b/c')).to.be.null;
    });

    it('Should return null when route is not found', () => {
      const router = createRouter(BASIC_ROUTE);
      expect(router.getRoute('GET', '/a/b/d')).to.be.null;
    });

    it('Should resolve route with path parameter and return handler', () => {
      const router = createRouter(PARAM_ROUTE);
      expect(router.getRoute('GET', '/a/this-is-a-param/c')).to.not.be.null;
    });

    it('Should ignore query string when matching and resolve route', () => {
      const router = createRouter(BASIC_ROUTE);
      expect(router.getRoute('GET', '/a/b/c?foo=bar')).to.not.be.null;
    });

    it('Should work with nested routes', () => {
      const router01 = createRouter({ method: 'GET', path: '/c', resolver: () => { } });
      const router02 = createRouter({ method: 'GET', path: '/b', resolver: router01 });
      const router03 = createRouter({ method: 'GET', path: '/a', resolver: router02 });

      expect(router03.getRoute('GET', '/a/b/c')).to.not.be.null;
    });

    it('Should throw an error when nested router path is duplicated', () => {
      const router01 = createRouter({ method: 'GET', path: '/b', resolver: () => { } });
      const router02 = () => createRouter(
        { method: 'GET', path: '/a', resolver: router01 },
        { method: 'GET', path: '/a', resolver: router01 }
      );

      expect(router02).to.throw(ERROR_MSG.ROUTER_EXISTS);
    });

    it('Should throw an error when assigning a handler to an existing route twice', () => {
      const handler = () => { };
      const _createRouter = () => createRouter(
        { method: 'GET', path: '/a', resolver: handler },
        { method: 'GET', path: '/a', resolver: handler }
      );

      expect(_createRouter).to.throw(ERROR_MSG.HANDLER_EXISTS);
    });

    it('Should throw INVALID_ROUTE when resolver is neither handler nor DeltaRouter', () => {
      // Cast to any to bypass type checks intentionally for this negative test
      const badSetup: any = { path: '/a', resolver: { /* invalid resolver */ } };
      const create = () => createRouter(badSetup);
      expect(create).to.throw(ERROR_MSG.INVALID_ROUTE);
    });
  });
});
