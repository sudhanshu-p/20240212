/*
Problem Definition - Create a DBMS to perform CRUD operations on
- A folder (Database)
- A file (Collection)
- An entry within that file (Record)
*/

/** The class to perform these crud operations
 * 
 */
class Database {

    /** Root path of the data
     * @private
     */
    dataPath

    /** The database that is currently being accessed.
     * @private
     */
    currentDatabase

    /** Having the fs internal, so as not to expose the file system
     * @private
     */
    fs

    constructor(dataPath) {
        this.fs = require('fs')
        if (!this.fs.existsSync(dataPath)) {
            throw new Error("Invalid root folder.")
        }
        this.dataPath = dataPath
    }

    /** Internal function that alidates whether a database name.
     * @param {String} databaseName Name of the datbase
     */
    __verifyDatabaseName(databaseName) {
        if(typeof databaseName !== "string") {
            throw new Error("Database names must be strings")
        }

        if(databaseName.length <= 5) {
            throw new Error("Atleast 5 charachters in a database name")
        }

        if(typeof (+(databaseName.charAt(0))) === "number") {
            throw new Error("First charachter must not be a number")
        }
        return true
    }

    /** Checks whether a database by the name given as param exists or not. 
     * @param {String} databaseName
    */
    __databaseExists(databaseName) {
        return this.fs.existsSync(`${this.dataPath}/${databaseName}`)
    }


    /** Takes in a database name to access that database 
     * @param {String} databaseName
     * TODO: Add a password mechanism.
    */
    connect(databaseName) {
        if (!this.__databaseExists(databaseName)) {
            throw new Error("Invalid Database.")
        }

        this.currentDatabase = `${this.dataPath}/${databaseName}`
        console.log("Connected to database " + databaseName)
    }

    /** Create a new folder (Database) of the given name
     * @param {String} databaseName - Name of database to be created
     * @throws {Error} When a database with the same name already exists
     */
    createDatabase(databaseName) {
        this.__verifyDatabaseName(databaseName)
        if (this.__databaseExists(databaseName)) {
            throw new Error("Database with same name already exists")
        }

        const path = `${this.dataPath}/${databaseName}`
        this.fs.mkdirSync(path)
        console.log("Created Database " + databaseName)
        return this.connect(databaseName)
    }

    /** List(Read) all the files of the current database 
     * @returns {Array<String>} List of all collections in this database
    */
    readDatabase() {
        if (!this.__databaseExists(this.currentDatabase)) {
            throw new Error("Cannot read current database")
        }

        const folders = this.fs.readdirSync(this.currentDatabase)
        return folders
    }

    /** Rename(Update) the current database to the parameter given 
     * @param {String} newDatabaseName - Target name of the database
    */
    renameDatabase(newDatabaseName) {
        if (!this.__databaseExists(this.currentDatabase)) {
            throw new Error("Cannot read current database")
        }
        this.__verifyDatabaseName(newDatabaseName)
        if (this.__databaseExists(newDatabaseName)) {
            throw new Error("Database with same name already exists")
        }

        this.fs.renameSync(`${this.currentDatabase}`, `${this.dataPath}/${newDatabaseName}`)
        this.currentDatabase = `${this.dataPath}/${newDatabaseName}`
    }

    /** Safe delete the current database (Only delete if empty) */
    deleteDatabase() {
        if (!this.__databaseExists(this.currentDatabase)) {
            throw new Error("Cannot read current database")
        }

        const files = this.fs.readdirSync(`${this.currentDatabase}`)
        if (files.length > 0) {
            throw new Error('Database is not empty')
        }

        this.fs.rmdirSync(`${this.currentDatabase}`)
        return true
    }

    /** Forcefully deletes the current database (RISKY!) */
    forceDeleteDatabase() {
        if (!this.__databaseExists(this.currentDatabase)) {
            throw new Error("Cannot read current database")
        }

        this.fs.rmdirSync(`${this.currentDatabase}`)
        return true
    }

    // Now, CRUD on the collections

    /** Internal function to check if a collection by the current name exists
     * @param {String} collectionName - Name of the collection
     * @returns {Boolean} Does the collection exist in current DB?
    */
    __collectionExists(collectionName) {
        const path = `${this.currentDatabase}/${collectionName}`
        return this.fs.existsSync(path)
    }


