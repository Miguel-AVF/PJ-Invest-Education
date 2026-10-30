# Configuração das APIs — PJ Invest Education

## Brapi (ações e FIIs)
1. Crie/acesse sua conta em https://brapi.dev e copie sua chave em Chaves de API.
2. Configure a chave no arquivo `scripts/api-config.js` (variável `BRAPI_TOKEN`) caso esteja usando a integração direta do navegador.
3. Não publique nem compartilhe a chave. Para uso em produção, prefira mover as chamadas para um proxy PHP no servidor.

O pacote não inclui uma chave real: tokens são pessoais e precisam ser emitidos pela sua conta.

## APIs adicionais
- Criptomoedas: AwesomeAPI (cotação).
- Indicadores de renda fixa: séries temporais do Banco Central do Brasil (SGS).

## Persistência da carteira
Os investimentos salvos ficam no `localStorage` do navegador, no dispositivo/navegador usado. Para persistência entre dispositivos/usuários, é necessário autenticação e banco de dados.

## Servidor local
Execute via Apache/PHP (por exemplo, XAMPP), não abrindo os arquivos PHP diretamente como `file://`.
