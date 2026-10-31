# Imposto de Renda Mínimo · Santos Resende Advocacia

Site estático de uma página sobre o imposto de renda mínimo (Lei 15.270/2025), com calculadora.
Não tem build nem dependências: os arquivos desta pasta são o site.

```
index.html            página
css/estilo.css        estilos
js/irm.js             núcleo do cálculo (funções puras, sem DOM)
js/calculadora.js     liga o formulário ao núcleo
img/                  logo, ícones e imagem de compartilhamento (Open Graph)
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
usam `https://santosresende.adv.br/`. Se o site for para outro endereço, troque em todos os arquivos:

```bash
grep -rl "santosresende.adv.br/" index.html robots.txt sitemap.xml | xargs sed -i 's#https://santosresende.adv.br/#https://NOVO-ENDERECO/#g'
```

(o e-mail `contato@santosresende.adv.br` não é alterado por esse comando.)

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
