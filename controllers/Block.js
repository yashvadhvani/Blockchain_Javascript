class Block {
  constructor(index, timestamp, transactions, proof, previous_hash) {
    this._index = index;
    this._timestamp = timestamp;
    this._transactions = transactions;
    this._proof = proof;
    this._previous_hash = previous_hash;
  }

  get timestamp() {
    return this._timestamp;
  }

  get transactions() {
    return this._transactions;
  }

  get proof() {
    return this._proof;
  }

  get previous_hash() {
    return this._previous_hash;
  }

  get index() {
    return this._index;
  }

}
module.exports = Block