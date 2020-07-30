const express = require('express');
const router = express.Router();

const BlockchainCls = require('../controllers/Blockchain');
const Blockchain = new BlockchainCls();

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


let node_id = uuidv4();

router.get('/', (req, res) => {
  res.send(JSON.stringify(Blockchain.chain));
});
router.get('/chain', (req, res) => {
  res.send(JSON.stringify(Blockchain.chain));
});

router.get('/mine', (req, res) => {
  let last_proof;
  let last_block = Blockchain.last_block();
  if (last_block == 0) {
    last_proof = 0;
  }
  else {
    last_proof = last_block.proof;
  }
  const proof = Blockchain.proof_of_work(last_proof);

  /*  
      Add a bitcoin for the miner
      0 in sender means it is being mined (no sender, sender is the blockchain)
      recipient is node ID
  */
  const index = Blockchain.new_transaction(0, node_id, 1);

  const previous_hash = Blockchain.hash(last_block);
  const block = Blockchain.new_block(proof, previous_hash);

  res.send(JSON.stringify(block));
});

router.post('/transactions/new', (req, res) => {
  if (req.query.sender === '' || req.query.ammount === "" || req.query.recipient === "") {
    res.send("Missing values");
    return;
  }
  let index = Blockchain.new_transaction(req.query.sender, req.query.recipient, req.query.ammount)
  res.send("Transaction will be added to block " + index);
});

router.post('/nodes/register', (req, res) => {
  const nodes = req.query.nodes;
  if (nodes === "") {
    res.send("Provide a list of nodes or leave me alone");
  }
  nodes.forEach(element => {
    Blockchain.register_node(element);
  });
  res.send("Nodes will be added to the block ");
});

router.get('/nodes/resolve', (req, res) => {
  const replaced = Blockchain.resolve_conflicts();
  res.send(JSON.stringify(Blockchain));
});

module.exports = router;
