<?php
/**
 * Endpoints da REST API para Auditoria Remota do SI-SEO
 *
 * @package SI_SEO
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class SI_SEO_API {

    /**
     * Inicializa rotas da API
     */
    public static function init() {
        add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
    }

    /**
     * Registra as rotas sob o namespace si-seo/v1
     */
    public static function register_routes() {
        register_rest_route( 'si-seo/v1', '/analyze', array(
            'methods'             => 'POST',
            'callback'            => array( __CLASS__, 'handle_analyze' ),
            'permission_callback' => array( __CLASS__, 'check_permission' ),
        ) );
    }

    /**
     * Verifica permissão de acesso (usuários autenticados que podem editar posts)
     */
    public static function check_permission() {
        return current_user_can( 'edit_posts' );
    }

    /**
     * Processa a solicitação de análise
     */
    public static function handle_analyze( WP_REST_Request $request ) {
        $params = $request->get_json_params();
        if ( ! is_array( $params ) ) {
            $params = array();
        }

        $result = SI_SEO_Analyzer::analyze( array(
            'keyword' => isset( $params['keyword'] ) ? sanitize_text_field( $params['keyword'] ) : '',
            'title'   => isset( $params['title'] ) ? sanitize_text_field( $params['title'] ) : '',
            'slug'    => isset( $params['slug'] ) ? sanitize_title( $params['slug'] ) : '',
            'desc'    => isset( $params['desc'] ) ? sanitize_textarea_field( $params['desc'] ) : '',
            'content' => isset( $params['content'] ) ? wp_kses_post( $params['content'] ) : '',
        ) );

        return rest_ensure_response( $result );
    }
}
