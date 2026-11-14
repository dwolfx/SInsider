<?php
/**
 * Página do Playground de Teste em Tempo Real no WordPress Admin
 *
 * @package SI_SEO
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class SI_SEO_Playground {

    /**
     * Registra hooks do menu
     */
    public static function init() {
        add_action( 'admin_menu', array( __CLASS__, 'register_admin_menu' ) );
        add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_assets' ) );
    }

    /**
     * Cria o menu do SI-SEO no wp-admin
     */
    public static function register_admin_menu() {
        add_menu_page(
            'SI-SEO Playground',
            'SI-SEO',
            'edit_posts',
            'si-seo-playground',
            array( __CLASS__, 'render_playground_page' ),
            'dashicons-chart-area',
            28
        );

        add_submenu_page(
            'si-seo-playground',
            'Playground de Teste',
            'Playground de Teste',
            'edit_posts',
            'si-seo-playground',
            array( __CLASS__, 'render_playground_page' )
        );
    }

    /**
     * Enfileira o bundle compilado do React
     */
    public static function enqueue_assets( $hook ) {
        if ( strpos( $hook, 'si-seo-playground' ) === false ) {
            return;
        }

        $css_file = SI_SEO_PLUGIN_DIR . 'build/si-seo-app.css';
        $js_file  = SI_SEO_PLUGIN_DIR . 'build/si-seo-app.js';

        if ( file_exists( $css_file ) ) {
            wp_enqueue_style(
                'si-seo-react-app-css',
                SI_SEO_PLUGIN_URL . 'build/si-seo-app.css',
                array(),
                SI_SEO_VERSION
            );
        }

        if ( file_exists( $js_file ) ) {
            wp_enqueue_script(
                'si-seo-react-app-js',
                SI_SEO_PLUGIN_URL . 'build/si-seo-app.js',
                array(),
                SI_SEO_VERSION,
                true
            );
        }
    }

    /**
     * Renderiza o container React no admin
     */
    public static function render_playground_page() {
        echo '<div class="wrap si-admin-wrap">';
        echo '  <div id="si-seo-root" data-mode="playground"></div>';
        echo '</div>';
    }
}
