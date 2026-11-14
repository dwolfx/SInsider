<?php
/**
 * Integração com o Editor de Posts do WordPress (Gutenberg & Classic Editor)
 * Injeta o drawer flutuante com z-index alto e gerencia o salvamento seguro dos dados.
 *
 * @package SI_SEO
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class SI_SEO_Metabox {

    const NONCE_ACTION = 'si_seo_save_meta_nonce';
    const NONCE_FIELD  = 'si_seo_nonce';

    /**
     * Inicializa os hooks
     */
    public static function init() {
        add_action( 'add_meta_boxes', array( __CLASS__, 'add_meta_boxes' ) );
        add_action( 'save_post', array( __CLASS__, 'save_post_data' ), 10, 2 );
        add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_editor_assets' ) );
        add_action( 'admin_footer', array( __CLASS__, 'render_floating_root' ) );
    }

    /**
     * Registra metabox padrão para compatibilidade com o editor clássico
     */
    public static function add_meta_boxes() {
        $screens = array( 'post', 'page' );
        foreach ( $screens as $screen ) {
            add_meta_box(
                'si_seo_post_metabox',
                'SI-SEO Auditoria & Meta Tags',
                array( __CLASS__, 'render_metabox_content' ),
                $screen,
                'normal',
                'high'
            );
        }
    }

    /**
     * Enfileira o bundle React no editor de posts
     */
    public static function enqueue_editor_assets( $hook ) {
        if ( ! in_array( $hook, array( 'post.php', 'post-new.php' ), true ) ) {
            return;
        }

        global $post;
        if ( ! $post ) {
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

            // Passa os dados do post atual para o React de forma segura
            $keyword = get_post_meta( $post->ID, '_si_seo_focus_keyword', true );
            $desc    = get_post_meta( $post->ID, '_si_seo_meta_desc', true );

            wp_localize_script( 'si-seo-react-app-js', 'SI_SEO_DATA', array(
                'postId'  => $post->ID,
                'title'   => get_the_title( $post ),
                'slug'    => $post->post_name,
                'keyword' => $keyword ? $keyword : '',
                'desc'    => $desc ? $desc : '',
                'content' => $post->post_content,
            ) );

            wp_localize_script( 'si-seo-react-app-js', 'SI_SEO_MODE', 'drawer' );
        }
    }

    /**
     * Injeta o nó raiz do Drawer flutuante no rodapé do wp-admin
     */
    public static function render_floating_root() {
        $screen = get_current_screen();
        if ( ! $screen || ! in_array( $screen->base, array( 'post' ), true ) ) {
            return;
        }
        echo '<div id="si-seo-root" data-mode="drawer"></div>';
    }

    /**
     * Conteúdo da metabox (campos de formulário sincronizados com nonce)
     */
    public static function render_metabox_content( $post ) {
        wp_nonce_field( self::NONCE_ACTION, self::NONCE_FIELD );

        $keyword = get_post_meta( $post->ID, '_si_seo_focus_keyword', true );
        $desc    = get_post_meta( $post->ID, '_si_seo_meta_desc', true );
        $score   = get_post_meta( $post->ID, '_si_seo_score', true );

        ?>
        <div class="si-metabox-wrapper">
            <p class="si-metabox-intro">
                O <strong>SI-SEO</strong> está ativo nesta matéria. Você pode utilizar a aba lateral flutuante na direita para visualizar a auditoria em tempo real, ou gerenciar as meta tags abaixo:
            </p>

            <div class="si-form-group">
                <label class="si-label" for="si_seo_focus_keyword">Palavra-chave Foco:</label>
                <input type="text" id="si_seo_focus_keyword" name="si_seo_focus_keyword" class="si-input" value="<?php echo esc_attr( $keyword ); ?>" placeholder="Ex: ômega 3, vitamina d..." />
            </div>

            <div class="si-form-group">
                <label class="si-label" for="si_seo_meta_desc">Meta Descrição (Google SERP):</label>
                <textarea id="si_seo_meta_desc" name="si_seo_meta_desc" class="si-input" rows="3" placeholder="Resumo de 120 a 160 caracteres com a palavra-chave..."><?php echo esc_textarea( $desc ); ?></textarea>
            </div>

            <?php if ( '' !== $score ) : ?>
                <div class="si-metabox-score-summary">
                    Última pontuação calculada: <strong><?php echo esc_html( $score ); ?>/100</strong>
                </div>
            <?php endif; ?>
        </div>
        <?php
    }

    /**
     * Salva metadados do post com segurança e sanitização rigorosa
     */
    public static function save_post_data( $post_id, $post ) {
        // Ignora autosave
        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
            return;
        }

        // Verifica nonce
        if ( ! isset( $_POST[ self::NONCE_FIELD ] ) || ! wp_verify_nonce( $_POST[ self::NONCE_FIELD ], self::NONCE_ACTION ) ) {
            return;
        }

        // Verifica permissão do usuário
        if ( ! current_user_can( 'edit_post', $post_id ) ) {
            return;
        }

        // Sanitização e persistência da palavra-chave foco
        if ( isset( $_POST['si_seo_focus_keyword'] ) ) {
            $keyword = sanitize_text_field( wp_unslash( $_POST['si_seo_focus_keyword'] ) );
            update_post_meta( $post_id, '_si_seo_focus_keyword', $keyword );
        }

        // Sanitização e persistência da meta descrição
        if ( isset( $_POST['si_seo_meta_desc'] ) ) {
            $desc = sanitize_textarea_field( wp_unslash( $_POST['si_seo_meta_desc'] ) );
            update_post_meta( $post_id, '_si_seo_meta_desc', $desc );
        }

        // Calcula e salva pontuação no servidor via Analyzer
        if ( class_exists( 'SI_SEO_Analyzer' ) && $post ) {
            $kw = get_post_meta( $post_id, '_si_seo_focus_keyword', true );
            $ds = get_post_meta( $post_id, '_si_seo_meta_desc', true );

            $result = SI_SEO_Analyzer::analyze( array(
                'keyword' => $kw,
                'title'   => get_the_title( $post ),
                'slug'    => $post->post_name,
                'desc'    => $ds,
                'content' => $post->post_content,
            ) );

            update_post_meta( $post_id, '_si_seo_score', $result['score'] );
        }
    }
}
