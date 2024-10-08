import { GithubUser } from "./GithubUser.js";

// classe que vai conter a lógica dos dados
export class Favorites{
    constructor(root){
        this.root = document.querySelector(root)
        this.load();
        

    }

    load(){
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [];

    }

    delete(user){
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login);

        this.entries = filteredEntries;
        this.update();
        this.save();

    }

    save(){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries));
    }

    async add(username){

        try{

            const userExists = this.entries.find(entry => entry.login === username);

            if(userExists){
                throw new Error("Usuário já cadastrado!");
            }

            const user = await GithubUser.search(username);
            console.log(user);
            if(user.login === undefined){
                throw Error('Usuário não encontrado.');
            }
            
            this.entries = [user, ...this.entries];
            this.update();
            this.save();

        }catch(error){
            alert(error.message);
        }
    }
}

// classe que vai criar a visualização de eventos HTML
export class FavoritesView extends Favorites{
    constructor(root){
        super(root)
        
        this.tbody = this.root.querySelector('table tbody');

        this.update();
        this.onadd();
    }   

    onadd(){
        const addButton = document.querySelector('.search button');

        addButton.onclick = () => {
            const { value } = document.querySelector('.search input');
            this.add(value);
        };
    }

    update(){
        this.removeAllTr();

        this.entries.forEach((user) => {
            const row = this.createRow();

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`;
            row.querySelector('.user img').alt = `Imagem de ${user.name}`;
            row.querySelector('.user p').textContent = user.name;
            row.querySelector('.user span').textContent = user.login;
            row.querySelector('.repositories').textContent = user.public_repos;
            row.querySelector('.followers').textContent = user.followers;
            row.querySelector('.user a').href = `https://github.com/${user.login}`;
            row.querySelector('.remove').onclick = () => {

                const isOk = confirm("Tem certeza que deseja remover o usuário?");

                if(isOk){
                    this.delete(user);
                }

            }
           
            this.tbody.append(row);
        })
    }

    createRow(){
        const tr = document.createElement('tr');

        tr.innerHTML = ` 
            <td class="user">
                <img src="https://github.com/gabuAlencar.png" alt="Uma imagem">
                    <a href="https://github.com/gabuAlencar" target="_blank">
                    <p>Gabu</p>
                    <span>/gabuAlencar</span>
                    </a>   
                </td>
            <td class="repositories">4</td>
            <td class="followers">3</td>
            <td class="remove"><button>Remover</button></td>
        `

        return tr;
    }

    removeAllTr(){
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove();
        })
    }
}