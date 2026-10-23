/**
 * M2g - CONTRATO EXPERIMENTAL, não é endpoint nem plugin de pagamentos.
 * Nunca importar para bundles públicos; usa node:crypto e segredo apenas no servidor.
 * Verificar a assinatura não confirma a liquidação do pagamento.
 *
 * Fonte: Mercado Pago Webhooks, data.id na URL, headers x-request-id/x-signature.
 */
import {createHmac, timingSafeEqual} from 'node:crypto';

export class PaymentContractError extends Error {
  constructor(code){ super(code); this.code=code; }
}
const nonBlank = value => typeof value==='string' && value.length>0;
const validToken = value => nonBlank(value) && /^[a-zA-Z0-9._:-]{1,128}$/.test(value);

export function verifyMercadoPagoSignature({
  dataId, requestId, xSignature, secret, nowMs=Date.now(), toleranceMs=5*60*1000
}={}){
  if(!validToken(dataId)||!validToken(requestId)||!nonBlank(secret)||
     !nonBlank(xSignature)) throw new PaymentContractError('SIGNATURE_INPUT_INVALID');
  if(!Number.isFinite(nowMs)||!Number.isFinite(toleranceMs)||toleranceMs<0)
    throw new PaymentContractError('SIGNATURE_TIME_INVALID');
  const parts=Object.create(null);
  for(const part of xSignature.split(',')){
    const [name,value,...extra]=part.trim().split('=');
    if(extra.length||!['ts','v1'].includes(name)||Object.hasOwn(parts,name)||
       !value) throw new PaymentContractError('SIGNATURE_FORMAT_INVALID');
    parts[name]=value;
  }
  if(!/^\d{10}$|^\d{13}$/.test(parts.ts||'') ||
     !/^[a-fA-F0-9]{64}$/.test(parts.v1||''))
    throw new PaymentContractError('SIGNATURE_FORMAT_INVALID');
  // Documentação do provedor apresenta exemplos em segundos e milissegundos.
  const timestamp=Number(parts.ts)*(parts.ts.length===10?1000:1);
  if(Math.abs(nowMs-timestamp)>toleranceMs)
    throw new PaymentContractError('SIGNATURE_EXPIRED');
  const manifest='id:'+dataId.toLowerCase()+';request-id:'+requestId+';ts:'+parts.ts+';';
  const digest=createHmac('sha256',secret).update(manifest).digest();
  const actual=Buffer.from(parts.v1,'hex');
  if(!timingSafeEqual(digest,actual))
    throw new PaymentContractError('SIGNATURE_INVALID');
  return Object.freeze({
    authenticated:true, resourceId:dataId, requestId,
    receivedAtMs:timestamp, requireProviderFetch:true,
    paymentConfirmed:false, validatedScope:'signature_only'
  });
}

/**
 * APENAS política de pré-validação de uma resposta sintética, sem mutar pedidos.
 * Uma notificação assinada exige ainda consulta autenticada ao provedor,
 * consistência Woo e idempotência durable em banco antes de fulfillment.
 */
export function assessPaymentAfterProviderRequery({
  orderStatus, paymentStatus, paymentAmountCents, expectedTotalCents,
  currency, externalReferenceMatches, skuReservedForOrder,
  alreadyAssignedToAnotherOrder=false
}={}){
  const base={autoFulfill:false, modifiesOrder:false,
    requiresDurableIdempotency:true, requiresProviderRequery:true};
  if(!Number.isSafeInteger(expectedTotalCents)||expectedTotalCents<=0||
     !Number.isSafeInteger(paymentAmountCents)||paymentAmountCents<0||
     currency!=='BRL'||externalReferenceMatches!==true)
    return Object.freeze({...base,decision:'MANUAL_RECONCILIATION',reason:'PAYMENT_MISMATCH'});
  if(paymentStatus==='pending'||paymentStatus==='in_process')
    return Object.freeze({...base,decision:'WAIT',reason:'NOT_SETTLED'});
  if(paymentStatus==='rejected'||paymentStatus==='cancelled')
    return Object.freeze({...base,decision:'NO_FULFILLMENT',reason:'NOT_APPROVED'});
  if(paymentStatus!=='approved')
    return Object.freeze({...base,decision:'MANUAL_RECONCILIATION',reason:'UNKNOWN_PROVIDER_STATE'});
  if(paymentAmountCents!==expectedTotalCents)
    return Object.freeze({...base,decision:'MANUAL_RECONCILIATION',reason:'AMOUNT_MISMATCH'});
  if(['cancelled','refunded','failed','completed'].includes(orderStatus)||
     alreadyAssignedToAnotherOrder===true||skuReservedForOrder!==true)
    return Object.freeze({...base,decision:'MANUAL_RECONCILIATION',reason:'STALE_OR_REALLOCATED'});
  if(!['pending','on-hold'].includes(orderStatus))
    return Object.freeze({...base,decision:'MANUAL_RECONCILIATION',reason:'UNEXPECTED_ORDER_STATE'});
  return Object.freeze({...base,decision:'ELIGIBLE_FOR_ATOMIC_RECHECK',
    reason:'SERVER_TRANSACTION_REQUIRED'});
}
