const assert = require('assert');
const TradeEngine = require('../trade-engine');

describe('TradeEngine unit tests', async () => {
  let tradeEngine;

  beforeEach(async () => {
    tradeEngine = new TradeEngine({
      baseCurrency: 'chain',
      quoteCurrency: 'capitalisk'
    });
  });

  describe('Order matching', async () => {

    it('Bid order is made with greater size but same price as ask', async () => {
      let result;

      result = tradeEngine.addOrder({
        id: 'order0',
        type: 'limit',
        price: .1,
        targetChain: 'lsk',
        targetWalletAddress: '22245678912345678222L',
        side: 'ask',
        size: 100
      });

      result = tradeEngine.addOrder({
        id: 'order1',
        type: 'limit',
        price: .1,
        targetChain: 'clsk',
        targetWalletAddress: '11145678912345678111L',
        side: 'bid',
        size: 1000
      });

      assert.equal(result.takeSize, 100);
      assert.equal(result.takeValue, 10);
      assert.equal(result.taker.orderId, 'order1');
      assert.equal(result.taker.size, 1000);
    });

    it('Bid order is made with greater size and higher price as ask', async () => {
      let result;

      result = tradeEngine.addOrder({
        id: 'order0',
        type: 'limit',
        price: .1,
        targetChain: 'lsk',
        targetWalletAddress: '22245678912345678222L',
        side: 'ask',
        size: 100
      });

      result = tradeEngine.addOrder({
        id: 'order1',
        type: 'limit',
        price: .2,
        targetChain: 'clsk',
        targetWalletAddress: '11145678912345678111L',
        side: 'bid',
        size: 1000
      });

      assert.equal(result.takeSize, 100);
      assert.equal(result.takeValue, 10);
      assert.equal(result.taker.orderId, 'order1');
      assert.equal(result.taker.size, 1000);
    });

    it('Multiple bid orders in series', async () => {
      let result;

      result = tradeEngine.addOrder({
        id: 'order0',
        type: 'limit',
        price: .5,
        targetChain: 'lsk',
        targetWalletAddress: '22245678912345678222L',
        side: 'ask',
        size: 4000
      });

      result = tradeEngine.addOrder({
        id: 'order1',
        type: 'limit',
        price: .5,
        targetChain: 'clsk',
        targetWalletAddress: '11145678912345678111L',
        side: 'bid',
        size: 8
      });

      assert.equal(result.makers[0].valueTaken, 4);

      result = tradeEngine.addOrder({
        id: 'order2',
        type: 'limit',
        price: .5,
        targetChain: 'clsk',
        targetWalletAddress: '11145678912345678111L',
        side: 'bid',
        size: 40
      });

      assert.equal(result.makers[0].valueTaken, 20);

      result = tradeEngine.addOrder({
        id: 'order3',
        type: 'limit',
        price: .5,
        targetChain: 'clsk',
        targetWalletAddress: '11145678912345678111L',
        side: 'bid',
        size: 12
      });

      assert.equal(result.makers[0].valueTaken, 6);
    });

  });
});
