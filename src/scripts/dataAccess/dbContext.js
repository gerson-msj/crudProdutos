export default class DbContext {

    /** @type {IDBDatabase} */
    #db;

    get db() { return this.#db; }

    constructor() {
        
    }

    InitDB() {
        return new Promise((resolve, reject) => {
            const dbRequest = window.indexedDB.open("AppDb", 1);
            dbRequest.onupgradeneeded = (ev) => this.#upgradedneeded(ev.target);
            dbRequest.onsuccess = (ev) => {
                /**@type {IDBOpenDBRequest} */ const dbRequest = ev.target;
                this.#db = dbRequest.result;
                resolve();
            };
            dbRequest.onerror = (ev) => {
                const msg = "Erro ao inicializar IndexedDB";
                console.error(msg, ev);
                reject(msg);
            };
        });
    }

    /**
     * @param {IDBOpenDBRequest} dbRequest
     */
    #upgradedneeded(dbRequest) {
        this.#createDepartamento(dbRequest);
        this.#createProduto(dbRequest);
    }

    /**
     * @param {IDBOpenDBRequest} dbRequest
     */
    #createDepartamento(dbRequest) {
        const db = dbRequest.result;
        const objectStoreName = "Departamento";
        if(db.objectStoreNames.contains(objectStoreName))
            return;

        const objectStore = db.createObjectStore(objectStoreName, { autoIncrement: true, keyPath: "id" }); 
        objectStore.createIndex("nome_idx", "nome", { unique: true });
    }

    /**
     * @param {IDBOpenDBRequest} dbRequest 
     */
    #createProduto(dbRequest) {
        const db = dbRequest.result;
        const objectStoreName = "Produto";
        if(db.objectStoreNames.contains(objectStoreName))
            return;

        const objectStore = db.createObjectStore(objectStoreName, { autoIncrement: true, keyPath: "id" }); 
        objectStore.createIndex("departamento_idx", "idDepartamento", { unique: false });
        objectStore.createIndex("produto_idx", ["nome", "marca", "peso"], { unique: true });
    }
}