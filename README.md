# Chá de Casa Nova — Bruna e Lukas

HTML + CSS + JS puro (sem build). Abra a pasta no VS Code.

## 1. Rodar localmente
Instale a extensão **Live Server** → clique direito em `index.html` → *Open with Live Server*.

## 2. Supabase
1. Crie um projeto em supabase.com.
2. **SQL Editor** → rode `supabase/migrations/001_schema.sql`, depois `002_seed_gifts.sql` (cadastra os 40 presentes).
3. **Project Settings → API**: copie *Project URL* e a chave *anon/publishable* para `js/config.js`. Nunca use a `service_role`.
4. **Authentication → Users → Add user**: crie seu e-mail/senha de admin (marque *Auto Confirm*).
5. No SQL Editor, torne-o admin:
   `insert into public.admins select id from auth.users where email = 'SEU@EMAIL.COM';`
6. Abra `admin.html`, entre e gerencie convidados e presentes.

## 3. Editar dados do evento
Tudo (local, endereço, link do Maps, ano, versículo) fica em `js/config.js`.

## 4. Cadastrar itens
- Pelo `/admin` (aba PRESENTES): nome, categoria, descrição e imagem (URL ou `emoji:🎁`).
- Ou direto: Supabase → **Table Editor → gifts → Insert row**.
- Fotos próprias: Storage → bucket público `gifts` → upload → copie a URL pública em `image_url`.

## 5. Publicar
Netlify, Vercel ou Cloudflare Pages (arraste a pasta). Páginas: `index`, `localizacao`, `confirmar`, `presentes`, `admin` (.html).

## Visual (arco, folhagens, cores)
- Cores: variáveis no topo de `css/style.css` (`:root`).
- Arco: `.card::before` em `css/style.css`.
- Folhagens, ilustração do topo e utensílios do rodapé: arquivos em `img/` (SVG). Para usar aquarelas do Canva, exporte PNG/SVG com fundo transparente e substitua mantendo o nome (ou ajuste o caminho no CSS/HTML).
