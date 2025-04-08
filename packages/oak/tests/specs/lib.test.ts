import { expect } from 'chai';
import { OAKTREE, OAK_BRANCHES, OAK_ROOT, OAK_TRUNK } from '../utils/data';

describe('OakTree', () => {
  describe('constructor', () => {
    it('should initialize with the correct properties', () => {
      expect(OAKTREE.root).to.equal(OAK_ROOT);
      expect(OAKTREE.trunk).to.equal(OAK_TRUNK);
      expect(OAKTREE.branches).to.deep.equal(OAK_BRANCHES);
    });
  });

  describe('getFullPath', () => {
    it('should return the full path for a given branch', () => {
      const fullPath = OAKTREE.getFullPath(OAKTREE.branches.branch1);
      expect(fullPath).to.equal('/root/trunk/branch1');
    });
  });

  describe('getFullPathWithArgs', () => {
    it('should replace placeholders with arguments in the path', () => {
      const fullPath = OAKTREE.getFullPathWithArgs(OAKTREE.branches.branch2, '123');
      expect(fullPath).to.equal('/root/trunk/branch2/123');
    });
  });

  describe('getRouterPath', () => {
    it('should return the router path without the leading slash', () => {
      const routerPath = OAKTREE.getRouterPath(OAKTREE.branches.branch1);
      expect(routerPath).to.equal('root/trunk/branch1');
    });
  });
});
