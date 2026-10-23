import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {verifyMercadoPagoSignature,assessPaymentAfterProviderRequery} from '../src/lib/commerce/m2gPaymentContracts.mjs';
import {normalizeCep,validateParcelQuoteInput,classifyMockFreightQuote} from '../src/lib/commerce/m2gFreightContracts.mjs';

const secret='M2G-DESCARTAVEL-NAO-E-SEGREDO-REAL',dataId='987654321',requestId='m2g-request-001';
const seconds=1761264000;
function signature({id=dataId,rid=requestId,ts=String(seconds),s=secret}={}){
 const template='id:'+id.toLowerCase()+';request-id:'+rid+';ts:'+ts+';';
 const hex=createHmac('sha256',s).update(template).digest('hex');
 return 'ts='+ts+',v1='+hex;
}
const signed={dataId,requestId,secret,xSignature:signature(),nowMs:seconds*1000};

test('M2g assinatura Mercado Pago sintética: valida manifesto oficial sem confirmar cobrança',()=>{
 const result=verifyMercadoPagoSignature(signed);
 assert.equal(result.authenticated,true);
 assert.equal(result.paymentConfirmed,false);
 assert.equal(result.requireProviderFetch,true);
 assert.equal(result.validatedScope,'signature_only');
});
test('M2g rejeita assinatura incorreta, request-id falso, formato duplicado e timestamp vencido',()=>{
 assert.throws(()=>verifyMercadoPagoSignature({...signed,requestId:'outro'}),{code:'SIGNATURE_INVALID'});
 assert.throws(()=>verifyMercadoPagoSignature({...signed,xSignature:signature({s:'chave-divergente'})}),{code:'SIGNATURE_INVALID'});
 assert.throws(()=>verifyMercadoPagoSignature({...signed,xSignature:signature()+',v1=duplicate'}),{code:'SIGNATURE_FORMAT_INVALID'});
 assert.throws(()=>verifyMercadoPagoSignature({...signed,nowMs:seconds*1000+600000}),{code:'SIGNATURE_EXPIRED'});
 assert.throws(()=>verifyMercadoPagoSignature({...signed,xSignature:''}),{code:'SIGNATURE_INPUT_INVALID'});
});
test('M2g compatível com exemplos ts em milissegundos, mas rejeita replay temporal antigo',()=>{
 const millis=String(seconds*1000);
 const s={...signed,xSignature:signature({ts:millis})};
 assert.equal(verifyMercadoPagoSignature(s).authenticated,true);
 assert.throws(()=>verifyMercadoPagoSignature({...s,nowMs:seconds*1000+301000}),{code:'SIGNATURE_EXPIRED'});
});
const safe={orderStatus:'pending',paymentStatus:'approved',paymentAmountCents:14990,
 expectedTotalCents:14990,currency:'BRL',externalReferenceMatches:true,skuReservedForOrder:true};
test('M2g pagamento sintético aprovado exige rechecagem atômica e não faz fulfillment',()=>{
 const x=assessPaymentAfterProviderRequery(safe);
 assert.equal(x.decision,'ELIGIBLE_FOR_ATOMIC_RECHECK');
 assert.equal(x.autoFulfill,false);
 assert.equal(x.requiresDurableIdempotency,true);
});
test('M2g pagamento tardio de pedido cancelado exige conciliação humana',()=>{
 for(const extra of [
   {orderStatus:'cancelled'},{skuReservedForOrder:false},
   {alreadyAssignedToAnotherOrder:true},
   {paymentAmountCents:100},{currency:'USD'},
   {externalReferenceMatches:false}
 ]) {
   const x=assessPaymentAfterProviderRequery({...safe,...extra});
   assert.equal(x.decision,'MANUAL_RECONCILIATION');
   assert.equal(x.autoFulfill,false);
 }
});
test('M2g pagamento pendente ou recusado não libera a peça',()=>{
 assert.equal(assessPaymentAfterProviderRequery({...safe,paymentStatus:'pending'}).decision,'WAIT');
 assert.equal(assessPaymentAfterProviderRequery({...safe,paymentStatus:'rejected'}).decision,'NO_FULFILLMENT');
});
const parcel={weightKg:0.8,widthCm:15,heightCm:12,lengthCm:20,quantity:1};
test('M2g entrada de cotação sanitiza CEP e valida embalagem e seguro',()=>{
 const x=validateParcelQuoteInput({originCep:'89200-001',destinationCep:'01001-000',
   parcels:[parcel],insuranceCents:14990});
 assert.equal(x.originCep,'89200001');
 assert.equal(x.destinationCep,'01001000');
 assert.equal(x.checkoutAllowed,false);
 assert.equal(normalizeCep('12345-678'),'12345678');
});
test('M2g bloqueia CEP, medidas, peso, quantidade e seguro inválidos',()=>{
 const input={originCep:'89200-001',destinationCep:'01001-000',parcels:[parcel],insuranceCents:14990};
 for(const value of ['abc','00000-000','123456789'])
   assert.throws(()=>validateParcelQuoteInput({...input,destinationCep:value}),{code:'CEP_INVALID'});
 for(const p of [{...parcel,weightKg:0},{...parcel,widthCm:0},
                 {...parcel,heightCm:-1},{...parcel,quantity:2}])
   assert.throws(()=>validateParcelQuoteInput({...input,parcels:[p]}),{code:'PARCEL_INVALID'});
 assert.throws(()=>validateParcelQuoteInput({...input,insuranceCents:-2}),{code:'INSURANCE_INVALID'});
});
test('M2g falha fechada se frete der timeout/erro ou valores malformados',()=>{
 const error=classifyMockFreightQuote({responseStatus:503,quotes:[]});
 assert.equal(error.status,'BLOCKED');
 assert.equal(error.checkoutAllowed,false);
 const bad=classifyMockFreightQuote({responseStatus:200,quotes:[{carrier:'Correios',
   service:'PAC',price:'-10',deliveryDays:3}]});
 assert.equal(bad.status,'BLOCKED');
 const options=classifyMockFreightQuote({responseStatus:200,quotes:[{carrier:'Correios',
   service:'PAC',price:'29.90',deliveryDays:5}]});
 assert.equal(options.options[0].priceCents,2990);
 assert.equal(options.checkoutAllowed,false);
 assert.equal(options.providerVerified,false);
});
