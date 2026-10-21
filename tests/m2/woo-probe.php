<?php
// WooCommerce REAL em WordPress/MariaDB efêmeros. Sem checkout concorrente, Pix ou dados reais.
if (!class_exists('WC_Product_Simple') || !function_exists('wc_reduce_stock_levels')) {
  fwrite(STDERR, "FALHOU: WooCommerce nao iniciado\n"); exit(2);
}
$p = new WC_Product_Simple();
$p->set_name('Produto ficticio M2');
$p->set_status('publish');
$p->set_sku('M2-SKU-001');
$p->set_regular_price('149.90');
$p->set_manage_stock(true);
$p->set_stock_quantity(1);
$p->set_backorders('no');
$p->set_sold_individually(true);
$id = $p->save();
$original = wc_get_product($id);
if (!$original || $original->get_sku() !== 'M2-SKU-001' ||
    $original->get_stock_quantity() !== 1 ||
    abs((float)$original->get_price() - 149.90) > 0.001) {
  fwrite(STDERR, "FALHOU: SKU / preco / estoque\n"); exit(3);
}
$order = wc_create_order();
$order->add_product($original, 1);
$order->calculate_totals();
$order->save();
wc_reduce_stock_levels($order->get_id());
$stock_after_reduce = wc_get_product($id)->get_stock_quantity();
if ($stock_after_reduce !== 0) {
  fwrite(STDERR, "FALHOU: Woo nao reduziu estoque a zero\n"); exit(4);
}
wc_reduce_stock_levels($order->get_id());
$stock_after_duplicate = wc_get_product($id)->get_stock_quantity();
if ($stock_after_duplicate !== 0) {
  fwrite(STDERR, "FALHOU: reducao duplicada\n"); exit(5);
}
$order->update_status('cancelled', 'Somente ambiente efemero M2');
$stock_after_cancel = wc_get_product($id)->get_stock_quantity();
echo json_encode([
  'engine'=>'woocommerce_real_ephemeral',
  'sku'=>$original->get_sku(), 'price_in_woo'=>$original->get_price(),
  'initial_stock'=>1, 'stock_after_reduce'=>$stock_after_reduce,
  'stock_after_duplicate_reduce'=>$stock_after_duplicate,
  'stock_after_cancel'=>$stock_after_cancel,
  'two_concurrent_checkout_sessions'=>'NAO_EXECUTADO',
  'checkout_web'=>'NAO_EXECUTADO',
  'hold_stock_expiration'=>'NAO_EXECUTADO',
  'real_payment_webhook'=>'NAO_EXECUTADO',
  'correios_quote'=>'BLOQUEADO'
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
