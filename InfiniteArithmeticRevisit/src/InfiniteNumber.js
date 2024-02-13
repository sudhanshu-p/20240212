/* 
Problem - Create a class of Number that stores numbers in the form of arrays
Each position in the array consists of a single digit from 0 - 9.
Hence there is no limits on the space, only limits on the system's size, 
which is upto the end user.
Class methods - add, subtract, multiply, divide
These are the main methods. 
Apart from these, we can have many different internal methods.
Variables - Internal Data
*/

/**
 * @author Sudhanshu
 */
class InfiniteNumber {

	/**
	 * @private
	 * @type {Array<Number>}
	 */
	_internalArray

	constructor(inputObject) {
		// Inputs Accepted - Number, String, Array, InfiniteNumber
		// For Input being a Number
		if (typeof inputObject === "number") {
			// Checking for Integer
			if (!Number.isInteger(inputObject)) {
				throw new Error("Inputs should strictly be integers")
			}

			if (inputObject < 0) {
				throw new Error("Inputs cannot be negative")
			}

			// Validation for Number done.
			this._internalArray = this.__numberToInfiniteNumber(inputObject)
		}

		// For Input being a String
		else if (typeof inputObject === "string") {

			// Check for empty string
			if (inputObject.length === 0) {
				throw new Error("String cannot be empty")
			}

			// Checking each entry
			const outputArray = inputObject.split('')
			outputArray.forEach((individualDigit, index) => {
				// Checking each digit to be an integer
				if (!Number.isInteger(+individualDigit)) {
					throw new Error("Input String does not represent a number")
				}

				// Making sure the stored data is Numeric
				outputArray[index] = +outputArray[index]
			})

			// All checks done, initializing the internal array
			this._internalArray = outputArray
		}

		// For Input being an Array
		else if (Array.isArray(inputObject)) {
			inputObject.forEach((individualDigit) => {
				// Checking each digit to be an integer
				if (!Number.isInteger(+individualDigit)) {
					throw new Error("Input String does not represent a number")
				}

				// Checking for range
				if (individualDigit > 9 || individualDigit < 0) {
					throw new RangeError("Each digit in the array should be a one"
						+ " digit integer")
				}

				// All checks done, initializing the internal array
				this._internalArray = inputObject
			})
		}

		// For Input being an Object
		else if (typeof inputObject === "object") {
			// We only allow Objects of Infinite Number
			if (!inputObject instanceof InfiniteNumber) {
				throw new Error("Invalid Object given as Input.")
			}

			this._internalArray = inputObject.getInternalArray()
		}

		else {
			throw new Error("Input must be Number, String, Array or Object.")
		}

		this._removeUnwantedZeros()
	}

	_removeUnwantedZeros() {
		while (this._internalArray[0] === 0 && this._internalArray.length > 1) {
			this._internalArray.shift()
		}
	}

	/** Internal function to convert a validated integer into an array
	 * @param {Number} inputValue
	 * @returns {Array<Number>} The inputs in array format
	 */
	__numberToInfiniteNumber(inputValue) {

		const outputArray = []

		while (inputValue > 0) {
			outputArray.push(inputValue % 10)
			inputValue = Math.floor(inputValue / 10)
		}

		return outputArray.reverse()
	}

	/** Getter for the internalArray variable, returns a deep copy 
	 * @returns {Array<Number>} The deep copy of internal Array
	 */
	getInternalArray() {
		// This is the easiest way to make sure a deep copy is created
		return JSON.parse(JSON.stringify(this._internalArray))
	}

	// Moving on to the Operations

	// Internal functions: 


	/** Takes in ordered input and returns the subtracted output
	 * @private
	 * @param {Array<Number>} biggerNumber - The bigger number amongst the two
	 * @param {Array<Number>} smallerNumber - The smaller number
	 * @returns {Array<Number>} The output of biggerNumber - smallerNumber
	 */
	static __simpleSubtract(biggerNumber, smallerNumber) {
		/**
		 * @type {Number}
		 * indicates whether there is a borrow
		 */
		let borrow = 0

		/**
		 * @type {Number}
		 * used to keep track of current location
		 */
		let index = 0

		/**
		 * @type {Array <Number>}
		 */
		let outputArray = []

		// Subtracts digit by digit until smaller number wears out
		while (index < biggerNumber.length && index < smallerNumber.length) {

			let currentNum = biggerNumber[biggerNumber.length - index - 1] -
				borrow - smallerNumber[smallerNumber.length - index - 1]
			borrow = 0

			// If the digit is negative, make it positive and switch borrow
			if (currentNum < 0) {
				currentNum += 10
				borrow = 1
			}
			outputArray.unshift(currentNum)
			index++
		}

		// Only bigger number can have remaining digits
		while (index < biggerNumber.length) {
			let currentNum = biggerNumber[biggerNumber.length - index - 1]
				- borrow
			borrow = 0

			if (currentNum < 0) {
				currentNum += 10
				borrow = 1
			}

			outputArray.unshift(currentNum)
			index++
		}

		// For trailing 0s
		while (outputArray[0] === 0) {
			outputArray.shift()
		}

		return outputArray
	}

