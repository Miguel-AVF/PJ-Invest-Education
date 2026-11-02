<?php
if (session_status() !== PHP_SESSION_ACTIVE) session_start();
if (empty($_SESSION['id_user'])) { header('Location: login.php'); exit; }
?>
<!doctype html>
<html lang="pt-br"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Descubra seu perfil de investidor | PJ Invest Education</title><link rel="stylesheet" href="styles/style.css"></head>
<body class="quiz-body">
<main class="quiz-pagina" aria-labelledby="quiz-titulo">
 <div class="quiz-marca">✦ PJ INVEST EDUCATION</div>
 <div class="quiz-cabecalho"><span class="quiz-selo">Seu futuro começa aqui</span><h1 id="quiz-titulo">Descubra seu perfil de investidor</h1><p>Uma jornada de 12 perguntas para entender melhor sua relação com investimentos. Responda no seu ritmo.</p></div>
 <section class="quiz-cartao" id="quiz-cartao">
  <div class="quiz-progresso-cabecalho"><span id="quiz-contador">Pergunta 1 de 12</span><span id="quiz-percentual">8%</span></div>
  <div class="quiz-progresso" role="progressbar" aria-label="Progresso do questionário" aria-valuemin="0" aria-valuemax="12" aria-valuenow="1" id="quiz-progresso"><div id="quiz-progresso-barra"></div></div>
  <form id="quiz-form" novalidate>
   <fieldset class="quiz-etapa" hidden><legend class="quiz-pergunta">1. Qual é seu principal objetivo?</legend>
<label><input type="radio" name="q1" value="0" required> Preservar patrimônio</label>
<label><input type="radio" name="q1" value="1" required> Crescer com equilíbrio</label>
<label><input type="radio" name="q1" value="2" required> Maximizar ganhos</label>
</fieldset>
<fieldset class="quiz-etapa" hidden><legend class="quiz-pergunta">2. Por quanto tempo pretende investir?</legend>
<label><input type="radio" name="q2" value="0" required> Até 1 ano</label>
<label><input type="radio" name="q2" value="1" required> De 1 a 5 anos</label>
<label><input type="radio" name="q2" value="2" required> Mais de 5 anos</label>
</fieldset>
<fieldset class="quiz-etapa" hidden><legend class="quiz-pergunta">3. Como reagiria a uma queda de 15%?</legend>
<label><input type="radio" name="q3" value="0" required> Venderia para evitar perdas</label>
<label><input type="radio" name="q3" value="1" required> Avaliaria antes de agir</label>
<label><input type="radio" name="q3" value="2" required> Manteria ou compraria mais</label>
</fieldset>
<fieldset class="quiz-etapa" hidden><legend class="quiz-pergunta">4. Qual sua experiência?</legend>
<label><input type="radio" name="q4" value="0" required> Estou começando</label>
<label><input type="radio" name="q4" value="1" required> Conheço alguns produtos</label>
<label><input type="radio" name="q4" value="2" required> Tenho experiência ampla</label>
</fieldset>
<fieldset class="quiz-etapa" hidden><legend class="quiz-pergunta">5. Quanto de oscilação tolera?</legend>
<label><input type="radio" name="q5" value="0" required> Pouca</label>
<label><input type="radio" name="q5" value="1" required> Moderada</label>
<label><input type="radio" name="q5" value="2" required> Alta</label>
</fieldset>
<fieldset class="quiz-etapa" hidden><legend class="quiz-pergunta">6. Qual percentual manteria em renda variável?</legend>
<label><input type="radio" name="q6" value="0" required> Até 20%</label>
<label><input type="radio" name="q6" value="1" required> Entre 20% e 50%</label>
<label><input type="radio" name="q6" value="2" required> Acima de 50%</label>
</fieldset>
<fieldset class="quiz-etapa" hidden><legend class="quiz-pergunta">7. O que prioriza?</legend>
<label><input type="radio" name="q7" value="0" required> Segurança</label>
<label><input type="radio" name="q7" value="1" required> Equilíbrio</label>
<label><input type="radio" name="q7" value="2" required> Potencial de retorno</label>
</fieldset>
<fieldset class="quiz-etapa" hidden><legend class="quiz-pergunta">8. Se precisasse do dinheiro amanhã?</legend>
<label><input type="radio" name="q8" value="0" required> Preciso ter acesso imediato</label>
<label><input type="radio" name="q8" value="1" required> Tenho uma reserva separada</label>
<label><input type="radio" name="q8" value="2" required> Não precisarei desse dinheiro</label>
</fieldset>
<fieldset class="quiz-etapa" hidden><legend class="quiz-pergunta">9. Como escolhe investimentos?</legend>
<label><input type="radio" name="q9" value="0" required> Baixo risco</label>
<label><input type="radio" name="q9" value="1" required> Diversificação</label>
<label><input type="radio" name="q9" value="2" required> Oportunidades de maior risco</label>
</fieldset>
<fieldset class="quiz-etapa" hidden><legend class="quiz-pergunta">10. Qual perda temporária suportaria?</legend>
<label><input type="radio" name="q10" value="0" required> Até 5%</label>
<label><input type="radio" name="q10" value="1" required> Até 15%</label>
<label><input type="radio" name="q10" value="2" required> Acima de 15%</label>
</fieldset>
<fieldset class="quiz-etapa" hidden><legend class="quiz-pergunta">11. Como vê ativos voláteis?</legend>
<label><input type="radio" name="q11" value="0" required> Evito</label>
<label><input type="radio" name="q11" value="1" required> Aceito uma parcela</label>
<label><input type="radio" name="q11" value="2" required> Tenho bastante interesse</label>
</fieldset>
<fieldset class="quiz-etapa" hidden><legend class="quiz-pergunta">12. Qual estratégia prefere?</legend>
<label><input type="radio" name="q12" value="0" required> Estabilidade</label>
<label><input type="radio" name="q12" value="1" required> Misturar classes</label>
<label><input type="radio" name="q12" value="2" required> Buscar crescimento acelerado</label>
</fieldset>
   <p class="quiz-aviso" id="quiz-aviso" role="alert" hidden>Selecione uma resposta para continuar.</p>
   <div class="quiz-acoes"><button type="button" class="quiz-voltar" id="quiz-voltar" hidden>← Voltar</button><button type="button" class="quiz-avancar" id="quiz-avancar" disabled>Próxima pergunta →</button></div>
  </form>
 </section>
 <section id="quiz-resultado" class="quiz-resultado" aria-live="polite" hidden></section>
 <p class="quiz-rodape">Questionário educativo. O resultado não substitui a avaliação de adequação de investimentos (suitability).</p>
</main>
<script>window.DUSK_USER_ID = <?= json_encode($_SESSION['id_user']) ?>;</script><script src="scripts/quiz.js"></script></body></html>
