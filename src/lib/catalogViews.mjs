/**
 * Projeções puras de catálogo. A fonte é sempre um catálogo já validado.
 * Nenhuma decisão visual (4+5, grid mobile ou paginação) é tomada aqui.
 */
function finiteSortOrder(product) {
  return typeof product.sortOrder === 'number' &&
    Number.isFinite(product.sortOrder)
    ? product.sortOrder : Number.MAX_SAFE_INTEGER;
}

export function sortProducts(products) {
  return [...products].sort((a,b) =>
    finiteSortOrder(a) - finiteSortOrder(b) ||
    String(a.name).localeCompare(String(b.name),'pt-BR',{sensitivity:'base'}) ||
    String(a.productId).localeCompare(String(b.productId),'pt-BR')
  );
}

/** Filtra por campos oficiais; nunca por palavras improvisadas do nome. */
export function filterProducts(products,{categoryId,collectionId,tag}={}) {
  return products.filter(product => {
    if (categoryId && product.categoryId !== categoryId) return false;
    if (collectionId && !(Array.isArray(product.collectionIds) && product.collectionIds.includes(collectionId))) return false;
    if (tag && !(Array.isArray(product.tags) && product.tags.includes(tag))) return false;
    return true;
  });
}

export function catalogFacets(products) {
  return [...new Set(products.map(item=>item.categoryId).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
}
