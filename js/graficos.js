/* ===== Gráficos: dica sobre cada ponto (mouse, toque ou teclado) =====
   Cada ponto traz o texto completo no aria-label; a dica é só o reforço visual. */
(function () {
  document.querySelectorAll('[data-dica]').forEach(function (grafico) {
    var area = grafico.querySelector('.grafico__area'), dica = grafico.querySelector('.dica');
    if (!area || !dica) return;
    var atual = null, abertaEm = 0;
    function mostra(ponto) {
      if (atual !== ponto) abertaEm = Date.now();
      atual = ponto;
      dica.innerHTML = '<b>' + ponto.dataset.dicaRenda + '</b>' +
        '<span><i class="dica__cor"></i>Alíquota mínima<strong>' + ponto.dataset.dicaAliq + '</strong></span>' +
        '<span><i class="dica__cor dica__cor--escura"></i>Imposto mínimo<strong>' + ponto.dataset.dicaImposto + '</strong></span>';
      var caixa = area.getBoundingClientRect(), alvo = ponto.querySelector('.rampa__bolinha').getBoundingClientRect();
      dica.classList.add('visivel');
      var w = dica.offsetWidth, h = dica.offsetHeight;
      var x = alvo.left + alvo.width / 2 - caixa.left - w / 2;
      var y = alvo.top - caixa.top - h - 14;
      if (y < 0) y = alvo.bottom - caixa.top + 14;
      x = Math.max(0, Math.min(caixa.width - w, x));
      dica.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)';
      grafico.querySelectorAll('.rampa__marco').forEach(function (m) { m.classList.toggle('ativo', m === ponto); });
    }
    function esconde() { atual = null; dica.classList.remove('visivel'); grafico.querySelectorAll('.rampa__marco.ativo').forEach(function (m) { m.classList.remove('ativo'); }); }
    grafico.querySelectorAll('.rampa__marco').forEach(function (p) {
      p.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') mostra(p); });
      p.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') esconde(); });
      p.addEventListener('focus', function () { mostra(p); });
      p.addEventListener('blur', esconde);
      /* no toque, o foco abre a dica logo antes do clique: o clique só fecha se a dica já estava aberta antes */
      p.addEventListener('click', function () { if (atual === p && Date.now() - abertaEm > 400) esconde(); else mostra(p); });
      p.addEventListener('keydown', function (e) { if (e.key === 'Escape') { esconde(); p.blur(); } });
    });
    document.addEventListener('pointerdown', function (e) { if (atual && !grafico.contains(e.target)) esconde(); });
    addEventListener('resize', function () { if (atual) mostra(atual); });
  });
})();
