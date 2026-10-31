/* ===== Núcleo do cálculo (Lei 15.270/2025): funções puras, reaproveitáveis em qualquer site ===== */
var IRM=(function(){
  /* tabela progressiva anual (12 x tabela mensal vigente) com o redutor anual de 2026 (art. 11-A da Lei 9.250/1995) */
  function irTabela(r){var ir;
    if(r<=29145.60)ir=0;else if(r<=33919.80)ir=r*.075-2185.92;else if(r<=45012.60)ir=r*.15-4729.92;else if(r<=55976.16)ir=r*.225-8105.88;else ir=r*.275-10904.76;
    if(r<=60000)ir=0;else if(r<=88200)ir-=Math.max(0,8429.73-.095575*r);return Math.max(0,ir);}
  /* alíquota mínima em % (art. 16-A, § 2º) */
  function aliquota(b){return b>=1200000?10:(b>600000?b/60000-10:0);}
  /* valores em reais por ano; emp = carga efetiva de IRPJ+CSLL da empresa, em % */
  function calcular(v){
    var sal=v.sal||0,alu=v.alu||0,dsr=v.dsr||0,dcr=v.dcr||0,apl=v.apl||0,emp=Math.min(34,v.emp||0);
    var div=dsr+dcr,outros=sal+alu+apl,base=outros+div,al=aliquota(base),minimo=base*al/100;
    var irT=irTabela(sal+alu),irA=apl*.15,ret=dcr*.10,pagoSemDiv=irT+irA,pago=pagoSemDiv+ret;
    /* redutor (art. 16-B): alíquota efetiva da empresa + acréscimo do IRPFm causado pelos dividendos, acima de 34% */
    var minSem=outros*aliquota(outros)/100,acr=Math.max(0,minimo-pagoSemDiv)-Math.max(0,minSem-pagoSemDiv),tpf=div>0?acr/div:0;
    var red=div>0?Math.max(0,div*(emp/100+tpf-.34)):0;red=Math.round(Math.min(red,Math.max(0,minimo-pago)));
    var compl=Math.max(0,Math.round(minimo-pago-red)),msg;
    if(base<=600000)msg='Com renda de até R$ 600 mil na base, o imposto mínimo não se aplica.';
    else if(compl===0&&red>0)msg='O redutor zera o complemento: a empresa e o sócio, somados, já chegam ao limite de 34%.';
    else if(compl===0)msg='O imposto já pago no ano cobre o mínimo. Não há complemento a pagar.';
    else if(red>0)msg='O redutor diminui o complemento porque a carga somada da empresa e do sócio passa de 34%.';
    else msg='O imposto pago no ano não chega ao piso. A diferença será paga na declaração de 2027.';
    return {base:base,aliquota:al,minimo:minimo,irTabela:irT,irAplicacoes:irA,retencao:ret,pago:pago,redutor:red,complemento:compl,mensagem:msg};}
  function reais(x){return x.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});}
  function reaisCurto(x){return x>=1e6?'R$ '+(x/1e6).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})+' mi':'R$ '+Math.round(x/1000).toLocaleString('pt-BR')+' mil';}
  return {irTabela:irTabela,aliquota:aliquota,calcular:calcular,reais:reais,reaisCurto:reaisCurto};})();

/* exporta para os testes em Node; no navegador, IRM fica global */
if(typeof module!=='undefined'&&module.exports)module.exports=IRM;
