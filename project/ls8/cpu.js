  /**
 * LS-8 v2.0 emulator skeleton code
 */

const fs = require('fs');

const HLT = 0b00000001; // Halt CPU
const LDI = 0b10011001;
const MUL = 0b10101010;
const PRN = 0b01000011;
const ADD = 0b10101000;
const AND = 0b10101000;
const NOP = 0b00000000;
const PUSH = 0b01001101;
const POP = 0b01001100;

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {
  /**
   * Initialize the CPU
   */
  constructor(ram) {
    this.ram = ram;

    this.reg = new Array(8).fill(0); // General-purpose registers R0-R7

    // Special-purpose registers
    this.reg.PC = 0; // Program Counter
    this.reg.IR = 0; // Instruction Register

    this.setupBranchTable();
    this.reg[111] = 0xF4;
  }
  /**
   * Set up the branch table
   */
  setupBranchTable() {
    let bt = {};
    bt[HLT] = this.HLT;
    bt[LDI] = this.LDI;
    bt[MUL] = this.MUL;
    bt[PRN] = this.PRN;
    bt[ADD] = this.ADD;
    bt[AND] = this.AND;
    bt[NOP] = this.NOP;
    bt[PUSH] = this.PUSH;
    bt[POP] = this.POP;
    this.branchTable = bt;
  }

  /**
   * Store value in memory address, useful for program loading
   */

  poke(address, value) {
    this.ram.write(address, value);
  }

  /**
   * Starts the clock ticking on the CPU
   */
  startClock() {
    this.clock = setInterval(() => {
      this.tick();
    }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
  }

  /**
   * Stops the clock
   */
  stopClock() {
    clearInterval(this.clock);
  }

  /**
   * ALU functionality
   *
   * The ALU is responsible for math and comparisons.
   *
   * If you have an instruction that does math, i.e. MUL, the CPU would hand
   * it off to it's internal ALU component to do the actual work.
   *
   * op can be: ADD SUB MUL DIV INC DEC CMP
   */
  alu(op, regA, regB) {
    switch (op) {
      case 'MUL':
        this.reg[regA] = this.reg[regA] * this.reg[regB];
        break;
      case 'ADD':
        this.reg[regA] = this.reg[regA] + this.reg[regB];
        break;
      case 'AND':
        this.reg[regA] = this.reg[regA] & this.reg[regB];
    }
  }

  /**
   * Advances the CPU one cycle
   */
  tick() {
    // Load the instruction register (IR--can just be a local variable here)
    // from the memory address pointed to by the PC. (I.e. the PC holds the
    // index into memory of the instruction that's about to be executed
    // right now.)

    // !!! IMPLEMENT ME
    this.reg.IR = this.ram.read(this.reg.PC);
    // Debugging output
    //console.log(`${this.reg.PC}: ${IR.toString(2)}`);

    // Get the two bytes in memory _after_ the PC in case the instruction
    // needs them.

    // !!! IMPLEMENT ME

    let offset = (this.reg.IR >> 6) & 0b00000011;

    const operandA = this.ram.read(this.reg.PC + 1);
    const operandB = this.ram.read(this.reg.PC + 2);
    // console.log('operands', operandA, operandB);
    let handler = this.branchTable[this.reg.IR];
    // Execute the instruction. Perform the actions for the instruction as
    // outlined in the LS-8 spec.

    // !!! IMPLEMENT ME

    if (!handler) {
      this.HLT();
      return undefined;
    }
    // Increment the PC register to go to the next instruction. Instructions
    // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
    // instruction byte tells you how many bytes follow the instruction byte
    // for any particular instruction.
    handler.call(this, operandA, operandB);

    // !!! IMPLEMENT ME
    this.reg.PC += offset + 1;
  }

  // Instruction Handler Code

  ADD(regA, regB) {
    this.alu('ADD', regA, regB);
  }
  HLT() {
    this.stopClock();
  }
  LDI(reg, value) {
    this.reg[reg] = value;
  }
  MUL(regA, regB) {
    this.alu('MUL', regA, regB);
  }
  PRN(regA) {
    console.log(this.reg[regA]);
  }
  AND(regA, regB) {
    this.alu('AND', regA, regB);
  }
  NOP() {
    return undefined;
  }
  PUSH(reg) {
    this.reg[111]--;
    this.ram.write(this.reg[111], this.reg[reg]);
  }
  POP(reg) {
    this.reg[reg] = this.ram.read(this.reg[111]);
    this.reg[111]++;
  }
}

module.exports = CPU;


// /**
//  * LS-8 v2.0 emulator skeleton code
//  */

// const fs = require('fs');

// const HLT = 0b00000001; // Halt CPU
// const LDI = 0b10011001;
// const MUL = 0b10101010;
// const PRN = 0b01000011;
// const ADD = 0b10101000;
// const AND = 0b10101000;
// const NOP = 0b00000000;
// const POP = 0b01001100;
// const INC = 0b01111000;
// const DEC = 0b01111001;

// const SP = 0x07;

// /**
//  * Class for simulating a simple Computer (CPU & memory)
//  */
// class CPU {
//   /**
//    * Initialize the CPU
//    */
//   constructor(ram) {
//     this.ram = ram;
//     this.reg[SP] = 0xf3;

//     this.reg = new Array(8).fill(0); // General-purpose registers R0-R7

//     // Special-purpose registers
//     this.reg.PC = 0; // Program Counter
//     this.reg.IR = 0; // Instruction Register

//     this.setupBranchTable();
//   }

//   /**
//    * Set up the branch table
//    */
//   setupBranchTable() {
//     let bt = {};
//     bt[HLT] = this.HLT;
//     bt[LDI] = this.LDI;
//     bt[MUL] = this.MUL;
//     bt[PRN] = this.PRN;
//     bt[ADD] = this.ADD;
//     bt[AND] = this.AND;
//     bt[NOP] = this.NOP;
// 		bt[INC] = this.INC;
// 		bt[DEC] = this.DEC;
// 		bt[POP] = this.POP;

//     this.branchTable = bt;
//   }

//   /**
//    * Store value in memory address, useful for program loading
//    */

//   poke(address, value) {
//     this.ram.write(address, value);
//   }

//   /**
//    * Starts the clock ticking on the CPU
//    */
//   startClock() {
//     this.clock = setInterval(() => {
//       this.tick();
//     }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
//   }

//   /**
//    * Stops the clock
//    */
//   stopClock() {
//     clearInterval(this.clock);
//   }

//   /**
//    * ALU functionality
//    *
//    * The ALU is responsible for math and comparisons.
//    *
//    * If you have an instruction that does math, i.e. MUL, the CPU would hand
//    * it off to it's internal ALU component to do the actual work.
//    *
//    * op can be: ADD SUB MUL DIV INC DEC CMP
//    */
//   alu(op, regA, regB) {
//     switch (op) {
//       case 'MUL':
//         this.reg[regA] = this.reg[regA] * this.reg[regB];
//         break;
//       case 'ADD':
//         this.reg[regA] = this.reg[regA] + this.reg[regB];
//         break;
//       case 'AND':
//         this.reg[regA] = this.reg[regA] & this.reg[regB];
// 			case 'INC':
// 				this.reg[regA] += 1;
// 			case 'DEC':
// 				this.reg[regA] -= 1;
//     }
//   }

//   /**
//    * Advances the CPU one cycle
//    */
//   tick() {
//     // Load the instruction register (IR--can just be a local variable here)
//     // from the memory address pointed to by the PC. (I.e. the PC holds the
//     // index into memory of the instruction that's about to be executed
//     // right now.)

//     // !!! IMPLEMENT ME
//     this.reg.IR = this.ram.read(this.reg.PC);
//     // Debugging output
//     //console.log(`${this.reg.PC}: ${IR.toString(2)}`);

//     // Get the two bytes in memory _after_ the PC in case the instruction
//     // needs them.

//     // !!! IMPLEMENT ME

//     let offset = (this.reg.IR >> 6) & 0b00000011;

//     const operandA = this.ram.read(this.reg.PC + 1);
//     const operandB = this.ram.read(this.reg.PC + 2);
//     // console.log('operands', operandA, operandB);
//     let handler = this.branchTable[this.reg.IR];
//     // Execute the instruction. Perform the actions for the instruction as
//     // outlined in the LS-8 spec.

//     // !!! IMPLEMENT ME

//     if (!handler) {
//       this.HLT();
//       return undefined;
//     }
//     // Increment the PC register to go to the next instruction. Instructions
//     // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
//     // instruction byte tells you how many bytes follow the instruction byte
//     // for any particular instruction.
//     handler.call(this, operandA, operandB);

//     // !!! IMPLEMENT ME
//     this.reg.PC += offset + 1;
//   }

//   // Instruction Handler Code

//   ADD(regA, regB) {
//     this.alu('ADD', regA, regB);
//   }
//   HLT() {
//     this.stopClock();
//   }
//   LDI(reg, value) {
//     this.reg[reg] = value;
//   }
//   MUL(regA, regB) {
//     this.alu('MUL', regA, regB);
//   }
//   PRN(regA) {
//     console.log(this.reg[regA]);
//   }
//   AND(regA, regB) {
//     this.alu('AND', regA, regB);
//   }
//   NOP() {
//     return undefined;
//   }
// 	INC(regA) {
// 		this.alu('INC', regA);
// 	}
//   DEC(regA) {
// 		this.alu('DEC', regA);
// 	}
// 	_pop() {
// 		const value = this.ram.read(this.reg[SP]);
// 		this.alu('INC', SP);
// 		return value;
// 	}
// 	POP(regA) {
// 		this.reg[regA] = this._pop();
// 	}
// 	_push(value) {
// 		this.alu('DEC', SP);
// 		this.ram.write(this.reg[SP], value);
// 	}
// 	PUSH(regA) {
// 		this._push(this.reg[regA]);
// 	}
// }

// module.exports = CPU;
