(function(){
 var el=document.getElementById('perfil-investidor'); if(!el) return;
 var id=window.DUSK_USER_ID;
 if(!id) {el.innerHTML='<h2>Perfil de investidor</h2><p>Entre ou cadastre-se para responder ao questionário.</p><a href="login.php">Entrar</a>';return;}
 var perfil=localStorage.getItem('dusk_perfil_usuario_'+id);
 if(!perfil) {el.innerHTML='<h2>Perfil de investidor</h2><p>Responda às 12 perguntas para conhecer seu perfil educativo.</p><a href="quiz.php">Responder quiz</a>';return;}
 var textos={Moderado:'Busca equilibrar segurança e potencial de retorno, combinando produtos de diferentes riscos.',Agressivo:'Aceita oscilações relevantes para buscar maior potencial de retorno, mantendo atenção à diversificação.',Arrojado:'Tolera oscilações e riscos elevados visando crescimento de longo prazo; perdas significativas são possíveis.'};
 el.innerHTML='<h2>Seu perfil: '+perfil+'</h2><p>'+textos[perfil]+'</p><button type="button" id="saiba-mais-perfil">Saiba mais</button><div id="detalhe-perfil" hidden><p><strong>Moderado:</strong> equilíbrio entre estabilidade e crescimento.</p><p><strong>Agressivo:</strong> maior exposição a risco e variação de preços.</p><p><strong>Arrojado:</strong> elevada tolerância a perdas e horizonte mais longo.</p><p>Perfis educativos não são recomendações de investimento.</p><a href="quiz.php">Refazer questionário</a></div>';
 document.getElementById('saiba-mais-perfil').addEventListener('click',function(){var d=document.getElementById('detalhe-perfil');d.hidden=!d.hidden;});
})();