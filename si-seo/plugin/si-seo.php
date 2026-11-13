<?php
/**
 * Plugin Name: SI-SEO (Saúde Insider SEO Engine)
 * Plugin URI:  https://saudeinsider.com.br/
 * Description: Motor de SEO e Linter de Conteúdo em Tempo Real para Gutenberg e React com suporte nativo a NewsArticle.
 * Version:     1.0.0
 * Author:      Victor Hugo & Maya
 * Author URI:  https://saudeinsider.com.br/
 * Text Domain: si-seo
 */

if (!defined('ABSPATH')) {
    exit;
}

class SiSeoPlugin {
    public function __construct() {
        add_action('init', [$this, 'register_meta_fields']);
        add_action('enqueue_block_editor_assets', [$this, 'enqueue_editor_assets']);
        add_action('wp_head', [$this, 'render_frontend_meta'], 1);
    }

    /**
     * Registra os meta fields na REST API para o React / Gutenberg ler e salvar com segurança
     */
    public function register_meta_fields() {
        $meta_fields = [
            '_si_seo_focus_keyword' => 'string',
            '_si_seo_title'         => 'string',
            '_si_seo_meta_desc'     => 'string',
            '_yoast_wpseo_focuskw'  => 'string',
            '_yoast_wpseo_title'    => 'string',
            '_yoast_wpseo_metadesc' => 'string',
        ];

        foreach ($meta_fields as $key => $type) {
            register_post_meta('post', $key, [
                'show_in_rest'  => true,
                'single'        => true,
                'type'          => $type,
                'auth_callback' => function() {
                    return current_user_can('edit_posts');
                }
            ]);
        }
    }

    /**
     * Carrega o script em React dentro do editor Gutenberg
     */
    public function enqueue_editor_assets() {
        $has_local_dist = file_exists(plugin_dir_path(__FILE__) . 'dist/si-seo.umd.js');
        $script_path    = $has_local_dist ? plugin_dir_path(__FILE__) . 'dist/si-seo.umd.js' : plugin_dir_path(__FILE__) . '../dist/si-seo.umd.js';
        $script_url     = $has_local_dist ? plugins_url('dist/si-seo.umd.js', __FILE__) : plugins_url('../dist/si-seo.umd.js', __FILE__);
        
        $style_path     = $has_local_dist ? plugin_dir_path(__FILE__) . 'dist/si-seo.css' : plugin_dir_path(__FILE__) . '../dist/si-seo.css';
        $style_url      = $has_local_dist ? plugins_url('dist/si-seo.css', __FILE__) : plugins_url('../dist/si-seo.css', __FILE__);

        if (file_exists($script_path)) {
            wp_enqueue_script(
                'si-seo-sidebar',
                $script_url,
                ['wp-plugins', 'wp-edit-post', 'wp-element', 'wp-components', 'wp-data'],
                '1.0.0',
                true
            );
        }

        if (file_exists($style_path)) {
            wp_enqueue_style(
                'si-seo-styles',
                $style_url,
                [],
                '1.0.0'
            );
        }
    }

    /**
     * Injeta meta tags e Schema NewsArticle no front-end para o Google News / Discover
     */
    public function render_frontend_meta() {
        if (!is_singular('post')) {
            return;
        }

        $post_id   = get_the_ID();
        $title     = get_the_title($post_id);
        $permalink = get_permalink($post_id);

        $meta_desc = get_post_meta($post_id, '_si_seo_meta_desc', true) 
                  ?: get_post_meta($post_id, '_yoast_wpseo_metadesc', true)
                  ?: get_the_excerpt($post_id);

        echo "\n<!-- SI-SEO Engine (Saúde Insider) -->\n";

        if (!empty($meta_desc) && !defined('WPSEO_VERSION')) {
            echo '<meta name="description" content="' . esc_attr($meta_desc) . '" />' . "\n";
        }

        // Schema JSON-LD NewsArticle estruturado para Google News / Discover
        $schema = [
            '@context'         => 'https://schema.org',
            '@type'            => 'NewsArticle',
            'headline'         => esc_html($title),
            'description'      => esc_html($meta_desc),
            'url'              => esc_url($permalink),
            'mainEntityOfPage' => [
                '@type' => 'WebPage',
                '@id'   => esc_url($permalink),
            ],
            'publisher'        => [
                '@type' => 'NewsMediaOrganization',
                'name'  => 'Saúde Insider',
                'url'   => 'https://saudeinsider.com.br/',
                'logo'  => [
                    '@type' => 'ImageObject',
                    'url'   => 'https://saudeinsider.com.br/wp-content/uploads/2026/08/favicon-si-192x192.png',
                ],
            ],
            'inLanguage'       => 'pt-BR',
        ];

        echo '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>' . "\n";
    }
}

new SiSeoPlugin();
