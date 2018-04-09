/**
 * LS-8 v2.0 emulator skeleton code
 */

const fs = require('fs');

const HLT  = 0b00000001; // Halt CPU
const LDI = 0b10011001;
const MUL = 0b10101010;
const PRN = 0b01000011;
const ADD = 0b10101000;
const ADN = 0b10101000;
const NOP = 0b00000000;

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
      const this = this;  
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
                // !!! IMPLEMENT ME
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

				let offset(this.reg.IR >> 6) & 0b00000011;

				const operandA = this.ram.read(this.reg.PC + 1);
				const operandB = this.ram.read(this.reg.PC + 2);

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
   MUL(regA, regB)
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
}

module.exports = CPU;
