/* ===== Movimento: títulos por linha, tinta pela rolagem, dígitos que rolam e a cena "A reta da lei" =====
   Tudo aqui é acréscimo: sem JavaScript, ou com movimento reduzido, a página mostra o estado final. */
(function () {
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var temIO = 'IntersectionObserver' in window;

  /* --- títulos que sobem linha a linha (máscara), uma vez, ao entrar na tela --- */
  function titulos() {
    var els = [].slice.call(document.querySelectorAll('[data-linhas]'));
    if (!els.length || !temIO || reduzido) return;
    function devolve(el) { el.textContent = el.dataset.texto; el.classList.remove('partido', 'entrou'); }
    function parte(el) {
      var texto = el.textContent.trim().replace(/\s+/g, ' ');
      el.dataset.texto = texto; el.textContent = '';
      var palavras = texto.split(' ').map(function (p) {
        var s = document.createElement('span'); s.style.display = 'inline-block'; s.textContent = p; el.append(s, ' '); return s;
      });
      var linhas = [];
      palavras.forEach(function (w) {
        var ult = linhas[linhas.length - 1];
        if (ult && Math.abs(ult.top - w.offsetTop) < 4) ult.p.push(w.textContent); else linhas.push({ top: w.offsetTop, p: [w.textContent] });
      });
      el.textContent = '';
      linhas.forEach(function (l, i) {
        var m = document.createElement('span'), d = document.createElement('span');
        m.className = 'linha'; d.style.setProperty('--i', i); d.textContent = l.p.join(' ');
        m.append(d); el.append(m, ' ');
      });
      el.classList.add('partido');
    }
    function entra(el) {
      el.classList.add('entrou');
      var ult = el.querySelector('.linha:last-of-type > span');
      if (ult) ult.addEventListener('transitionend', function () { devolve(el); }, { once: true }); else devolve(el);
    }
    document.fonts.ready.then(function () { els.forEach(parte); quandoVisto(els, entra, 0); });
    var largura = innerWidth;
    addEventListener('resize', function () {
      if (innerWidth === largura) return; largura = innerWidth;
      els.filter(function (el) { return el.matches('.partido:not(.entrou)'); }).forEach(function (el) { el.classList.add('entrou'); devolve(el); });
    });
  }

  /* --- uma frase que ganha tinta palavra a palavra conforme sobe pela tela (só onde há scroll timeline) --- */
  function tinta() {
    if (reduzido || !(window.CSS && CSS.supports('animation-timeline: view()'))) return;
    document.querySelectorAll('[data-tinta]').forEach(function (el) {
      var ps = el.textContent.trim().split(/\s+/); el.textContent = '';
      ps.forEach(function (p, i) { var s = document.createElement('span'); s.textContent = p; el.append(s, i < ps.length - 1 ? ' ' : ''); });
      el.classList.add('tingindo');
    });
  }

  /* --- dígitos que rolam até o valor, uma vez; o número real fica no texto para leitores de tela --- */
  function rolam() {
    var els = [].slice.call(document.querySelectorAll('[data-rola]'));
    if (!els.length) return;
    els.forEach(function (el) {
      var valor = el.textContent.trim();
      var dito = document.createElement('span'); dito.className = 'so-leitor'; dito.textContent = valor;
      var visto = document.createElement('span'); visto.className = 'rola__digitos'; visto.setAttribute('aria-hidden', 'true');
      var i = 0;
      for (var k = 0; k < valor.length; k++) {
        var ch = valor[k];
        if (!/\d/.test(ch)) { visto.append(ch); continue; }
        var col = document.createElement('span'); col.className = 'rola__col';
        var fita = document.createElement('span'); fita.className = 'rola__fita';
        fita.style.setProperty('--d', ch); fita.style.setProperty('--i', i++);
        col.append(fita); visto.append(col);
      }
      el.classList.add('rola'); el.replaceChildren(dito, visto);
    });
    if (!temIO || reduzido) { els.forEach(function (el) { el.classList.add('entrou'); }); return; }
    quandoVisto(els, function (el) { el.classList.add('entrou'); }, 0.15);
  }

  /* --- a cena: a rolagem é a renda; a reta se desenha, o ponto sobe e a conta da lei muda ao vivo --- */
  function cenaReta() {
    var sec = document.querySelector('[data-scene="reta"]');
    if (!sec) return;
    if (reduzido || !window.IRM) { sec.classList.add('is-rest'); return; }
    var q = function (s) { return sec.querySelector(s); };
    var reta = q('[data-r-reta]'), cursor = q('[data-r-cursor]'), prumo = q('[data-r-prumo]');
    var oRenda = q('[data-r-renda]'), oAliq = q('[data-r-aliq]'), oConta = q('[data-r-conta]');
    var marcos = [].slice.call(sec.querySelectorAll('[data-marco]'));
    var MAX = 1500000, X0 = 56, LARG = 480, Y0 = 250, ESC = 21;
    var S1 = 192, S2 = Math.hypot(192, 210), S3 = 96, L = S1 + S2 + S3;
    var fmt = function (n, d) { return n.toLocaleString('pt-BR', { maximumFractionDigits: d || 0 }); };
    function renda(v) { var R = 'R$\u00a0'; return v === 0 ? R + '0' : v < 1e6 ? R + fmt(v / 1000) + '\u00a0mil' : R + fmt(v / 1e6, 2) + '\u00a0mi'; }
    function conta(v, a) {
      if (v <= 600000) return 'Até R$ 600 mil, a alíquota mínima é zero.';
      if (v >= 1200000) return 'A partir de R$ 1,2 milhão, a alíquota fica em 10%.';
      return fmt(v) + ' ÷ 60.000 = ' + fmt(v / 60000, 2) + '. Menos 10, a alíquota é ' + fmt(a, 2) + '%.';
    }
    reta.style.strokeDasharray = L;
    sec.classList.add('is-live');
    var ultimo = -1, pedido = false;
    function desenha() {
      pedido = false;
      var r = sec.getBoundingClientRect(), total = sec.offsetHeight - innerHeight;
      var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
      var t = Math.min(1, Math.max(0, (p - 0.06) / 0.84));
      var v = Math.round(t * MAX / 30000) * 30000;
      if (v === ultimo) return; ultimo = v;
      var a = IRM.aliquota(v), x = X0 + v / MAX * LARG, y = Y0 - a * ESC;
      var d = x <= 248 ? x - X0 : x <= 440 ? S1 + (x - 248) / 192 * S2 : S1 + S2 + (x - 440);
      reta.style.strokeDashoffset = (L - d).toFixed(1);
      cursor.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      prumo.setAttribute('y2', (Y0 - y).toFixed(1));
      marcos.forEach(function (m) { m.classList.toggle('passou', v >= +m.dataset.marco); });
      oRenda.textContent = renda(v);
      oAliq.textContent = fmt(a, 1);
      oConta.textContent = conta(v, a);
    }
    function pede() { if (!pedido) { pedido = true; requestAnimationFrame(desenha); } }
    addEventListener('scroll', pede, { passive: true });
    addEventListener('resize', function () { ultimo = -1; pede(); });
    desenha();
  }

  titulos(); tinta(); rolam(); cenaReta();
})();
