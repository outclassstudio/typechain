import * as CryptoJS from "crypto-js";

class Block {
  static calculateBlockHash = (
    index: number,
    previousHash: string,
    timestamp: number,
    data: string
  ): string =>
    CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

  static validateStructure = (aBlock: Block): boolean =>
    typeof aBlock.index === "number" &&
    typeof aBlock.hash === "string" &&
    typeof aBlock.previousHash === "string" &&
    typeof aBlock.timestamp === "number" &&
    typeof aBlock.data === "string";

  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;

  constructor(
    index: number,
    hash: string,
    previousHash: string,
    data: string,
    timestamp: number
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}

const genesisBlock: Block = new Block(0, "202220222022", "", "hello", 123456);

let blockchain: Block[] = [genesisBlock];

// console.log(blockchain);

const getBlockchain = (): Block[] => blockchain;

const getLastesBlock = (): Block => blockchain[blockchain.length - 1];

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
  const previousBlock: Block = getLastesBlock();
  const newIndex: number = previousBlock.index + 1;
  const nextTimestamp: number = getNewTimeStamp();
  const nextHash: string = Block.calculateBlockHash(
    newIndex,
    previousBlock.hash,
    nextTimestamp,
    data
  );
  const newBlock: Block = new Block(
    newIndex,
    nextHash,
    previousBlock.hash,
    data,
    nextTimestamp
  );
  addBlock(newBlock);
  return newBlock;
};

// console.log(createNewBlock("hello"), createNewBlock("byebye"));

const getHashforBlock = (aBlock: Block): string =>
  Block.calculateBlockHash(
    aBlock.index,
    aBlock.previousHash,
    aBlock.timestamp,
    aBlock.data
  );

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
  if (!Block.validateStructure(candidateBlock)) return false;
  else if (previousBlock.index + 1 !== candidateBlock.index) return false;
  else if (previousBlock.hash !== candidateBlock.previousHash) return false;
  else if (getHashforBlock(candidateBlock) !== candidateBlock.hash)
    return false;
  else return true;
};

const addBlock = (candidateBlock: Block): void => {
  if (isBlockValid(candidateBlock, getLastesBlock())) {
    blockchain.push(candidateBlock);
  }
};

createNewBlock("secondBlock");
createNewBlock("thirdBlock");
createNewBlock("fourthBlock");

console.log(blockchain);

export {};
