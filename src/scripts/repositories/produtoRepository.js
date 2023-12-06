export default class ProdutoRepository {
    
    /** @type {IDBDatabase} */
    #db;
    
    /** @param {IDBDatabase} db */
    constructor(db) {
        this.#db = db;
    }
}