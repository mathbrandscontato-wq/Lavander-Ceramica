<?php
if(!function_exists('wc_create_order'))exit(2);
function mkfresh($sku,$via){
 $p=new WC_Product_Simple();
 $p->set_name('M2e controle '.$via);
 $p->set_sku($sku);
 $p->set_status('publish');
 $p->set_regular_price('29.90');
 $p->set_virtual(true);
 $p->set_manage_stock(true);
 $p->set_stock_quantity(1);
 $p->set_backorders('no');
 $p->set_sold_individually(true);
 $id=$p->save();
 $o=wc_create_order(['status'=>'pending']);
 $o->set_created_via($via);
 $o->add_product(wc_get_product($id),1);
 $o->calculate_totals();
 $o->save();
 return ['id'=>$o->get_id(),'via'=>$via,'status'=>$o->get_status()];
}
$e=['fresh'=>mkfresh('M2E-FRESH-001','store-api'),
'admin'=>mkfresh('M2E-ADMIN-001','admin'),
'status'=>'READY'];
echo json_encode($e,JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE)."\n";
