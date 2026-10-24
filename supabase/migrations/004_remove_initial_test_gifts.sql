-- Remove itens de teste antigos inseridos com emoji, inclusive os tres
-- registros que existiam no banco atual.
delete from public.gifts
where image_url like 'emoji:%';
