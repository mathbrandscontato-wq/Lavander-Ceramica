import {validateCatalog} from './catalog.mjs';

// Consulta pública APENAS a documentos publicados e com aprovação editorial.
// O projeto Sanity possui dataset público: não colocar segredos ou dados privados.
export const PUBLIC_PRODUCTS_QUERY = `*[
  _type == "product" &&
  publicationStatus == "approved" &&
  !(_id in path("drafts.**"))
] | order(sortOrder asc, name asc) {
  productId,
  "slug": slug.current,
  name,
  "categoryId": category->slug.current,
  "images": images[]{ "url": asset->url, alt },
  publicationStatus,
  approvalSource,
  priceMode,
  priceAmount,
  "currency": "BRL",
  tags,
  "collectionIds": collections[]->slug.current,
  stockStatus,
  personalizable,
  "allowedModelIds": allowedModels[]->productId,
  sortOrder
}`;

export function publicCatalogEndpoint({projectId,dataset='production',query=PUBLIC_PRODUCTS_QUERY}) {
  if (!/^[a-z0-9]+$/.test(projectId||'')) throw new Error('Project ID público inválido.');
  if (!/^[a-zA-Z0-9_-]+$/.test(dataset||'')) throw new Error('Dataset público inválido.');
  return `https://${projectId}.api.sanity.io/v2025-02-19/data/query/${dataset}?query=${encodeURIComponent(query)}`;
}

export async function fetchApprovedProducts({
  projectId='t4nkzeaq',
  dataset='production',
  fetchImpl=fetch,
}={}) {
  const url=publicCatalogEndpoint({projectId,dataset});
  const response=await fetchImpl(url,{headers:{Accept:'application/json'}});
  if (!response.ok) throw new Error(`Sanity indisponível (HTTP ${response.status}).`);
  const data=await response.json();
  if (!Array.isArray(data?.result)) throw new Error('Resposta de catálogo inválida.');
  return validateCatalog(data.result);
}
