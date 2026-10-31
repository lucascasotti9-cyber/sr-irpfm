/* ===== Calculadora: liga o formulário ao núcleo ===== */
(function(){var f=document.getElementById('calc-irm');if(!f)return;
  function ler(el){return +String(el.value).replace(/\D/g,'')||0;}
  function formata(el){var n=ler(el);if(el.hasAttribute('data-pct'))n=Math.min(34,n);el.value=n.toLocaleString('pt-BR');}
  function out(k,v){f.querySelector('[data-o="'+k+'"]').textContent=v;}
  function atualiza(){var v={};f.querySelectorAll('input').forEach(function(i){v[i.name]=ler(i);});
    var r=IRM.calcular(v),R=IRM.reais;
    out('base',IRM.reaisCurto(r.base));out('aliq',r.aliquota.toLocaleString('pt-BR',{maximumFractionDigits:2})+'%');out('min',R(r.minimo));
    out('irt',R(r.irTabela));out('ira',R(r.irAplicacoes));out('ret',R(r.retencao));out('red',R(r.redutor));out('fim',R(r.complemento));out('msg',r.mensagem);
    f.querySelector('[data-o-box]').classList.toggle('zero',r.complemento===0);}
  f.addEventListener('input',function(e){if(e.target.tagName==='INPUT'){formata(e.target);atualiza();}});
  f.addEventListener('submit',function(e){e.preventDefault();});
  atualiza();})();
