<?php
/** M2d WooCommerce REAL descartável.
 * Testa a função nativa que cancela pedidos pendentes não pagos, com relógio real.
 * SEM webhook financeiro, cobrança, conta externa ou alteração em produção.
 */
if (!function_exists('wc_cancel_unpaid_orders') || !function_exists('wc_reserve_stock_for_order')) {
    fwrite(STDERR, "WOO_UNPAID_API_NOT_FOUND\n"); exit(2);
}
update_option('woocommerce_currency','BRL');
update_option('woocommerce_manage_stock','yes');
update_option('woocommerce_hold_stock_minutes','1');

function m2d_assert($actual,$expected,$code) {
    if ($actual !== $expected) {
        fwrite(STDERR,"FAILED ".$code." expected=".json_encode($expected)." got=".json_encode($actual)."\n");exit(9);
    }
}
function m2d_product($sku) {
    $p=new WC_Product_Simple();
    $p->set_name('Produto experimental '.$sku);
    $p->set_sku($sku);
    $p->set_status('publish');
    $p->set_regular_price('149.90');
    $p->set_virtual(true);
    $p->set_manage_stock(true);
    $p->set_stock_quantity(1);
    $p->set_backorders('no');
    $p->set_sold_individually(true);
    $id=$p->save();
    m2d_assert(is_int($id) && $id>0,true,'PRODUCT_CREATED');
    return wc_get_product($id);
}
function m2d_pending($product,$via) {
    $o=wc_create_order(['status'=>'pending']);
    if(is_wp_error($o)) throw new RuntimeException('CREATE_ORDER');
    $o->set_created_via($via); // Metadado simulado do checkout; NÃO é checkout HTTP.
    $o->add_product($product,1);
    $o->calculate_totals();
    $o->save();
    return $o;
}
$staleProduct=m2d_product('M2D-STALE-001');
$adminProduct=m2d_product('M2D-ADMIN-001');
$freshProduct=m2d_product('M2D-FRESH-001');
$stale=m2d_pending($staleProduct,'store-api');
$admin=m2d_pending($adminProduct,'admin');
wc_reserve_stock_for_order($stale);
m2d_assert((int)wc_get_held_stock_quantity($staleProduct),1,'STALE_HOLD_INITIAL');
m2d_assert(wc_get_order($stale->get_id())->get_status(),'pending','STALE_INITIAL_PENDING');

// 1º disparo do handler: pedido não atingiu o prazo.
do_action('woocommerce_cancel_unpaid_orders');
m2d_assert(wc_get_order($stale->get_id())->get_status(),'pending','NOT_CANCELLED_PREMATURELY');
$e=['schema'=>'m2d-native-unpaid-handler-v1',
   'environment'=>'woocommerce_real_wpcli_ephemeral',
   'gateway'=>'none','payment_confirmed'=>false,'order_source'=>'store-api simulated metadata',
   'cron_runner'=>'NAO_EXECUTADO (hook Woo nativo acionado explicitamente)',
   'early_pending_preserved'=>true,'hold_minutes'=>1];
echo json_encode(['phase'=>'pre_expiry','stale_order'=>$stale->get_id(),
  'status'=>'pending','sleep_seconds'=>68])."\n";
// Aguarda relógio real, sem alterar timestamps do pedido/banco.
sleep(68);
$fresh=m2d_pending($freshProduct,'store-api');
m2d_assert(wc_get_order($fresh->get_id())->get_status(),'pending','FRESH_CREATED');
// 2º disparo nativo, após o vencimento do primeiro pedido.
do_action('woocommerce_cancel_unpaid_orders');
$e['stale_status_after_native_handler']=wc_get_order($stale->get_id())->get_status();
$e['fresh_status_after_native_handler']=wc_get_order($fresh->get_id())->get_status();
$e['admin_status_after_native_handler']=wc_get_order($admin->get_id())->get_status();
$e['stale_held_after_handler']=(int)wc_get_held_stock_quantity($staleProduct);
$e['stale_physical_stock']=(int)wc_get_product($staleProduct->get_id())->get_stock_quantity();
m2d_assert($e['stale_status_after_native_handler'],'cancelled','STALE_NOT_CANCELLED');
m2d_assert($e['fresh_status_after_native_handler'],'pending','FRESH_CANCELLED');
m2d_assert($e['admin_status_after_native_handler'],'pending','ADMIN_CANCELLED');
m2d_assert($e['stale_held_after_handler'],0,'HOLD_NOT_RELEASED');

// Outro comprador adquire reserva depois de cancelar o pedido antigo.
$new=m2d_pending($staleProduct,'store-api');
wc_reserve_stock_for_order($new);
$e['new_buyer_held']=(int)wc_get_held_stock_quantity($staleProduct);
m2d_assert($e['new_buyer_held'],1,'NEW_BUYER_CANNOT_RESERVE');

// Política de conciliação FICTÍCIA no escopo do teste:
// antes de chamar payment_complete em gateway real: ordem cancelada exige reconciliação.
$lateOrder=wc_get_order($stale->get_id());
$decision=$lateOrder->has_status(['cancelled','failed','refunded'])
     ? 'manual_reconciliation_no_auto_fulfillment' : 'not_evaluated';
$e['late_payment_mock_decision']=$decision;
$e['late_payment_mock_event']='not_received_from_gateway';
m2d_assert($decision,'manual_reconciliation_no_auto_fulfillment','LATE_POLICY');

// Repetir o handler não cancela pedido de nova reserva recém-criado.
do_action('woocommerce_cancel_unpaid_orders');
$e['new_buyer_status_after_duplicate_handler']=wc_get_order($new->get_id())->get_status();
$e['new_buyer_held_after_duplicate_handler']=(int)wc_get_held_stock_quantity($staleProduct);
m2d_assert($e['new_buyer_status_after_duplicate_handler'],'pending','NEW_PENDING_CANCELLED');
m2d_assert($e['new_buyer_held_after_duplicate_handler'],1,'NEW_HOLD_LOST');
m2d_assert((int)wc_get_product($staleProduct->get_id())->get_stock_quantity(),1,'STOCK_NEGATIVE');
$new->update_status('cancelled','Cleanup laboratório M2d');
$e['final_held']=(int)wc_get_held_stock_quantity($staleProduct);
m2d_assert($e['final_held'],0,'FINAL_HOLD');
$e['status']='PASSOU';
echo json_encode($e,JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES)."\n";
