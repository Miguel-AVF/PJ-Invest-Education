// ---------------------------------------------------------------
// CarteiraDusk - utilitário compartilhado para salvar ativos
// ---------------------------------------------------------------
// Guarda os ativos salvos pelo visitante no localStorage do navegador
// (não depende de login/sessão). Usado por scripts/simulador.js
// (botão "Salvar na Carteira") e por carteira.php (listagem).
var CarteiraDusk = (function () {
    var CHAVE = 'dusk_carteira';

    function listar() {
        try {
            var dados = localStorage.getItem(CHAVE);
            return dados ? JSON.parse(dados) : [];
        } catch (erro) {
            console.error('Não foi possível ler a carteira salva.', erro);
            return [];
        }
    }

    function persistir(lista) {
        try {
            localStorage.setItem(CHAVE, JSON.stringify(lista));
            return true;
        } catch (erro) {
            console.error('Não foi possível salvar a carteira (localStorage indisponível ou cheio).', erro);
            return false;
        }
    }

    // Retorna true se salvou, false se já existia ou deu erro.
    function salvar(item) {
        var lista = listar();
        var jaExiste = lista.some(function (i) { return i.chave === item.chave; });
        if (jaExiste) return false;

        item.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
        item.dataSalvo = new Date().toISOString();
        lista.push(item);

        return persistir(lista);
    }

    function remover(id) {
        var lista = listar().filter(function (i) { return i.id !== id; });
        return persistir(lista);
    }

    return { listar: listar, salvar: salvar, remover: remover };
})();
