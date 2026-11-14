<?php
/**
 * Injeção Segura de Meta Tags no Frontend do Saúde Insider
 * Emite <meta name="description">, OpenGraph e Schema NewsArticle com blindagem contra conflitos.
 *
 * @package SI_SEO
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class SI_SEO_Frontend {

    /**
     * Inicializa os hooks do frontend
     */
    public static function init() {
        add_action( 'wp_head', array( __CLASS__, 'render_head_meta_tags' ), 1 );
    }

    /**
     * Verifica se outro plugin de SEO já está gerenciando o head
     * @return bool
     */
    public static function is_other_seo_active() {
        // Yoast SEO
        if ( defined( 'WPSEO_VERSION' ) || class_exists( 'WPSEO_Frontend' ) ) {
            return true;
        }
        // Rank Math
        if ( defined( 'RANK_MATH_VERSION' ) || class_exists( 'RankMath' ) ) {
            return true;
        }
        // All in One SEO
        if ( defined( 'AIOSEO_VERSION' ) ) {
            return true;
        }
        return false;
    }

    /**
     * Renderiza as meta tags no <head>
     */
    public static function render_head_meta_tags() {
        if ( ! is_singular( array( 'post', 'page' ) ) ) {
            return;
        }

        $post_id = get_the_ID();
        if ( ! $post_id ) {
            return;
        }

        $desc = get_post_meta( $post_id, '_si_seo_meta_desc', true );
        if ( empty( $desc ) ) {
            return;
        }

        // Se o Yoast ou Rank Math estiver ativo, evitamos duplicar <meta name="description">
        // mas injetamos o Schema NewsArticle aprimorado se não houver conflito.
        $other_active = self::is_other_seo_active();

        echo "\n<!-- Início SI-SEO Meta Tags (Saúde Insider) -->\n";

        if ( ! $other_active ) {
            echo '<meta name="description" content="' . esc_attr( $desc ) . '" />' . "\n";
            echo '<link rel="canonical" href="' . esc_url( get_permalink( $post_id ) ) . '" />' . "\n";
            echo '<meta property="og:title" content="' . esc_attr( get_the_title( $post_id ) ) . '" />' . "\n";
            echo '<meta property="og:description" content="' . esc_attr( $desc ) . '" />' . "\n";
            echo '<meta property="og:url" content="' . esc_url( get_permalink( $post_id ) ) . '" />' . "\n";
            echo '<meta property="og:site_name" content="' . esc_attr( get_bloginfo( 'name' ) ) . '" />' . "\n";
        }

        // Schema NewsArticle para Jornalismo de Saúde
        self::render_news_schema( $post_id, $desc );

        echo "<!-- Fim SI-SEO Meta Tags -->\n\n";
    }

    /**
     * Emite Schema estruturado NewsArticle / MedicalWebPage para Google Notícias
     */
    private static function render_news_schema( $post_id, $desc ) {
        $post = get_post( $post_id );
        if ( ! $post ) {
            return;
        }

        $thumb_id = get_post_thumbnail_id( $post_id );
        $image_url = $thumb_id ? wp_get_attachment_url( $thumb_id ) : '';

        $schema = array(
            '@context'         => 'https://schema.org',
            '@type'            => 'NewsArticle',
            'mainEntityOfPage' => array(
                '@type' => 'WebPage',
                '@id'   => get_permalink( $post_id ),
            ),
            'headline'         => get_the_title( $post_id ),
            'description'      => $desc,
            'datePublished'    => get_the_date( 'c', $post_id ),
            'dateModified'     => get_the_modified_date( 'c', $post_id ),
            'author'           => array(
                '@type' => 'Person',
                'name'  => get_the_author_meta( 'display_name', $post->post_author ),
            ),
            'publisher'        => array(
                '@type' => 'Organization',
                'name'  => get_bloginfo( 'name' ),
                'url'   => home_url(),
            ),
        );

        if ( ! empty( $image_url ) ) {
            $schema['image'] = array( $image_url );
        }

        echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>' . "\n";
    }
}