	/** Multiplies an array of numbers with 1 digit.
	 * @private
	 * @param {Array<Number>} multiplicant The number to be multiplied
	 * @param {Number} multiplier The digit that multiplies
	 * @returns {Array<Number>} the result of multiplication
	 */
	static __oneDigitMultiply(multiplicant, multiplier) {
		/**
		 * @type {Number}
		 * Carry of the previous multiplication
		 */
		let carry = 0

		/**
		 * @type {Array<Number>}
		 * Stores the result of firstNum * currentMultiplier, 
		 * with the trailing 0s too.
		 */
		let currentResult = []


		// Loops over the multiplicant and accesses it in reverse order
		for (let multiplicantIndex = 0; multiplicantIndex < multiplicant.length;
			multiplicantIndex++) {

			let currentDigit = multiplier * multiplicant[multiplicant.length -
				multiplicantIndex - 1] + carry

			carry = 0

			// Setting carry if there's need
			if (currentDigit > 9) {
				carry = Math.floor(currentDigit / 10)
				currentDigit = currentDigit % 10
			}
			currentResult.unshift(currentDigit)
		}

		if (carry) {
			currentResult.unshift(carry)
		}

		return currentResult
	}

	/** Takes in an array of arrays, and outputs the result of adding them all
	 * @private
	 * @param {Array<Array<Number>>} arrayOfArrays 
	 * @returns {Array<Number>} The result of addition
	 */
	static __addAll(arrayOfArrays) {
		// Checking for lengths
		if (arrayOfArrays.length === 0) {
			return [0]
		}
		if (arrayOfArrays.length === 1) {
			return arrayOfArrays[0]
		}
		/**
		 * @type {Array<Number>} the array containing all sums.
		 */
		let outputArray = (new InfiniteNumber(arrayOfArrays[0]))
			.add(arrayOfArrays[1])

		let index = 2
		while (index < arrayOfArrays.length) {
			outputArray = (new InfiniteNumber(outputArray))
				.add(arrayOfArrays[index])
			index++
		}

		return outputArray
	}

	/** Takes 2 NumArrays as input, and returns 1 if first is bigger,
	 * 0 if they are equal, and -1 if 2nd is bigger
	 * @param {Array<Number>} firstNumber 
	 * @param {Array<Number>} secondNumber 
	 * @returns {Number} -1, 0 or 1
	 */
	static __getBiggerOfTwoNumArrays(firstNumber, secondNumber) {
		// Only intended to be used after verification is complete.

		// Case of firstNumber being greater in length
		if (firstNumber.length - secondNumber.length > 0) {
			return 1
		}

		// Case of secondNumber being greater in length
		if (firstNumber.length - secondNumber.length < 0) {
			return -1
		}

		// Case of equal length, need to check digit by digit which is bigger
		for (let i = 0; i < firstNumber.length; i++) {
			// Case that firstNumber's digit is bigger
			if (firstNumber[i] > secondNumber[i]) {
				return 1
			}
			// Case that secondNumber's digit is bigger
			if (firstNumber[i] < secondNumber[i]) {
				return -1
			}

			// Else loop through all the digits
		}

		// If the loop above ends, both the number are equal.
		return 0
	}

