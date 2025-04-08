import { OakTree } from "../../src";

export const OAK_ROOT = '/root';
export const OAK_TRUNK = '/trunk';
export const OAK_BRANCHES = {
  branch1: '/branch1',
  branch2: '/branch2/:id'
};

export const OAKTREE = new OakTree(OAK_ROOT, OAK_TRUNK, OAK_BRANCHES);
