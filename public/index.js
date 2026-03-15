
listar();

function novo() {
    document.getElementById("conteudo").style.display = "none";
    document.getElementById("formulario").style.display = "block";
    document.getElementById("txtnome").value = "";
    document.getElementById("txttelefone").value = "";
    document.getElementById("txtid").value = "";
    document.getElementById("txtemail").value = "";
}

function salvar() {

    const id = document.getElementById("txtid").value;

    if (id == "") {
        inserir();
    } else {
        atualizar();
    }
}


async function listar() {
    document.getElementById("conteudo").innerHTML = "aguarde...";

    const resp = await fetch("/pessoa");

    const dados = await resp.json();

     let tabela = `
    <table class="table table-striped">
    <thead>
    <tr>
    <th>Nome</th>
    <th>Telefone</th>
    <th>Email</th>
    <th>Ações</th>
    </tr>
    </thead>
    <tbody>
    `;

    for (let i=0; i<dados.length; i++) {
        tabela += `<tr>
                        <td>${dados[i].nome}</td>
                        <td>${dados[i].telefone}</td>
                        <td>${dados[i].email}</td>
                        <td> <button class="btn btn-warning btn-sm"
                                 onclick="editar(${dados[i].idpessoa})">
                                Editar
                            </button>

                            <button class="btn btn-danger btn-sm"
                                onclick="excluir(${dados[i].idpessoa})">
                                Excluir
                            </button>
                        </td>
                   </tr>`;
    }
    tabela += "</tbody></table>";


    document.getElementById("conteudo").innerHTML = tabela;
}

// async function consultar() {
//     document.getElementById("conteudo").innerHTML = "aguarde...";

//     const resp = await fetch("/pessoa/222", {
//         method: "GET",
//         headers: {
//             "Content-Type" : "application/json"
//         }
//     });

//     if (!resp.ok) {
//         console.log("erro "+resp.status);
//     }

//     //se fosse JSON, converte a resposta pra JSON
//     //const dados = await resp.json();
//     const retorno = await resp.text();

//     document.getElementById("conteudo").innerHTML = retorno;
// }

async function inserir() {
    document.getElementById("conteudo").innerHTML = "aguarde...";

    const novo = {
        nome: document.getElementById("txtnome").value,
        telefone: document.getElementById("txttelefone").value,
        email: document.getElementById("txtemail").value
    };

    await fetch("/pessoa", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(novo)
    });

    document.getElementById("conteudo").style.display = "block";
    document.getElementById("formulario").style.display = "none";
    listar();
}

async function atualizar() {
    const id = document.getElementById("txtid").value;

    const dados = {

        nome: document.getElementById("txtnome").value,
        telefone: document.getElementById("txttelefone").value,
        email: document.getElementById("txtemail").value

    };

    await fetch("/pessoa/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    document.getElementById("conteudo").style.display = "block";
    document.getElementById("formulario").style.display = "none";

    listar();
}

async function editar(id) {

    const resp = await fetch("/pessoa/" + id);

    const dados = await resp.json();

    document.getElementById("txtid").value = dados.idpessoa;
    document.getElementById("txtnome").value = dados.nome;
    document.getElementById("txttelefone").value = dados.telefone;
    document.getElementById("txtemail").value = dados.email;

    document.getElementById("conteudo").style.display = "none";
    document.getElementById("formulario").style.display = "block";
}

async function excluir(id) {
    if (!confirm("Deseja excluir essa pessoa?")) return;

    await fetch("/pessoa/" + id, {
        method: "DELETE"
    });

    listar();
}