	/** Adds the Infinite Number given as parameter to self
	  * and returns the result
	* @param {InfiniteNumber} otherInfiniteNumber
	* @returns {InfiniteNumber} this + otherInfiniteNumber
	*/
	add(otherInfiniteNumber) {
		if (!(otherInfiniteNumber instanceof InfiniteNumber)) {
			// The constructor automatically handles all the rest of cases
			otherInfiniteNumber = new InfiniteNumber(otherInfiniteNumber)
		}
		/**
		 * @type {Array<Number>}
		 */
		const operand = otherInfiniteNumber.getInternalArray()
		/**
		 * @type {0 | 1}
		 * Carry 1 if the addition of 1 space is more than 9
		 */
		let carry = 0

		/**
		 * @type {Number}
		 * to help keep track of till where we are done
		 */
		let index = 0

		/**
		 * @type {Array<Number>}
		 * the output after addition
		 */
		let outputArray = []


		// While both the numbers have that place's digit
		while (index < this._internalArray.length && index < operand.length) {
			// Sum this particular digit (starts from the last digit)
			let currentSum = this._internalArray[this._internalArray.length - index - 1] +
				operand[operand.length - index - 1] + carry

			// Set carry to 0 after addition
			carry = 0

			// Condition to set carry to 1
			if (currentSum >= 10) {
				carry = 1
				currentSum -= 10
			}

			outputArray.unshift(currentSum)
			index++
		}

		// If both the number aren't of the same length
		while (index < this._internalArray.length) {
			let currentSum = this._internalArray[this._internalArray.length - index - 1] + carry
			carry = 0
			if (currentSum >= 10) {
				carry = 1
				currentSum -= 10
			}
			outputArray.unshift(currentSum)
			index++
		}

		while (index < operand.length) {
			let currentSum = operand[operand.length - index - 1] + carry
			carry = 0
			if (currentSum >= 10) {
				carry = 1
				currentSum -= 10
			}
			outputArray.unshift(currentSum)
			index++
		}
		// if there is carry left
		if (carry) {
			outputArray.unshift(carry)
		}
		return outputArray
	}

	/** Subtracts the second argument from the first.
	 * @param {InfiniteNumber} otherInfiniteNumber
	 * @returns {Array<Number>} firstNumber - secondNumber
	 */
	subtract(otherInfiniteNumber) {

		const firstNumber = this.getInternalArray()
		const secondNumber = otherInfiniteNumber.getInternalArray()

		switch (InfiniteNumber.__getBiggerOfTwoNumArrays(firstNumber,
			secondNumber)) {

			// secondNumber > firstNumber
			case -1:
				const outputArray = InfiniteNumber.__simpleSubtract(secondNumber, firstNumber)
				// outputArray.unshift('-')
				return new InfiniteNumber(outputArray)

			// The numbers are equal
			case 0:
				return new InfiniteNumber([0])

			// firstNumber > secondNumber
			case 1:
				return new InfiniteNumber(InfiniteNumber.__simpleSubtract(firstNumber, secondNumber))
		}
	}


	/** Multiplies two given InfiniteNumber
	 * @param {InfiniteNumber} otherInfiniteNumber
	 * @returns {Array <Number>} firstNumber * secondNumber
	 */
	multiply(otherInfiniteNumber) {

		if (!otherInfiniteNumber instanceof InfiniteNumber) {
			// The constructor automatically handles all the rest of cases
			otherInfiniteNumber = new InfiniteNumber(otherInfiniteNumber)
		}

		// Copying the arrays for easier access
		const firstNumber = this.getInternalArray()
		// console.log(otherInfiniteNumber.getInternalArray())
		const secondNumber = otherInfiniteNumber.getInternalArray()

		/**
		 * @type {Number}
		 * Index of how far we are, on the 2nd number
		 */
		let secondNumIndex = 0

		/**
		 * @type {Array<Array<Number>>}
		 * The array of array that need to be added
		 */
		let outputArray = []

		while (secondNumIndex < secondNumber.length) {
			/**
			 * @type {Number}
			 * This number is to be multiplied with the entire firstNumber
			 */
			const currentMultiplier = secondNumber[secondNumber.length -
				secondNumIndex - 1]

			if (currentMultiplier === 0) {
				secondNumIndex++
				continue
			}
			let currentResult = InfiniteNumber.__oneDigitMultiply(firstNumber,
				currentMultiplier)

			// Add the trailing 0s
			for (let trailing = 0; trailing < secondNumIndex; trailing++) {
				currentResult.push(0)
			}

			outputArray.push(currentResult)
			secondNumIndex++
		}

		return new InfiniteNumber(InfiniteNumber.__addAll(outputArray))
	}


	/** Overriding the toString method of this Class 
	* @returns {String} Representing the internal number in string format
	*/
	toString() {
		let outputString = ""

		// Adding the commas at every 3 digits
		this._internalArray.forEach((value, index) => {
			outputString += value

			if ((this._internalArray.length - index - 1) % 3 === 0
				&& index != this._internalArray.length - 1) {
				outputString += ","
			}
		})

		return outputString
	}


}

module.exports = InfiniteNumber