/* Testes do núcleo de cálculo (js/irm.js). Rode com: npm test  (ou: node --test tests/irm.test.js) */
const test = require('node:test');
const assert = require('node:assert/strict');
const IRM = require('../js/irm.js');

const perto = (real, esperado, tol = 0.01) =>
  assert.ok(Math.abs(real - esperado) <= tol, `esperado ${esperado}, obtido ${real}`);
const semEspacos = (s) => s.replace(/\s/g, ' ');

test('aliquota: zero até R$ 600 mil', () => {
  assert.equal(IRM.aliquota(0), 0);
  assert.equal(IRM.aliquota(600000), 0);
});

test('aliquota: sobe em linha reta entre R$ 600 mil e R$ 1,2 milhão', () => {
  perto(IRM.aliquota(750000), 2.5);
  perto(IRM.aliquota(900000), 5);
  perto(IRM.aliquota(1050000), 7.5);
  assert.ok(IRM.aliquota(600001) > 0);
});

test('aliquota: fixa em 10% a partir de R$ 1,2 milhão', () => {
  assert.equal(IRM.aliquota(1200000), 10);
  assert.equal(IRM.aliquota(5000000), 10);
});

test('irTabela: isento até R$ 60 mil por ano (redutor de 2026)', () => {
  assert.equal(IRM.irTabela(0), 0);
  assert.equal(IRM.irTabela(29145.6), 0);
  assert.equal(IRM.irTabela(45000), 0);
  assert.equal(IRM.irTabela(60000), 0);
});

test('irTabela: redutor parcial entre R$ 60 mil e R$ 88,2 mil', () => {
  // 70.000 × 27,5% − 10.904,76 = 8.345,24; redutor = 8.429,73 − 0,095575 × 70.000 = 1.739,48
  perto(IRM.irTabela(70000), 6605.76);
  // no limite de R$ 88,2 mil o redutor praticamente zera
  perto(IRM.irTabela(88200), 13350.24, 0.02);
});

test('irTabela: tabela cheia acima de R$ 88,2 mil', () => {
  perto(IRM.irTabela(100000), 16595.24);
  perto(IRM.irTabela(120000), 22095.24);
});

test('calcular: sem valores, nada a pagar', () => {
  const r = IRM.calcular({});
  assert.equal(r.base, 0);
  assert.equal(r.minimo, 0);
  assert.equal(r.complemento, 0);
  assert.match(r.mensagem, /até R\$ 600 mil/);
});

test('calcular: renda até R$ 600 mil não tem imposto mínimo', () => {
  const r = IRM.calcular({ sal: 100000, dsr: 500000 });
  assert.equal(r.base, 600000);
  assert.equal(r.aliquota, 0);
  assert.equal(r.complemento, 0);
  assert.match(r.mensagem, /não se aplica/);
});

test('calcular: exemplo padrão da calculadora (R$ 120 mil de salário + R$ 900 mil de dividendos, empresa 15%)', () => {
  const r = IRM.calcular({ sal: 120000, alu: 0, dsr: 900000, dcr: 0, apl: 0, emp: 15 });
  assert.equal(r.base, 1020000);
  perto(r.aliquota, 7);
  perto(r.minimo, 71400);
  perto(r.irTabela, 22095.24);
  assert.equal(r.irAplicacoes, 0);
  assert.equal(r.retencao, 0);
  assert.equal(r.redutor, 0);            // 15% + 5,48% < 34%
  assert.equal(r.complemento, 49305);    // 71.400 − 22.095,24
  assert.match(r.mensagem, /não chega ao piso/);
});

test('calcular: aplicações pagam 15% e entram na base', () => {
  const r = IRM.calcular({ apl: 1200000 });
  assert.equal(r.irAplicacoes, 180000);
  assert.equal(r.minimo, 120000);
  assert.equal(r.complemento, 0);
  assert.match(r.mensagem, /cobre o mínimo/);
});

test('calcular: retenção de 10% nos dividendos é descontada do mínimo', () => {
  const r = IRM.calcular({ dcr: 1200000, emp: 0 });
  assert.equal(r.retencao, 120000);
  assert.equal(r.minimo, 120000);
  assert.equal(r.redutor, 0);
  assert.equal(r.complemento, 0);
  assert.match(r.mensagem, /cobre o mínimo/);
});

test('calcular: salário alto já cobre o piso pela tabela progressiva', () => {
  const r = IRM.calcular({ sal: 2000000 });
  assert.equal(r.aliquota, 10);
  assert.ok(r.irTabela > r.minimo);
  assert.equal(r.complemento, 0);
});

test('calcular: redutor zera o complemento quando a empresa já paga 34%', () => {
  const r = IRM.calcular({ dsr: 1200000, emp: 34 });
  assert.equal(r.minimo, 120000);
  assert.equal(r.redutor, 120000);
  assert.equal(r.complemento, 0);
  assert.match(r.mensagem, /redutor zera/);
});

test('calcular: redutor parcial quando a carga somada passa de 34%', () => {
  // 1,2 mi × (30% + 10% − 34%) = 72.000 de redutor; 120.000 − 72.000 = 48.000
  const r = IRM.calcular({ dsr: 1200000, emp: 30 });
  assert.equal(r.redutor, 72000);
  assert.equal(r.complemento, 48000);
  assert.match(r.mensagem, /redutor diminui/);
});

test('calcular: carga da empresa acima de 34% é limitada a 34%', () => {
  const a = IRM.calcular({ dsr: 1200000, emp: 34 });
  const b = IRM.calcular({ dsr: 1200000, emp: 50 });
  assert.deepEqual(b, a);
});

test('calcular: complemento nunca é negativo e o total fecha', () => {
  for (const v of [
    { sal: 300000, dsr: 700000, emp: 10 },
    { alu: 250000, apl: 400000, dcr: 600000, emp: 20 },
    { dsr: 3000000, emp: 25 },
  ]) {
    const r = IRM.calcular(v);
    assert.ok(r.complemento >= 0);
    assert.ok(r.redutor >= 0);
    assert.equal(r.complemento, Math.max(0, Math.round(r.minimo - r.pago - r.redutor)));
  }
});

test('reais: formata em reais sem centavos', () => {
  assert.equal(semEspacos(IRM.reais(49305)), 'R$ 49.305');
  assert.equal(semEspacos(IRM.reais(0)), 'R$ 0');
});

test('reaisCurto: mil e milhão', () => {
  assert.equal(semEspacos(IRM.reaisCurto(850000)), 'R$ 850 mil');
  assert.equal(semEspacos(IRM.reaisCurto(1020000)), 'R$ 1,02 mi');
});
