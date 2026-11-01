/* ===== Página: entradas das seções e o demonstrativo que acompanha os passos ===== */
(function(){
  var revela=document.querySelectorAll('[data-revela]');
  if(!('IntersectionObserver' in window)){revela.forEach(function(el){el.classList.add('dentro');});return;}

  /* cada parte entra uma vez, quando chega à tela */
  var io=new IntersectionObserver(function(entradas){entradas.forEach(function(e){
    if(e.isIntersecting){e.target.classList.add('dentro');io.unobserve(e.target);}});
  },{rootMargin:'0px 0px -10% 0px',threshold:0.1});
  revela.forEach(function(el){io.observe(el);});

  /* como funciona: o passo no centro da tela define o estado do demonstrativo */
  var demo=document.getElementById('demonstrativo'),passos=document.querySelectorAll('.passo');
  if(!demo||!passos.length)return;
  function ativa(n){passos.forEach(function(p){p.classList.toggle('ativo',p.dataset.passo===n);});
    demo.classList.remove('estado-1','estado-2','estado-3');demo.classList.add('estado-'+n);}
  ativa('1');
  var ioPasso=new IntersectionObserver(function(entradas){entradas.forEach(function(e){
    if(e.isIntersecting)ativa(e.target.dataset.passo);});
  },{rootMargin:'-45% 0px -45% 0px'});
  passos.forEach(function(p){ioPasso.observe(p);});
})();
