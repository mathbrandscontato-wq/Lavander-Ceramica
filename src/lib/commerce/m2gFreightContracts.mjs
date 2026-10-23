/**
 * M2g - CONTRATOS EXPERIMENTAIS DE FRETE. Não chama API de terceiros.
 * Nunca exibir estimativa simulada como cotação válida ou permitir checkout.
 */
export class FreightContractError extends Error{
  constructor(code){super(code);this.code=code;}
}
export function normalizeCep(value){
  if(typeof value!=='string')throw new FreightContractError('CEP_INVALID');
  const digits=value.replace(/[-\s]/g,'');
  if(!/^\d{8}$/.test(digits)||digits==='00000000')
    throw new FreightContractError('CEP_INVALID');
  return digits;
}
function safeNumber(v,min,max){
  return typeof v==='number' && Number.isFinite(v) && v>=min && v<=max;
}
export function validateParcelQuoteInput({originCep,destinationCep,parcels,insuranceCents}={}){
  const origin=normalizeCep(originCep),destination=normalizeCep(destinationCep);
  if(!Array.isArray(parcels)||parcels.length===0||parcels.length>20)
    throw new FreightContractError('PARCELS_INVALID');
  if(!Number.isSafeInteger(insuranceCents)||insuranceCents<0)
    throw new FreightContractError('INSURANCE_INVALID');
  const normalized=parcels.map(p=>{
    if(!p|| !safeNumber(p.weightKg,0.01,30) ||
       !safeNumber(p.widthCm,1,200) || !safeNumber(p.lengthCm,1,200) ||
       !safeNumber(p.heightCm,1,200) ||
       !Number.isInteger(p.quantity)||p.quantity!==1)
      throw new FreightContractError('PARCEL_INVALID');
    return Object.freeze({
      weightKg:p.weightKg,widthCm:p.widthCm,lengthCm:p.lengthCm,
      heightCm:p.heightCm,quantity:1
    });
  });
  return Object.freeze({
    originCep:origin,destinationCep:destination,parcels:normalized,
    insuranceCents,commercialQuote:false,checkoutAllowed:false
  });
}
function centsFromDecimal(value){
  if(typeof value!=='string'||!/^(0|[1-9]\d{0,7})(\.\d{1,2})?$/.test(value))
    throw new FreightContractError('QUOTE_PRICE_INVALID');
  const [whole,dec='']=value.split('.');
  const cents=Number(whole)*100+Number((dec+'00').slice(0,2));
  if(!Number.isSafeInteger(cents)||cents<=0)throw new FreightContractError('QUOTE_PRICE_INVALID');
  return cents;
}
/**
 * Formato normalizado para testar o contrato; NÃO é parser oficial do Melhor Envio.
 * Resposta de API exige adaptador homologado, autorização, cache/expiração e servidor real.
 */
export function classifyMockFreightQuote({responseStatus,quotes,requestValid=true}={}){
  if(requestValid!==true || responseStatus!==200 || !Array.isArray(quotes))
    return Object.freeze({status:'BLOCKED',reason:'FREIGHT_UNAVAILABLE',
      options:[],checkoutAllowed:false,providerVerified:false});
  const options=[];
  for(const q of quotes){
    if(q?.error)continue;
    try{
      if(typeof q.carrier!=='string'||!q.carrier.trim()||
         typeof q.service!=='string'||!q.service.trim()||
         !Number.isInteger(q.deliveryDays)||q.deliveryDays<=0||q.deliveryDays>120)
        continue;
      options.push(Object.freeze({
        carrier:q.carrier,service:q.service,
        priceCents:centsFromDecimal(q.price),deliveryDays:q.deliveryDays
      }));
    }catch{ /* Opção incorreta bloqueada sem expor preço falso. */ }
  }
  return Object.freeze({
    status:options.length?'CONTRACT_OPTIONS_ONLY':'BLOCKED',
    reason:options.length?'PROVIDER_INTEGRATION_REQUIRED':'NO_VALID_QUOTE',
    options, checkoutAllowed:false, providerVerified:false
  });
}
