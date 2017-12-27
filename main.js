const SHA256 = require('crypto-js/sha256');


class Block {
	constructor(index, timestamp, data, previousHash=''){
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0; // has nothing to do with block, but can be changed without losing integrity of block
	}

	calculateHash() {
		//begin hash function, using sha 256
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
		// JSON.stringify takes js object converts to JSON and saves as text
	}

	mineBlock(difficulty) { // creates level of difficulty to create new block -- make block begin with certain amount of zeros
		while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
			this.nonce++; //without this, this is an endless loop. 
			this.hash = this.calculateHash();
		}

		console.log("block mined: " + this.hash);
	}
}

class Blockchain {
	constructor(){
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 4;
	}

	createGenesisBlock(){
		return new Block(0,"01/01/2017", "Genesis Block", "0");
	}

	getLatestBlock() {
		return this.chain[this.chain.length-1];
	}

	addBlock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.mineBlock(this.difficulty);
		//newBlock.hash = newBlock.calculateHash();
		this.chain.push(newBlock);
	}

	isChainValid(){
		for(let i=1; i < this.chain.length; i++){
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i-1];

			if(currentBlock.hash !== currentBlock.calculateHash()){
				return false;
			}
			if(currentBlock.previousHash !== previousBlock.hash){
				return false;
			}
		}
		return true;
	}
}


let winterCoin = new Blockchain();

console.log('Mining block 1...');
winterCoin.addBlock(new Block(1,"12/11/2017", {amount: 4}));
console.log('Mining block 2...');
winterCoin.addBlock(new Block(2,"12/13/2017", {amount: 9}));

// console.log('Is block chain valid ' + winterCoin.isChainValid())

// //break chain
// winterCoin.chain[1].data = {amount: 100};
// winterCoin.chain[1].hash = winterCoin.chain[1].calculateHash();

// console.log('Is block chain valid ' + winterCoin.isChainValid())
// console.log(JSON.stringify(winterCoin, null, 4))

//https://www.youtube.com/watch?v=HneatE69814

// proof of work prevents spamming and security flaws. This mechanism equates to using a lot of computing power to create a block aka mining