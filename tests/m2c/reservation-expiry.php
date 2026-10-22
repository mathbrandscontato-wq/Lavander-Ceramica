<?php
/**
 * M2c: reserva nativa Woo, rejeição de segunda reserva, cancelamento
 * repetido e expiração por relógio real (não mexe em SQL para falsificar prazo).
 * Somente WP-CLI de container descartável, sem pagamento e sem checkout HTTP.
 */
if (!function_exists('wc_create_order') || !function_exists('wc_reserve_stock_for_order')) {
    fwrite(STDERR, "WOOCOMMERCE_RESERVATION_API_MISSING\n"); exit(2);
}
update_option('woocommerce_currency','BRL');
update_option('woocommerce_manage_stock','yes');
update_option('woocommerce_hold_stock_minutes','1');
$sku = 'M2C-RESERVA-001';
$p = new WC_Product_Simple();
$p->set_name('Peça fictícia M2c reserva');
$p->set_sku($sku);
$p->set_status('publish');
$p->set_regular_price('149.90');
$p->set_manage_stock(true);
$p->set_stock_quantity(1);
$p->set_backorders('no');
$p->set_sold_individually(true);
$p->set_virtual(true);
$pid=$p->save();
if(!$pid){ fwrite(STDERR,"PRODUCT_NOT_CREATED\n");exit(3); }

function m2c_order($product) {
    $o=wc_create_order(['status'=>'pending']);
    if(is_wp_error($o)){throw new RuntimeException('ORDER_NOT_CREATED');}
    $o->add_product($product,1);
    $o->calculate_totals();
    $o->save();
    return $o;
}
function m2c_held($id) {return (int)wc_get_held_stock_quantity(wc_get_product($id));}
function m2c_check($bool,$code) {if(!$bool){fwrite(STDERR,"INVARIANT_FAILED:".$code."\n");exit(7);}}
$evidence=['schema'=>'m2c-native-reservation-expiry-v1','sku'=>$sku,'hold_minutes'=>1,
 'mode'=>'real_woocommerce_wp_cli_ephemeral','payment_confirmed'=>false,
 'checkout_http'=>'NAO_EXECUTADO','gateway_webhook'=>'NAO_EXECUTADO'];
$a=m2c_order($p);
wc_reserve_stock_for_order($a);
$evidence['held_first']=m2c_held($pid);
$evidence['stock_first']=(int)wc_get_product($pid)->get_stock_quantity();
m2c_check($evidence['held_first']===1,'FIRST_RESERVATION_MISSING');
m2c_check($evidence['stock_first']===1,'RESERVATION_MUST_NOT_DECREMENT_PHYSICAL_STOCK');
$b=m2c_order($p);
$denied=false;$denied_code='none';
try {wc_reserve_stock_for_order($b);}
catch(Throwable $ex){$denied=true;$denied_code=method_exists($ex,'getErrorCode')?$ex->getErrorCode():get_class($ex);}
$evidence['second_pending_blocked']=$denied;
$evidence['second_pending_error']=$denied_code;
m2c_check($denied,'DOUBLE_RESERVATION_WAS_ALLOWED');
m2c_check(m2c_held($pid)===1,'DUPLICATE_HOLD');
$a->update_status('cancelled','M2c teste reserva nativa; pagamento inexistente');
$evidence['held_after_cancel']=m2c_held($pid);
m2c_check($evidence['held_after_cancel']===0,'CANCEL_DID_NOT_RELEASE_HOLD');
$a->update_status('cancelled','M2c repetição idempotente');
$evidence['held_after_duplicate_cancel']=m2c_held($pid);
m2c_check($evidence['held_after_duplicate_cancel']===0,'DUPLICATE_CANCEL_HOLD');
wc_reserve_stock_for_order($b);
$evidence['held_after_second_order_reserves']=m2c_held($pid);
m2c_check($evidence['held_after_second_order_reserves']===1,'RE_RESERVATION_FAILED');
$b->update_status('cancelled','M2c liberar para testar expiração');
m2c_check(m2c_held($pid)===0,'SECOND_CANCEL_FAILED');
$c=m2c_order($p);
wc_reserve_stock_for_order($c);
$evidence['before_expiry_held']=m2c_held($pid);
$evidence['pending_before_expiry']=$c->get_status();
m2c_check($evidence['before_expiry_held']===1,'EXPIRY_PRE_HOLD_MISSING');
echo json_encode(['phase'=>'pre_expiry','order_id'=>$c->get_id(),'held'=>$evidence['before_expiry_held'],'seconds_to_sleep'=>67],JSON_UNESCAPED_UNICODE)."\n";
sleep(67); // Real de passagem de tempo; não manipula timestamp nem WC DB.
$evidence['held_after_real_clock_expiry']=m2c_held($pid);
$evidence['expired_order_still_pending']=$c->get_status()==='pending';
$evidence['stock_after_real_clock_expiry']=(int)wc_get_product($pid)->get_stock_quantity();
m2c_check($evidence['held_after_real_clock_expiry']===0,'HOLD_NOT_EXPIRED');
m2c_check($evidence['stock_after_real_clock_expiry']===1,'UNEXPECTED_STOCK_CHANGE');
$d=m2c_order($p);
wc_reserve_stock_for_order($d);
$evidence['new_buyer_reserved_after_expiry']=m2c_held($pid)===1;
m2c_check($evidence['new_buyer_reserved_after_expiry'],'NEW_BUYER_BLOCKED_AFTER_EXPIRY');
$c->update_status('cancelled','M2c antigo pedido expirado cancelado, sem pagamento');
$evidence['new_reservation_survives_old_cancel']=m2c_held($pid)===1;
m2c_check($evidence['new_reservation_survives_old_cancel'],'OLD_CANCEL_RELEASED_NEW_HOLD');
$d->update_status('cancelled','M2c cleanup final');
$evidence['final_held']=m2c_held($pid);
$evidence['final_stock']=(int)wc_get_product($pid)->get_stock_quantity();
m2c_check($evidence['final_held']===0 && $evidence['final_stock']===1,'FINAL_INVARIANTS');
$evidence['status']='PASSOU';
$evidence['note']='Cron nao foi acionado: expiracao da reserva foi consultada via WC ao passar 67 segundos; pedido pending pode continuar pending.';
echo json_encode($evidence,JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES)."\n";
