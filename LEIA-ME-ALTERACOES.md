# Atualizações implementadas

1. Todos os investimentos usam o gráfico de barras de evolução do saldo, no mesmo formato do Tesouro Direto. Para ações, FIIs e criptomoedas o gráfico exibe **somente aportes**, sem rentabilidade inventada.
2. Comparação entre ações e FIIs consulta ativos da mesma categoria individualmente, tolerando falhas parciais; informações específicas exibem cotação e dados retornados pela API.
3. Quiz educativo de 12 questões após cadastro, com resultados Moderado, Agressivo ou Arrojado e informações no Informativo. Perfil guardado por usuário neste navegador.
4. Carteira só salva com sessão autenticada e utiliza chave localStorage por id do usuário; logout oculta os dados, login restaura-os no mesmo navegador. Não sincroniza entre dispositivos e limpar dados do navegador apaga a carteira.
5. Referência do documento de texto: uniformização dos gráficos e comparações para ações, FIIs e criptomoedas.
6. Brapi acessada pelo proxy PHP api/brapi.php, que lê token do servidor; falhas retornam status apropriados. Outras APIs públicas dependem de disponibilidade e permissões CORS externas.

## Para executar

- Coloque a pasta em um servidor Apache/PHP com MySQL, extensão cURL e acesso HTTPS.
- Importe sql/DB_dusk.sql e ajuste config/database.php.
- Configure BRAPI_TOKEN em variável de ambiente ou config/brapi.local.php. **Revogue o token antigo que já esteve exposto em JavaScript.**
- Teste cadastro, quiz, login, logout, carteira e consultas externas em seu ambiente.
- Não foi possível realizar teste ponta a ponta com MySQL e APIs reais neste ambiente.
