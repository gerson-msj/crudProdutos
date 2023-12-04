export default class Produto {
    /**
     * @param {number} id 
     * @param {number} idDepartamento 
     * @param {string} nome 
     * @param {string} marca 
     * @param {string} peso 
     * @param {number|undefined} preco 
     */
    constructor(id = 0, idDepartamento = 0, nome = '', marca = '', peso = '', preco = undefined){
        this.id = id;
        this.idDepartamento = idDepartamento;
        this.nome = nome;
        this.marca = marca;
        this.peso = peso;
        this.preco = preco;    
    }   
}