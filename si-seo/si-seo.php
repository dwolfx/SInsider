<?php
/**
 * Plugin Name: SI-SEO (Saúde Insider SEO)
 * Plugin URI:  https://saudeinsider.com.br
 * Description: Plugin de SEO profissional com análise em tempo real, legibilidade Flesch PT, pontuação dinâmica, playground de testes e geração segura de meta tags para o Saúde Insider.
 * Version:     1.0.0
 * Author:      Victor Padilla & Maya
 * Author URI:  https://saudeinsider.com.br
 * Text Domain: si-seo
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * License:     GPL-2.0-or-later
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Segurança: bloqueia execução direta de arquivo
}

// Constantes globais do plugin
if ( ! defined( 'SI_SEO_VERSION' ) ) {
    define( 'SI_SEO_VERSION', '1.0.0' );
}
if ( ! defined( 'SI_SEO_PLUGIN_DIR' ) ) {
    define( 'SI_SEO_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
}
if ( ! defined( 'SI_SEO_PLUGIN_URL' ) ) {
    define( 'SI_SEO_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
}
if ( ! defined( 'SI_SEO_PLUGIN_BASENAME' ) ) {
    define( 'SI_SEO_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
}

/**
 * Carregador principal do plugin em padrão Singleton defensivo.
 * Garante isolamento total e tratamento de erros sem risco de crash no WordPress.
 */
final class SI_SEO_Plugin {

    /**
     * Instância única
     * @var SI_SEO_Plugin|null
     */
    private static $instance = null;

    /**
     * Retorna a instância única
     * @return SI_SEO_Plugin
     */
    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Construtor protegido
     */
    private function __construct() {
        $this->load_dependencies();
        $this->init_hooks();
    }

    /**
     * Carrega arquivos necessários de forma segura
     */
    private function load_dependencies() {
        $files = array(
            'includes/icons.php',
            'includes/class-si-seo-analyzer.php',
            'includes/class-si-seo-frontend.php',
            'includes/class-si-seo-metabox.php',
            'includes/class-si-seo-playground.php',
            'includes/class-si-seo-api.php',
        );

        foreach ( $files as $file ) {
            $filepath = SI_SEO_PLUGIN_DIR . $file;
            if ( file_exists( $filepath ) ) {
                require_once $filepath;
            }
        }
    }

    /**
     * Inicializa os hooks do WordPress com tratamento defensivo
     */
    private function init_hooks() {
        // Inicialização dos módulos do painel administrativo
        if ( is_admin() ) {
            if ( class_exists( 'SI_SEO_Metabox' ) ) {
                SI_SEO_Metabox::init();
            }
            if ( class_exists( 'SI_SEO_Playground' ) ) {
                SI_SEO_Playground::init();
            }
        }

        // Frontend: Injeção de Meta Tags limpas no <head>
        if ( class_exists( 'SI_SEO_Frontend' ) ) {
            SI_SEO_Frontend::init();
        }

        // REST API
        if ( class_exists( 'SI_SEO_API' ) ) {
            SI_SEO_API::init();
        }

        // Carregamento de scripts e estilos comuns
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
    }

    /**
     * Enfileira assets do admin com verificações de tela
     * @param string $hook
     */
    public function enqueue_admin_assets( $hook ) {
        // Enfileira apenas nas telas relevantes (post editor e playground do SI-SEO)
        $is_post_edit = in_array( $hook, array( 'post.php', 'post-new.php' ), true );
        $is_playground = ( strpos( $hook, 'si-seo' ) !== false );

        if ( ! $is_post_edit && ! $is_playground ) {
            return;
        }

        // CSS compartilhado
        wp_enqueue_style(
            'si-seo-admin-common',
            SI_SEO_PLUGIN_URL . 'assets/css/admin-common.css',
            array(),
            SI_SEO_VERSION
        );

        // JS do motor de SEO em tempo real
        wp_enqueue_script(
            'si-seo-engine',
            SI_SEO_PLUGIN_URL . 'assets/js/seo-engine.js',
            array(),
            SI_SEO_VERSION,
            true
        );
    }
}

// Inicialização segura no hook 'plugins_loaded'
add_action( 'plugins_loaded', function() {
    try {
        SI_SEO_Plugin::get_instance();
    } catch ( \Throwable $e ) {
        // Registra erro em log se WP_DEBUG estiver ativo, mas JAMAIS derruba a página
        if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
            error_log( '[SI-SEO Critical Catch]: ' . $e->getMessage() );
        }
    }
} );
