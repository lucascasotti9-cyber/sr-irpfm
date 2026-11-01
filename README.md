# Imposto de Renda Mínimo · Santos Resende Advocacia

Site estático de uma página sobre o imposto de renda mínimo (Lei 15.270/2025), com calculadora.
Não tem build nem dependências: os arquivos desta pasta são o site.

```
index.html            página
css/estilo.css        estilos
js/irm.js             núcleo do cálculo (funções puras, sem DOM)
js/calculadora.js     liga o formulário ao núcleo e move o ponto "você" na reta da lei
js/pagina.js          entradas das seções e os estados do demonstrativo em "Como funciona"
js/inicio.js          marca que o JavaScript está ativo (sem ele, todo o conteúdo aparece direto)
js/movimento.js       títulos por linha, frase com tinta, dígitos que rolam e a cena "A reta da lei"
img/                  logo (clara e escura), ícones e imagem de compartilhamento (Open Graph)
favicon.ico, apple-touch-icon.png, site.webmanifest
robots.txt, sitemap.xml
tests/irm.test.js     testes do núcleo do cálculo
vercel.json, netlify.toml
```

## Testes

Precisa de Node 18 ou mais recente. Não há nada para instalar.

```bash
npm test
```

## Ver localmente

```bash
npx serve .
```

Ou abra o `index.html` direto no navegador.

## Domínio

As URLs absolutas (canonical, Open Graph, dados estruturados, `robots.txt` e `sitemap.xml`)
usam `https://sr-irpfm.vercel.app/`. Quando o site passar para um domínio próprio, troque em todos os arquivos:

```bash
grep -rl "sr-irpfm.vercel.app/" index.html robots.txt sitemap.xml | xargs sed -i 's#https://sr-irpfm.vercel.app/#https://NOVO-ENDERECO/#g'
```

## Publicar

### Vercel
- Pelo site: suba esta pasta para um repositório no GitHub, depois em vercel.com faça **Add New → Project**,
  importe o repositório e clique em **Deploy**. Framework: *Other*, sem comando de build.
- Pela linha de comando: `npx vercel` (primeira vez, cria o projeto) e `npx vercel --prod`.

### Netlify
- Arrastar e soltar: em app.netlify.com, **Add new site → Deploy manually** e solte esta pasta.
- Pelo Git: **Add new site → Import an existing project**, escolha o repositório.
  O `netlify.toml` já define tudo; os testes rodam antes de cada publicação.
- Pela linha de comando: `npx netlify-cli deploy --prod --dir .`

Depois, em ambos, configure o domínio em **Settings → Domains** e aponte o DNS conforme as instruções do painel.