    /** Internal function to check if a collection name is valid 
     * @param {String} collectionName
    */
    __verifyCollectionName(collectionName) {
        if(typeof collectionName !== "string") {
            throw new Error("Collection names must be strings")
        }

        if(collectionName.length <= 3) {
            throw new Error("Atleast 3 charachters in a collection name")
        }

        return true
    }

    /** Creates a new collection in the current database 
     * @param {String} collectionName - Name of the new collection
    */
    createCollection(collectionName) {
        this.__verifyCollectionName(collectionName)
        if (this.__collectionExists(collectionName)) {
            throw new Error("Collection by the same name already exists")
        }

        const path = `${this.currentDatabase}/${tableName}.json`
        this.fs.writeFileSync(`${path}`, '')
    }

    /** Reads the entire content of a collection 
     * @param {String} collectionName - Name of collection to be read
    */
    readCollection(collectionName) {
        this.__verifyCollectionName(collectionName)

        if (!this.__collectionExists(collectionName)) {
            throw new Error("Collection to be read doesn't exist")
        }

        const path = `${this.currentDatabase}/${collectionName}.json`
        // this.fs.readFile(path, 'utf8', (err, data) => {
        //     if (err) throw err;
        //     console.log('File content:', JSON.parse(data));
        // })

        const data = this.fs.readFileSync(path, {
            encoding: 'utf8',
            flag: 'r'
        })

        return data
    }

    /** Renames a table to the given parameter
     * @param {String} oldCollectionName - Old name of the collection
     * @param {String} newCollectionName - New name of the collection
     */
    renameCollection(oldCollectionName, newCollectionName) {
        this.__verifyCollectionName(oldCollectionName)
        this.__verifyCollectionName(newCollectionName)

        if (!this.__collectionExists(oldCollectionName)) {
            throw new Error("Collection to be renamed doesn't exist")
        }

        if (this.__collectionExists(newCollectionName)) {
            throw new Error("A collection by the new name already exists")
        }

        this.fs.renameSync(`${this.currentDatabase}/${oldCollectionName}.json`,
            `${this.currentDatabase}/${newCollectionName}.json`)

        return true
    }

    /** Safe Deletes the collection given as a parameter
     * @param {String} collectionName
     */
    deleteCollection(collectionName) {
        this.__verifyCollectionName(collectionName)

        if (!this.__collectionExists(collectionName)) {
            throw new Error("Collection to be deleted doesn't exist")
        }

        // If the file is empty, delete it.
        if (this.readCollection(collectionName) === "") {
            this.fs.rmSync(`${this.currentDatabase}/${collectionName}.json`)
        }
        else {
            throw new Error("Collection to be deleted is not empty!")
        }
    }

    /** Forcefully deletes the collection given as parameter
     * @param {String} collectionName
     */
    forceDeleteCollection(collectionName) {
        this.__verifyCollectionName(collectionName)

        if (!this.__collectionExists(collectionName)) {
            throw new Error("Collection to be deleted doesn't exist")
        }
        this.fs.rmSync(`${this.currentDatabase}/${collectionName}.json`)
    }
}


function testingFunction() {

    // Connecting to the Database of Databases
    const db = new Database('./data')

    try {

        // Creating 1 folder
        // db.createDatabase('testing-database')

        // Creating 100 folders
        // for (let i = 0; i < 100; i++) {
        //     db.createDatabase('database' + i)
        //     console.log('Database created successfully')
        // }

        // Read all existing folders
        // const existingDatabases = db.listDatabases()
        // console.log('Existing databases:', existingDatabases)

        // 
        // db.renameDatabase('database1', 'newNameDatabase')
        // console.log('Database renamed')

        // for (let i = 0; i < existingDatabases.length; i++) {
        //     db.deleteDatabase(existingDatabases[i])
        // }

        // db.connect("testing-database")

        // Creating a Collection
        // db.createCollection("testing-Collection")

        // Reading a Collection
        // const content = db.readCollection("testing-Collection")
        // console.log(`File content: ${content}`)

        // Updating a Collection
        // db.renameCollection( "testing-Collection",
        //     "new-renamed-Collection")

        // Deleting a Collection
        // db.deleteCollection("empty-Collection")
        // db.forceDeleteCollection("testing-database", "new-renamed-Collection")


    } catch (error) {
        console.error('Error:', error.message)
    }
}

testingFunction()