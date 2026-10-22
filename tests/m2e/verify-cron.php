<?php
if(!function_exists('wc_get_order'))exit(2);
$pid=wc_get_product_id_by_sku('M2E-CRON-001');
if(!$pid){fwrite(STDERR,"PRODUCT_NOT_FOUND\n");exit(3);}
$stale=null;$fresh=null;$admin=null;
foreach(wc_get_orders(['limit'=>-1]) as $o){
 foreach($o->get_items() as $it){
  $product=wc_get_product($it->get_product_id());
  $sku=$product?$product->get_sku():null;
  if($sku==='M2E-CRON-001')$stale=$o;
  if($sku==='M2E-FRESH-001')$fresh=$o;
  if($sku==='M2E-ADMIN-001')$admin=$o;
 }
}
if(!$stale||!$fresh||!$admin){fwrite(STDERR,"ORDER_NOT_FOUND\n");exit(4);}
$statusStale=$stale->get_status();
$statusFresh=$fresh->get_status();
$statusAdmin=$admin->get_status();
$held=(int)wc_get_held_stock_quantity(wc_get_product($pid));
$physical=(int)wc_get_product($pid)->get_stock_quantity();
$next=wp_next_scheduled('woocommerce_cancel_unpaid_orders');
$checks=[
 'stale_cancelled'=>$statusStale==='cancelled',
 'fresh_preserved'=>$statusFresh==='pending',
 'admin_preserved'=>$statusAdmin==='pending',
 'hold_released'=>$held===0,
 'physical_not_negative'=>$physical===1,
];
echo json_encode([
 'schema'=>'m2e-cron-verify-v1','delivery'=>'wp-cron.php via HTTP; no manual do_action',
 'stale_status'=>$statusStale,'fresh_status'=>$statusFresh,
 'admin_status'=>$statusAdmin,'stale_held'=>$held,
 'stale_physical_stock'=>$physical,'next_wp_cron_event'=>$next?:null,
 'checks'=>$checks,'all_passed'=>!in_array(false,$checks,true),
 'status'=>!in_array(false,$checks,true)?'PASSOU':'FALHOU',
 'actual_gateway_webhook'=>'NAO_EXECUTADO',
 'action_scheduler'=>'NAO_EXECUTADO',
 'scheduler_under_traffic'=>'NAO_EXECUTADO',
],JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT)."\n";
if(in_array(false,$checks,true))exit(5);
