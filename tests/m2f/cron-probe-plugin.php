<?php
/**
 * Plugin Name: M2f Cron Probe (temporary)
 * Description: Side-effect-only diagnostic in disposable WP CI.
 */
if (!defined('ABSPATH')) { exit; }
add_action('m2f_cron_probe', function () {
    update_option('m2f_probe_invoked_at', time(), false);
    update_option('m2f_probe_last_origin', (defined('DOING_CRON') && DOING_CRON) ? 'wp-cron' : 'other', false);
});
