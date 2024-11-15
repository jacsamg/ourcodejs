import { expect } from 'chai';
import { DeltaRouter } from '../../src/lib';
import { BASIC_ROUTE, PARAM_ROUTE } from '../utils/data';

describe('lib', () => {
  describe('DeltaRouter', () => {
    it('Should add and return route', () => {
      const router = new DeltaRouter([BASIC_ROUTE]);
      expect(router.getRoute('/a/b/c')).to.not.be.null;
    });

    it('Should return null when route is not found', () => {
      const router = new DeltaRouter([BASIC_ROUTE]);
      expect(router.getRoute('/a/b/d')).to.be.null;
    });

    it('Should add route with param and return route', () => {
      const router = new DeltaRouter([PARAM_ROUTE]);
      expect(router.getRoute('/a/this-is-a-param/c')).to.not.be.null;
    });

    it('Should work with nested routes', () => {
      const router01 = new DeltaRouter([{ path: '/c', handler: () => { } }]);
      const router02 = new DeltaRouter([{ path: '/b', handler: router01 }]);
      const router03 = new DeltaRouter([{ path: '/a', handler: router02 }]);

      expect(router03.getRoute('/a/b/c')).to.not.be.null;
    });

    it('Should throw an error when nested router path is duplicated', () => {
      const router01 = new DeltaRouter([{ path: '/b', handler: () => { } }]);
      const router02 = () => new DeltaRouter([
        { path: '/a', handler: router01 },
        { path: '/a', handler: router01 }
      ]);

      expect(router02).to.throw('Router already exists for this route!');
    });

    it('Should throw an error when assigning a handler to an existing route twice', () => {
      const handler = () => { };
      const createRouter = () => new DeltaRouter([
        { path: '/a', handler: handler },
        { path: '/a', handler: handler }
      ]);

      expect(createRouter).to.throw('Handler already exists for this route!');
    });
  });
});