const InfiniteNumber = require('./InfiniteNumber.js')

/** Simple testing function
 * @param firstParam - First Number
 * @param secondParam - Second Number
 */
function testingFunction(firstParam, secondParam) {
    const a = new InfiniteNumber(firstParam)
    const b = new InfiniteNumber(secondParam)

    const c = a.add(b)
    console.log(`Addition = ${c.toString()}`)
    const d = a.subtract(b)
    console.log(`Subtraction = ${d.toString()}`)
    const e = a.multiply(b)
    console.log(`Multiplication = ${e.toString()}`)
}

module.exports = { testingFunction }