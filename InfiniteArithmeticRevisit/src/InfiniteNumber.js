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
 * @author
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
	}

	/** Function to convert a validated integer into an array
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
		return JSON.parse(JSON.stringify(this._internalArray))
	}

	/** Overriding the toString method of this Class 
	 * @returns {String} Representing the internal number in string format
	*/
	toString() {
		let outputString = ""
		this._internalArray.forEach((value, index) => {
			outputString += value

			// Adding the commas at every 3 digits
			if ((this._internalArray.length - index - 1) % 3 === 0
				&& index != this._internalArray.length - 1) {
				outputString += ","
			}
		})
		return outputString
	}


	static testingFunction() {
		const a = new InfiniteNumber(new InfiniteNumber(1234919212))
		console.log(a.getInternalArray())
		console.log(a.toString())
	}
}

InfiniteNumber.testingFunction()



// 12912127
// 12,912,127