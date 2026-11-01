/* ===== Calculadora: liga o formulário ao núcleo (js/irm.js) ===== */
(function(){var f=document.getElementById('calc-irm');if(!f)return;
  var ponto=f.querySelector('[data-o-ponto]'),anuncio=f.querySelector('[data-o-anuncio]');
  var reduzido=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var valores={},tempoAnuncio=0;
  function ler(el){return +String(el.value).replace(/\D/g,'')||0;}
  function formata(el){var n=ler(el);if(el.hasAttribute('data-pct'))n=Math.min(34,n);el.value=n.toLocaleString('pt-BR');}
  function el(k){return f.querySelector('[data-o="'+k+'"]');}
  function out(k,v){var e=el(k);if(e.textContent!==v){e.textContent=v;
    if(f.dataset.pronto&&!reduzido){e.classList.remove('muda');void e.offsetWidth;e.classList.add('muda');}}}
  /* valores em reais contam do número anterior até o novo, em meio segundo */
  function conta(k,novo){var e=el(k),de=valores[k];valores[k]=novo;
    if(!f.dataset.pronto||reduzido||de===undefined||de===novo){e.textContent=IRM.reais(novo);return;}
    var t0=performance.now(),dur=520,id=(e._id||0)+1;e._id=id;
    (function passo(t){if(e._id!==id)return;var k2=Math.min(1,(t-t0)/dur),s=1-Math.pow(1-k2,4);
      e.textContent=IRM.reais(Math.round(de+(novo-de)*s));if(k2<1)requestAnimationFrame(passo);})(t0);}
  /* posição na reta da lei: x de R$ 0 a R$ 1,5 mi, y de 0% a 10% (mesmas coordenadas do SVG) */
  function posiciona(base,aliq){if(!ponto)return;
    var x=48+Math.min(base,1500000)/1500000*488,y=190-aliq*16;
    ponto.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)';}
  function atualiza(){var v={};f.querySelectorAll('input').forEach(function(i){v[i.name]=ler(i);});
    var r=IRM.calcular(v);
    out('base',IRM.reaisCurto(r.base).replace(/ /g,'\u00a0'));out('aliq',r.aliquota.toLocaleString('pt-BR',{maximumFractionDigits:2})+'%');
    conta('min',r.minimo);conta('irt',r.irTabela);conta('ira',r.irAplicacoes);conta('ret',r.retencao);conta('red',r.redutor);conta('fim',r.complemento);
    out('msg',r.mensagem);
    f.querySelector('[data-o-box]').classList.toggle('zero',r.complemento===0);
    posiciona(r.base,r.aliquota);
    /* leitores de tela ouvem um resumo só, depois que a digitação para */
    if(anuncio&&f.dataset.pronto){clearTimeout(tempoAnuncio);tempoAnuncio=setTimeout(function(){
      anuncio.textContent='Complemento estimado: '+IRM.reais(r.complemento)+'. '+r.mensagem;},700);}}
  f.addEventListener('input',function(e){if(e.target.tagName==='INPUT'){formata(e.target);atualiza();}});
  f.addEventListener('submit',function(e){e.preventDefault();});
  atualiza();f.dataset.pronto='1';})();
