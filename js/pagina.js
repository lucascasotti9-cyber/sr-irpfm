/* ===== Página: entradas das seções e o demonstrativo que acompanha os passos ===== */

/* Chama fn(el) uma vez, quando el chega à tela. Além do IntersectionObserver, confere na rolagem
   quem já passou da linha: um salto de uma tela inteira (Page Down, links) não deixa nada escondido. */
window.quandoVisto = function (els, fn, folga) {
  folga = folga == null ? 0.1 : folga;
  var pendentes = [].slice.call(els);
  if (!pendentes.length) return;
  function feito(el) { var i = pendentes.indexOf(el); if (i < 0) return; pendentes.splice(i, 1); if (io) io.unobserve(el); fn(el); }
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) feito(e.target); });
  }, { rootMargin: '0px 0px -' + Math.round(folga * 100) + '% 0px', threshold: 0 }) : null;
  if (io) pendentes.forEach(function (el) { io.observe(el); });
  var pedido = false;
  function confere() {
    pedido = false;
    var limite = innerHeight * (1 - folga);
    pendentes.slice().forEach(function (el) { if (el.getBoundingClientRect().top < limite) feito(el); });
    if (!pendentes.length) removeEventListener('scroll', aoRolar);
  }
  function aoRolar() { if (!pedido) { pedido = true; requestAnimationFrame(confere); } }
  addEventListener('scroll', aoRolar, { passive: true });
  if (!io) confere();
};

(function(){
  quandoVisto(document.querySelectorAll('[data-revela]'), function (el) { el.classList.add('dentro'); });

  /* como funciona: o passo no centro da tela define o estado do demonstrativo */
  var demo=document.getElementById('demonstrativo'),passos=document.querySelectorAll('.passo');
  if(!demo||!passos.length||!('IntersectionObserver' in window))return;
  function ativa(n){passos.forEach(function(p){p.classList.toggle('ativo',p.dataset.passo===n);});
    demo.classList.remove('estado-1','estado-2','estado-3');demo.classList.add('estado-'+n);}
  ativa('1');
  var ioPasso=new IntersectionObserver(function(entradas){entradas.forEach(function(e){
    if(e.isIntersecting)ativa(e.target.dataset.passo);});
  },{rootMargin:'-45% 0px -45% 0px'});
  passos.forEach(function(p){ioPasso.observe(p);});
})();

/* sumário: destaca a seção que está sendo lida */
(function(){
  var links=[].slice.call(document.querySelectorAll('.sumario a'));
  if(!links.length||!('IntersectionObserver' in window))return;
  var porId={};links.forEach(function(a){porId[a.getAttribute('href').slice(1)]=a;});
  function marca(id){links.forEach(function(a){if(a===porId[id])a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)marca(e.target.id);});},{rootMargin:'-35% 0px -60% 0px'});
  Object.keys(porId).forEach(function(id){var s=document.getElementById(id);if(s)io.observe(s);});
})();
