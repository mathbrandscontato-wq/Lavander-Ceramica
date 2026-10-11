import type {DocumentActionComponent} from 'sanity';

type EditorialDocument = Record<string, unknown>;

function nonEmpty(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function readyForPublish(document: EditorialDocument, type: string): boolean {
  if (type === 'siteContent') {
    return document.editorialStatus === 'approved' &&
      nonEmpty(document.approvalSource) &&
      nonEmpty(document.manifestoCopy);
  }
  if (type !== 'product') return true;

  const imageList = Array.isArray(document.images) ? document.images : [];
  const category = document.category as {_ref?: string} | undefined;
  const slug = document.slug as {current?: string} | undefined;

  const approvedPrice = document.priceMode === 'on_request' || (
    document.priceMode === 'fixed' &&
    typeof document.priceAmount === 'number' &&
    Number.isFinite(document.priceAmount) &&
    document.priceAmount > 0
  );

  return document.publicationStatus === 'approved' &&
    nonEmpty(document.approvalSource) &&
    nonEmpty(document.productId) &&
    nonEmpty(document.name) &&
    nonEmpty(slug?.current) &&
    nonEmpty(category?._ref) &&
    approvedPrice &&
    imageList.length > 0 &&
    imageList.every((image: {_key?: string; asset?: {_ref?: string}; alt?: string}) =>
      nonEmpty(image?.asset?._ref) && nonEmpty(image?.alt)
    );
}

/**
 * Proteção editorial na interface do Studio:
 * o botão padrão de Publicar só fica habilitado para documentos aprovados.
 * Não é controle de acesso ao Content Lake/API. Drafts são fundamentais:
 * um documento publicado no dataset público pode ser lido por terceiros.
 */
export function guardPublishAction(
  originalAction: DocumentActionComponent,
  type: string,
): DocumentActionComponent {
  const GuardedPublishAction: DocumentActionComponent = (props) => {
    const result = originalAction(props);
    if (!result) return result;

    const current = (props.draft ?? props.published ?? {}) as EditorialDocument;
    const allowed = readyForPublish(current, type);

    return {
      ...result,
      label: allowed ? result.label : 'Revisar antes de publicar',
      title: allowed ? result.title : 'Complete os dados obrigatórios e registre a aprovação editorial.',
      disabled: allowed ? result.disabled : true,
      onHandle: () => {
        if (allowed) result.onHandle?.();
      },
    };
  };
  return GuardedPublishAction;
}
