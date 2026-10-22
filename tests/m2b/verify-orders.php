<?php
/**
 * M2b: verificar verdade no motor WooCommerce após a corrida Store API.
 * Cancelamento pela transição nativa, não wc_reduce_stock_levels manual.
 */
if (!function_exists('wc_get_orders')) {fwrite(STDERR,"WOO_NOT_READY\n");exit(2);}
$round=(int)(getenv('M2B_ROUND')?:1);
$sku='M2B-UNICO-'.str_pad((string)$round,3,'0',STR_PAD_LEFT);
$id=wc_get_product_id_by_sku($sku);
if(!$id){fwrite(STDERR,"SKU_NOT_FOUND\n");exit(3);}
$product=wc_get_product($id);
$before=$product->get_stock_quantity();
$valid=['on-hold','processing','completed'];
$claims=[];$all=[];
foreach(wc_get_orders(['limit'=>-1,'orderby'=>'ID','order'=>'ASC']) as $order) {
 foreach($order->get_items() as $item){
  if((int)$item->get_product_id()!==$id) continue;
  $record=['id'=>$order->get_id(),'status'=>$order->get_status(),
           'qty'=>$item->get_quantity(),'total'=>(string)$order->get_total(),
           'stock_reduced'=>(bool)$order->get_data_store()->get_recorded_sales($order)]; // may not exist?
  $all[]=$record;
  if(in_array($order->get_status(),$valid,true))$claims[]=$order;
 }
}
$claimCount=count($claims);
$cancelOutcome='NAO_EXECUTADO';
$afterCancel=$before;
if($claimCount===1){
 $o=$claims[0];
 $o->update_status('cancelled','M2b cancelamento nativo em laboratório sem cobrança');
 $afterCancel=wc_get_product($id)->get_stock_quantity();
 $cancelOutcome=$afterCancel>=$before?'OBSERVADO':'NAO_REPOSTO';
}
echo json_encode([
 'schema'=>'m2b-native-order-verification-v1','round'=>$round,'sku'=>$sku,'product_id'=>$id,
 'stock_after_race'=>$before,'active_claim_count'=>$claimCount,
 'all_orders'=>$all,'cancel_outcome'=>$cancelOutcome,'stock_after_native_cancel'=>$afterCancel,
 'negative_stock'=>$before<0||$afterCancel<0,
 'no_oversell_observed'=>($claimCount<=1 && $before>=0 && $afterCancel>=0),
 'payment_gateway'=>'bacs_offline_only','payment_confirmed'=>false,
 'expiry_hold'=>'NAO_EXECUTADO','late_payment'=>'NAO_EXECUTADO'
 ],JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES)."\n";
if($claimCount>1||$before<0||$afterCancel<0)exit(4);
