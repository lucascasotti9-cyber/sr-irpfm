/* ===== Calculadora: liga o formulário ao núcleo (js/irm.js) ===== */
(function(){var f=document.getElementById('calc-irm');if(!f)return;
  var ponto=f.querySelector('[data-o-ponto]');
  function ler(el){return +String(el.value).replace(/\D/g,'')||0;}
  function formata(el){var n=ler(el);if(el.hasAttribute('data-pct'))n=Math.min(34,n);el.value=n.toLocaleString('pt-BR');}
  function out(k,v){var el=f.querySelector('[data-o="'+k+'"]');if(el.textContent!==v){el.textContent=v;
    if(el.isConnected&&f.dataset.pronto){el.classList.remove('muda');void el.offsetWidth;el.classList.add('muda');}}}
  /* posição na reta da lei: x de R$ 0 a R$ 1,5 mi, y de 0% a 10% (mesmas coordenadas do SVG) */
  function posiciona(base,aliq){if(!ponto)return;
    var x=48+Math.min(base,1500000)/1500000*488,y=190-aliq*16;
    ponto.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px)';}
  function atualiza(){var v={};f.querySelectorAll('input').forEach(function(i){v[i.name]=ler(i);});
    var r=IRM.calcular(v),R=IRM.reais;
    out('base',IRM.reaisCurto(r.base));out('aliq',r.aliquota.toLocaleString('pt-BR',{maximumFractionDigits:2})+'%');out('min',R(r.minimo));
    out('irt',R(r.irTabela));out('ira',R(r.irAplicacoes));out('ret',R(r.retencao));out('red',R(r.redutor));out('fim',R(r.complemento));out('msg',r.mensagem);
    f.querySelector('[data-o-box]').classList.toggle('zero',r.complemento===0);
    posiciona(r.base,r.aliquota);}
  f.addEventListener('input',function(e){if(e.target.tagName==='INPUT'){formata(e.target);atualiza();}});
  f.addEventListener('submit',function(e){e.preventDefault();});
  atualiza();f.dataset.pronto='1';})();
