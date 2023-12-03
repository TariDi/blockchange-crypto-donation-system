

interface AbiItem {
    constant?: boolean;
    inputs?: any[];
    name?: string;
    outputs?: any[];
    payable?: boolean;
    stateMutability?: string;
    type?: string;
  }

export type {
  AbiItem
}