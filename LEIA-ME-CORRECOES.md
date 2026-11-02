# Correções de 02/11/2026

1. index.php: removida chamada duplicada a session_start (o menu já inicia a sessão).
2. Simulador: o gráfico de evolução de aportes no formato do Tesouro é exibido para criptomoedas, ações, FIIs, CDB, LCI, LCA e Tesouro; quando uma API falha, o gráfico de aportes continua disponível, sem fingir rentabilidade.
3. Carteira: antes de salvar, o navegador consulta config/verificar-sessao.php, que valida a sessão PHP no servidor. Usuários sem login são direcionados à página de login. A página carteira.php também exige sessão.
4. Atualizados os endereços dos scripts para evitar cache antigo.

IMPORTANTE: extraia todo o ZIP substituindo os arquivos antigos no htdocs do XAMPP. Não abra os arquivos diretamente por file://. É necessário iniciar Apache e MySQL. Limpe o cache do navegador com Ctrl+F5. A carteira continua no localStorage por conta e navegador, não sincroniza entre dispositivos. Não foi possível realizar teste de ponta a ponta no seu servidor MySQL nem nas APIs externas.
