const { default: test } = require("node:test");

/** Valdiates the schema given
 * @param {Object} schema The user designed schema
 * @returns {Boolean|String} true if schema is valid, else the errors.
 */
function __validateSchema(schema) {
    // Variable to keep track of the primary key found or not
    let primaryKeyExists = false

    // These are the acceptable types for a prop in the schema
    const validTypes = ['string', 'number', 'boolean', 'object'];

    // These are the must have declarations for every prop in any Schema
    const requiredProperties = ['type']

    // Check if schema is an object or not
    if (typeof schema !== 'object' || Array.isArray(schema)) {
        return 'Schema must be an object.'
    }

    // Check if at least one property is defined
    if (Object.keys(schema).length === 0) {
        return 'Schema must have at least one property.'
    }

    for (const [propertyName, property] of Object.entries(schema)) {
        if (typeof property !== 'object' || Array.isArray(property)) {
            return 'Each property must be an object.'
        }

        // For every property that is required, check if it is actually there
        for (const index in requiredProperties) {
            // If it does not exist in the current property's details
            if (!property[requiredProperties[index]]) {
                return `Each property should have ${requiredProperties[index]}`
            }
        }

        // Checking for the type being in allowed list.
        if (!validTypes.includes(property.type)) {
            return `Invalid type for ${propertyName}`
        }

        // If this property is specified as the primary one,
        if (property.primary) {
            // If there is a primary key already specified
            if (primaryKeyExists) {
                return `Cannot have more tha 1 primary key`
            }
            primaryKeyExists = true
        }

    }

    // If the primary key is still not found
    if (!primaryKeyExists) return `Schema should have 1 primary key`

    // The given schema has been validated.
    return true
}

/** Considering the schema is valid, validate the object against the schema
 * @param {Object} schemaToValidateAgainst - Validated Schema to check against
 * @param {Object} objectToBeValidated - The object that is to be validated
 */
function __validateObject(schemaToValidateAgainst, objectToBeValidated) {

    // Check if the object given is an object
    if (typeof objectToBeValidated !== "object"
        || Array.isArray(objectToBeValidated)) {
        return `Data must be an object`
    }

    // Check if at least one property is defined
    if (Object.keys(objectToBeValidated).length === 0) {
        return 'Object must have at least one property.'
    }

    // Get the primary key of the schema
    const primaryKey = Object.keys(schemaToValidateAgainst).filter((prop) =>
        schemaToValidateAgainst[prop].primary
    )

    // Check if Object has primary key
    if (!objectToBeValidated.hasOwnProperty(primaryKey)) {
        return `Object must have the ${primaryKey} field`
    }

    // TODO: Add a check to make sure the primary key is unique.

    // Looping and checking over each data.
    for (const [propName, propValue] of Object.entries(objectToBeValidated)) {

        // Check if the property is defined in schema
        if (!schemaToValidateAgainst.hasOwnProperty(propName)) {
            return `Invalid property ${propName}`
        }

        // Get the description of this property from schema
        const property = schemaToValidateAgainst[propName]

        // Validate type
        if (typeof propValue !== property.type) {
            return `Type mismatch for ${propName}. Expected ${property.type}`
        }
    }

    return true
}


function testFunction() {
    // Example of a typical schema:
    const schema1 = {
        name: {
            type: 'string',
            primary: true
        },
        email: {
            type: 'object'
        }
    }

    const schema2 = {
        age: {
            type: 'number',
            primary: false
        }
    }

    const object1 = {
        name: 'Sudhanshu',
        email: 'abc@gmail.com'
    }

    const object2 = {
        email: 'abcd@gmail.com'
    }

    console.log(__validateSchema(schema1))
    console.log(__validateSchema(schema2))

    // console.log(__validateObject(schema1, object1))
    // console.log(__validateObject(schema1, object2))
}