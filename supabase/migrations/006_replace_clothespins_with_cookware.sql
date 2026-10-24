-- Substitui o presente dos pregadores pelo jogo de panelas solicitado.
-- O UPDATE preserva o ID e qualquer reserva existente associada ao presente.
update public.gifts
set name = 'Jogo de Panelas 10 Peças Preto Antiaderente c/Tampa de Vidro e Utensílios',
    description = 'Conjunto com 10 peças, tampas de vidro e utensílios.',
    category = 'Cozinha',
    image_url = 'https://m.media-amazon.com/images/I/51LRfEFCSlL._AC_SY450_.jpg'
where name = 'Kit 60 Pregadores de Madeira Roupa Águia Branca';
