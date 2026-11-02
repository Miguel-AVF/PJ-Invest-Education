// Carteira isolada por conta neste navegador; sessão encerrada não expõe os itens.
var CarteiraDusk = (function () {
    var usuario = String(window.DUSK_USER_ID || '');
    var chave = usuario ? 'dusk_carteira_usuario_' + usuario : null;
    function listar() {
        if (!chave) return [];
        try { var dados = JSON.parse(localStorage.getItem(chave) || '[]'); return Array.isArray(dados) ? dados : []; }
        catch (erro) { console.error('Falha ao ler carteira', erro); return []; }
    }
    function persistir(itens) {
        if (!chave) return false;
        try { localStorage.setItem(chave, JSON.stringify(itens)); return true; }
        catch (erro) { console.error('Falha ao salvar carteira', erro); return false; }
    }
    function salvar(item) {
        if (!chave) return false;
        var itens = listar();
        if (itens.some(function (i) { return i.chave === item.chave; })) return false;
        item.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
        item.dataSalvo = new Date().toISOString();
        itens.push(item);
        return persistir(itens);
    }
    function remover(id) { return persistir(listar().filter(function (i) { return i.id !== id; })); }
    return { listar: listar, salvar: salvar, remover: remover, autenticado: function () { return !!chave; } };
})();
