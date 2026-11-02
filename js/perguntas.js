/* ===== Perguntas: abas por tema (mouse, toque e teclado) =====
   Sem JavaScript, as abas ficam ocultas e todas as categorias aparecem em sequência. */
(function () {
  var faq = document.querySelector('.faq');
  if (!faq) return;
  var lista = faq.querySelector('.faq__abas'), abas = [].slice.call(faq.querySelectorAll('.faq__aba'));
  var paineis = abas.map(function (a) { return document.getElementById(a.getAttribute('aria-controls')); });
  if (!lista || !abas.length) return;
  lista.hidden = false;
  faq.classList.add('com-abas');
  function seleciona(i, foca) {
    abas.forEach(function (a, k) {
      var ativa = k === i;
      a.setAttribute('aria-selected', ativa ? 'true' : 'false');
      a.tabIndex = ativa ? 0 : -1;
      paineis[k].hidden = !ativa;
      if (ativa) { paineis[k].classList.remove('entrando'); void paineis[k].offsetWidth; paineis[k].classList.add('entrando'); }
    });
    if (foca) abas[i].focus();
  }
  abas.forEach(function (a, i) {
    a.addEventListener('click', function () { seleciona(i, false); });
    a.addEventListener('keydown', function (e) {
      var n = abas.length, alvo = null;
      if (e.key === 'ArrowRight') alvo = (i + 1) % n;
      else if (e.key === 'ArrowLeft') alvo = (i - 1 + n) % n;
      else if (e.key === 'Home') alvo = 0;
      else if (e.key === 'End') alvo = n - 1;
      if (alvo !== null) { e.preventDefault(); seleciona(alvo, true); }
    });
  });
  seleciona(0, false);
})();
