'use strict';

let eventEmitter = require('../lib/lutronEvents.js');
let lutronEmitter = eventEmitter.lutronEmitter;
let lutronId = '';

const nodeDefId = 'PICO3BRL';

module.exports = function(Polyglot) {
  const logger = Polyglot.logger;

  class Pico3BRLNode extends Polyglot.Node {
    constructor(polyInterface, primary, address, name) {
      super(nodeDefId, polyInterface, primary, address, name);

      this.hint = '0x01020900'; // Example for a Dimmer switch

      this.commands = {
        // DON: this.onDON,
        // DOF: this.onDOF,
        QUERY: this.query,
      };

      this.drivers = {
        ST: {value: '1', uom: 2},
        GPV: {value: '5', uom: 25},
        GV2: {value: '0', uom: 2},
        GV3: {value: '0', uom: 2},
        GV4: {value: '0', uom: 2},
        GV5: {value: '0', uom: 2},
        GV6: {value: '0', uom: 2},
      };

      lutronId = this.address.split('_')[1];
    }

    query() {
      lutronEmitter.emit('query', lutronId);
    }

    onDON(message) {
      // setDrivers accepts string or number (message.value is a string)
      logger.info('DON (%s)', this.address);
      this.setDriver('ST', message.value ? message.value : '1');
      lutronEmitter.emit('on', lutronId);
    }

    onDOF() {
      logger.info('DOF (%s)', this.address);
      this.setDriver('ST', '0');
      lutronEmitter.emit('off', lutronId);
    }

  }

  // Required so that the interface can find this Node class using the nodeDefId
  Pico3BRLNode.nodeDefId = nodeDefId;

  return Pico3BRLNode;
};
