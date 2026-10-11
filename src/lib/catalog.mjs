/**
 * Contrato puro do catálogo. Não realiza chamadas externas nem cria pedidos.
 * Apenas documentos revisados são elegíveis para a vitrine pública.
 * IMPORTANTE: status de aprovação não é autorização para publicar um documento
 * incompleto em um dataset público do CMS.
 */
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function text(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateCatalog(products) {
  if (!Array.isArray(products)) throw new TypeError('O catálogo deve ser uma lista.');
  const ids = new Set();
  const slugs = new Set();
  const published = [];

  for (const item of products) {
    if (!item || item.publicationStatus !== 'approved') continue;

    if (!text(item.productId)) throw new Error('Produto aprovado sem productId.');
    if (!text(item.name)) throw new Error(`Produto ${item.productId} sem nome aprovado.`);
    if (!text(item.slug) || !slugPattern.test(item.slug))
      throw new Error(`Slug inválido no produto ${item.productId}.`);
    if (ids.has(item.productId) || slugs.has(item.slug))
      throw new Error(`ID ou slug duplicado: ${item.productId}.`);
    ids.add(item.productId);
    slugs.add(item.slug);

    if (!text(item.categoryId))
      throw new Error(`Categoria não confirmada: ${item.productId}.`);
    if (!Array.isArray(item.images) || item.images.length < 1 ||
        item.images.some(image => !text(image?.url) || !text(image?.alt)))
      throw new Error(`Imagens/alternativas incompletas: ${item.productId}.`);

    if (item.priceMode === 'fixed') {
      if (typeof item.priceAmount !== 'number' ||
          !Number.isFinite(item.priceAmount) || item.priceAmount <= 0)
        throw new Error(`Preço fixo não validado: ${item.productId}.`);
      if (item.currency !== 'BRL')
        throw new Error(`Moeda não validada: ${item.productId}.`);
    } else if (item.priceMode !== 'on_request') {
      throw new Error(`Modo de preço pendente: ${item.productId}.`);
    }

    published.push(item);
  }
  return published;
}
