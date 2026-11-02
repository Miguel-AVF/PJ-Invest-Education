(function () {
  'use strict';
  const form = document.getElementById('quiz-form');
  if (!form) return;
  const etapas = Array.from(form.querySelectorAll('.quiz-etapa'));
  const botaoAvancar = document.getElementById('quiz-avancar');
  const botaoVoltar = document.getElementById('quiz-voltar');
  const contador = document.getElementById('quiz-contador');
  const percentual = document.getElementById('quiz-percentual');
  const barra = document.getElementById('quiz-progresso-barra');
  const progresso = document.getElementById('quiz-progresso');
  const aviso = document.getElementById('quiz-aviso');
  let atual = 0;

  etapas.forEach((etapa, indice) => {
    etapa.querySelectorAll('input[type="radio"]').forEach(input => {
      input.addEventListener('change', () => {
        if (atual === indice) { aviso.hidden = true; botaoAvancar.disabled = false; }
      });
    });
  });

  function mostrarEtapa(indice) {
    atual = indice;
    etapas.forEach((etapa, i) => { etapa.hidden = i !== indice; });
    const numero = indice + 1;
    const pct = Math.round(numero / etapas.length * 100);
    contador.textContent = 'Pergunta ' + numero + ' de ' + etapas.length;
    percentual.textContent = pct + '%';
    barra.style.width = pct + '%';
    progresso.setAttribute('aria-valuenow', String(numero));
    botaoVoltar.hidden = indice === 0;
    botaoAvancar.textContent = indice === etapas.length - 1 ? 'Ver meu resultado ✨' : 'Próxima pergunta →';
    botaoAvancar.disabled = !etapas[indice].querySelector('input:checked');
    aviso.hidden = true;
    document.getElementById('quiz-cartao').scrollIntoView({behavior:'smooth',block:'start'});
  }

  function finalizar() {
    const dados = new FormData(form);
    let pontos = 0;
    for (let i = 1; i <= etapas.length; i++) {
      const valor = dados.get('q' + i);
      if (valor === null) { mostrarEtapa(i - 1); aviso.hidden = false; return; }
      pontos += Number(valor);
    }
    const perfil = pontos <= 8 ? 'Moderado' : pontos <= 16 ? 'Agressivo' : 'Arrojado';
    const textos = {
      Moderado: 'Você valoriza o equilíbrio entre segurança e crescimento. Diversificar e entender os riscos pode ajudar nas suas decisões.',
      Agressivo: 'Você demonstra disposição para aceitar oscilações em busca de maiores retornos. Planejamento e diversificação continuam essenciais.',
      Arrojado: 'Você demonstra alta tolerância a riscos e oscilações. É importante conhecer também a possibilidade de perdas significativas.'
    };
    try { localStorage.setItem('dusk_perfil_usuario_' + window.DUSK_USER_ID, perfil); }
    catch (erro) { console.warn('Não foi possível salvar o perfil neste navegador.', erro); }
    document.getElementById('quiz-cartao').hidden = true;
    const resultado = document.getElementById('quiz-resultado');
    resultado.hidden = false;
    resultado.innerHTML = '<div class="quiz-resultado-icone" aria-hidden="true">✦</div><span class="quiz-selo">Questionário concluído</span><h2>Seu perfil é <span>' + perfil + '</span>!</h2><p>' + textos[perfil] + '</p><div class="quiz-resultado-acoes"><a class="quiz-avancar" href="informa.php">Conhecer meu perfil no Informativo →</a><button type="button" class="quiz-voltar" id="quiz-refazer">Refazer questionário</button></div>';
    document.getElementById('quiz-refazer').addEventListener('click', () => {
      form.reset(); resultado.hidden = true;
      document.getElementById('quiz-cartao').hidden = false;
      mostrarEtapa(0);
    });
    resultado.scrollIntoView({behavior:'smooth',block:'start'});
  }

  botaoAvancar.addEventListener('click', () => {
    if (!etapas[atual].querySelector('input:checked')) { aviso.hidden = false; return; }
    if (atual < etapas.length - 1) mostrarEtapa(atual + 1);
    else finalizar();
  });
  botaoVoltar.addEventListener('click', () => { if (atual > 0) mostrarEtapa(atual - 1); });
  form.addEventListener('submit', evento => evento.preventDefault());
  mostrarEtapa(0);
})();
