const { table } = require('console');

/**
 * The class to perform CRUD operations on the database
 * @author Sudhanshu
 */
class Database {
    constructor(dataPath) {
        this.dataPath = dataPath
        this.fs = require('fs'); // Accessing Node.js file system
    }

    /**
     * Internal function that checks if a database exists or not
     * @param {String} dbName The name of the Database
     * @returns {Boolean} true if database exists, false otherwise
     */
    __databaseExists(dbName) {
        return this.fs.existsSync(`${this.dataPath}/${dbName}`)
    }

    /**
    * Create a new database
    * @param {String} dbName - Name of database to be read
    * @throws {Error} When database already exists 
    */
    createDatabase(dbName) {
        const path = `${this.dataPath}/${dbName}`
        if (!this.fs.existsSync(path)) {
            this.fs.mkdirSync(path)
            return true
        }
        throw new Error('Database already exists')
    }

    /**
    * List all databases
    * @returns {Array} List of all databases
    */
    listDatabases() {
        const folders = this.fs.readdirSync(this.dataPath)

        // Filter is to only return folders
        return folders.filter(
            folder => this.fs.statSync(`${this.dataPath}/${folder}`).isDirectory()
        )
    }

    /**
     * Update / Rename a database 
     * @param {String} oldName The initial name of database to be renamed
     * @param {String} newName The new name of the database
     */
    renameDatabase(oldName, newName) {
        // Check if old database doesn't exists
        if (!this.__databaseExists(oldName)) {
            throw new Error('Database not found')
        }

        // Check if new name already exists
        if (this.__databaseExists(newName)) {
            throw new Error('Target database already exists')
        }

        this.fs.renameSync(`${this.dataPath}/${oldName}`, `${this.dataPath}/${newName}`)
        return true
    }


    /**
     * Deletes a database if it is empty
     * @param {String} dbName Name of database to be deleted
     * @throws {Error} When the database doesn't exist, or when it is not empty
     */
    deleteDatabase(dbName) {
        if (!this.__databaseExists(dbName)) {
            throw new Error('Database not found')
        }

        // Ensure folder is empty before deletion
        const files = this.fs.readdirSync(`${this.dataPath}/${dbName}`)
        if (files.length > 0) {
            throw new Error('Database is not empty')
        }

        this.fs.rmdirSync(`${this.dataPath}/${dbName}`)
        return true
    }

    /**
     * Deletes a non-empty database also
     * @param {String} dbName Name of database to be deleted
     * @throws {Error} When the database doesn't exist
     */
    forceDeleteDatabase(dbName) {
        if (!this.__databaseExists(dbName)) {
            throw new Error('Database not found')
        }

        this.fs.rmdirSync(`${this.dataPath}/${dbName}`)
        return true
    }


    /**
     * Checks if the table exists or not
     * @param {String} dbName Name of database
     * @param {String} tableName Name of Table
     * @returns {Boolean}
     */
    __tableExists(dbName, tableName) {
        const path = `${this.dataPath}/${dbName}/${tableName}.txt`

        if (!this.fs.existsSync(path)) {
            return false
        }
        return true
    }

    /**
    * Create a new Table in a database
    * @param {String} dbName - Name of database in which table is to be created
    * @param {String} tableName - Name of table to be created
    * @throws {Error} When database doesn't exists, or when table exists
    */
    createTable(dbName, tableName) {

        if (!this.__databaseExists(dbName)) {
            throw new Error("Database doesn't exists")
        }


        if (this.__tableExists(dbName, table)) {
            throw new Error("Table already exists")
        }

        const path = `${this.dataPath}/${dbName}/${tableName}.txt`
        this.fs.writeFileSync(`${path}`, '')

        return true
    }

    /**
     * Reads the entire table
     * @param {String} dbName Name of database in which table is there
     * @param {String} tableName Name of table to be read
     * @throws {Error} When the Database doesn't exist or when the table 
     * doesn'texist
     */
    readTable(dbName, tableName) {

        if (!this.__databaseExists(dbName)) {
            throw new Error("Invalid Database")
        }

        if (!this.__tableExists(dbName, tableName)) {
            throw new Error("Table to be read does not exist")
        }

        const path = `${this.dataPath}/${dbName}/${tableName}.txt`
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

    /**
     * 
     * @param {String} dbName Name of database
     * @param {String} oldTableName Name of table
     * @param {String} newTableName Name of table
     */
    updateTable(dbName, oldTableName, newTableName) {
        if (!(this.__databaseExists(dbName))) {
            throw new Error("The database does not exist!")
        }

        if (!(this.__tableExists(dbName, oldTableName))) {
            throw new Error("Table to be renamed does not exist!")
        }

        if (this.__tableExists(dbName, newTableName)) {
            throw new Error("New table name already exists!")
        }

        this.fs.renameSync(`${this.dataPath}/${dbName}/${oldTableName}.txt`,
            `${this.dataPath}/${dbName}/${newTableName}.txt`)
        return true
    }

    /** Deletes the table given as parameter if it is empty
     * @param {String} dbName - Name of the database
     * @param {String} tableName - Name of the table to be deleted
     */
    deleteTable(dbName, tableName) {
        if (!(this.__databaseExists(dbName))) {
            throw new Error("The database does not exist!")
        }

        if (!(this.__tableExists(dbName, tableName))) {
            throw new Error("Table to be renamed does not exist!")
        }

        // If the file is empty, safe to delete it
        if (this.readTable(dbName, tableName) === "") {
            this.fs.rmSync(`${this.dataPath}/${dbName}/${tableName}.txt`)
        }
        else {
            throw new Error("Table to be deleted is not empty!")
        }
    }

    /** Deletes the table given as parameter no matter if it's empty or not
     * @param {String} dbName - Name of the database
     * @param {String} tableName - Name of the table to be deleted
     */
    forceDeleteTable(dbName, tableName) {
        if (!(this.__databaseExists(dbName))) {
            throw new Error("The database does not exist!")
        }

        if (!(this.__tableExists(dbName, tableName))) {
            throw new Error("Table to be renamed does not exist!")
        }

        this.fs.rmSync(`${this.dataPath}/${dbName}/${tableName}.txt`)
        return true
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

        // Creating a table
        // db.createTable("testing-database", "testing-table")

        // Reading a table
        // const content = db.readTable("testing-database", "testing-table")
        // console.log(`File content: ${content}`)

        // Updating a table
        // db.updateTable("testing-database",
        //     "testing-table",
        //     "new-renamed-table")

        // Deleting a table
        // db.deleteTable("testing-database", "empty-table")
        // db.forceDeleteTable("testing-database", "new-renamed-table")

        
    } catch (error) {
        console.error('Error:', error.message)
    }
}

testingFunction()