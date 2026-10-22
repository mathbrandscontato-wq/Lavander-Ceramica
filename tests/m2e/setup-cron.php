<?php
/** M2e fixture. WP-Cron delivery via HTTP real, sem do_action ou wp cron event run.
 * Foi programado um evento de teste; não prova configuração de tráfego/cron em produção.
 */
if (!function_exists('wc_reserve_stock_for_order') || !function_exists('wc_cancel_unpaid_orders')) {fwrite(STDERR,"WOO_NOT_READY\n");exit(2);}
update_option('woocommerce_manage_stock','yes');
update_option('woocommerce_hold_stock_minutes','1');
$p=new WC_Product_Simple();
$p->set_name('M2e peça fictícia única');
$p->set_sku('M2E-CRON-001');
$p->set_status('publish');
$p->set_regular_price('129.90');
$p->set_virtual(true);
$p->set_manage_stock(true);
$p->set_stock_quantity(1);
$p->set_backorders('no');
$p->set_sold_individually(true);
$pid=$p->save();
if(!$pid){fwrite(STDERR,"PRODUCT_NOT_SAVED\n");exit(3);}
$o=wc_create_order(['status'=>'pending']);
$o->set_created_via('store-api'); // metadado de laboratório; não requisição real checkout.
$o->add_product($p,1);
$o->calculate_totals();
$o->save();
wc_reserve_stock_for_order($o);
if((int)wc_get_held_stock_quantity(wc_get_product($pid))!==1){fwrite(STDERR,"HOLD_NOT_SET\n");exit(4);}
if($o->get_status()!=='pending'){fwrite(STDERR,"INITIAL_STATUS_NOT_PENDING\n");exit(5);}
// Agenda-se EVENTO WP-Cron usando a API REAL. NÃO aciona handler diretamente.
// A aplicação precisa receber request HTTP para executar este evento.
$next=time()+75;
$scheduled=wp_schedule_single_event($next,'woocommerce_cancel_unpaid_orders',[],true);
if(is_wp_error($scheduled) || !$scheduled){fwrite(STDERR,"WP_CRON_EVENT_NOT_SCHEDULED\n");exit(6);}
$read=wp_next_scheduled('woocommerce_cancel_unpaid_orders');
if(!$read){fwrite(STDERR,"WP_CRON_EVENT_MISSING\n");exit(7);}
$e=['schema'=>'m2e-cron-setup-v1','mode'=>'ephemeral_wp_cron_event_scheduled_by_fixture',
 'wp_hook'=>'woocommerce_cancel_unpaid_orders','requested_due_unix'=>$next,
 'registered_due_unix'=>$read,'order_id'=>$o->get_id(),'product_id'=>$pid,
 'sku'=>'M2E-CRON-001','initial_order_status'=>'pending',
 'initial_held'=>1,'hold_minutes'=>1,'status'=>'READY',
 'checkout_http'=>'NAO_EXECUTADO','payment_gateway'=>'none'];
echo json_encode($e,JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE)."\n";
