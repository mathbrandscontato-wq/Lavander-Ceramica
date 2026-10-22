<?php
/**
 * M2b — preparação estritamente efêmera. Executar somente pelo WP-CLI do laboratório.
 * IDs e preços fictícios; nenhum dado/credencial de produção.
 */
if (!class_exists('WC_Product_Simple')) { fwrite(STDERR,"WC_NOT_READY\n"); exit(2); }
update_option('woocommerce_currency','BRL');
update_option('woocommerce_enable_guest_checkout','yes');
update_option('woocommerce_manage_stock','yes');
update_option('woocommerce_hold_stock_minutes','1');
$gateways = WC()->payment_gateways()->payment_gateways();
if (!isset($gateways['bacs'])) { fwrite(STDERR,"BACS_UNAVAILABLE\n"); exit(3); }
$gateways['bacs']->update_option('enabled','yes');
$gateways['bacs']->update_option('title','LABORATORIO - transferencia ficticia');
$round = (int) (getenv('M2B_ROUND') ?: 1);
if ($round < 1 || $round > 8) { fwrite(STDERR,'BAD_ROUND');exit(4); }
$testSku = 'M2B-UNICO-' . str_pad((string)$round,3,'0',STR_PAD_LEFT);
$p=new WC_Product_Simple();
$p->set_name('Peça Única Fictícia M2b - TESTE');
$p->set_sku($testSku);
$p->set_status('publish');
$p->set_catalog_visibility('visible');
$p->set_regular_price('149.90');
$p->set_virtual(true);
$p->set_manage_stock(true);
$p->set_stock_quantity(1);
$p->set_stock_status('instock');
$p->set_backorders('no');
$p->set_sold_individually(true);
$id=$p->save();
if(!$id){fwrite(STDERR,"PRODUCT_CREATE_FAILED\n");exit(4);}
echo json_encode(['product_id'=>$id,'sku'=>$testSku,'stock'=>1,'gateway'=>'bacs']) . "\n";
