<?php
/**
 * Motor de Análise de SEO On-Page do SI-SEO
 * Avalia critérios essenciais de ranqueamento e legibilidade Flesch PT.
 * Arquitetura pura e defensiva: sem dependências externas, zero risco de fatal error.
 *
 * @package SI_SEO
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class SI_SEO_Analyzer {

    /**
     * Executa a análise completa de SEO
     *
     * @param array $data {
     *     @type string $keyword   Palavra-chave foco.
     *     @type string $title     Título do post (H1).
     *     @type string $slug      Slug da URL.
     *     @type string $desc      Meta descrição.
     *     @type string $content   Conteúdo em HTML ou texto.
     * }
     * @return array
     */
    public static function analyze( $data = array() ) {
        $keyword = isset( $data['keyword'] ) ? trim( (string) $data['keyword'] ) : '';
        $title   = isset( $data['title'] ) ? trim( (string) $data['title'] ) : '';
        $slug    = isset( $data['slug'] ) ? trim( (string) $data['slug'] ) : '';
        $desc    = isset( $data['desc'] ) ? trim( (string) $data['desc'] ) : '';
        $content = isset( $data['content'] ) ? (string) $data['content'] : '';

        // Limpeza de texto para contagens
        $plain_text = self::strip_html( $content );
        $words      = self::extract_words( $plain_text );
        $word_count = count( $words );

        // Palavra-chave normalizada
        $kw_normalized = self::normalize_string( $keyword );

        // Contagem de ocorrências da palavra-chave no texto
        $kw_count = 0;
        if ( ! empty( $kw_normalized ) && $word_count > 0 ) {
            $text_normalized = self::normalize_string( $plain_text );
            $kw_count        = substr_count( $text_normalized, $kw_normalized );
        }

        // Densidade da palavra-chave
        $density = ( $word_count > 0 && ! empty( $kw_normalized ) ) 
            ? round( ( $kw_count / $word_count ) * 100, 2 ) 
            : 0;

        // Índice Flesch de Legibilidade para Português
        $flesch_pt = self::calculate_flesch_pt( $plain_text, $words );

        // Avaliação individual dos critérios
        $checks = array();
        $total_score = 0;

        // 1. Palavra-chave no Título (Peso: 15)
        $checks['keyword_in_title'] = self::check_keyword_in_title( $title, $kw_normalized );
        $total_score += $checks['keyword_in_title']['score'];

        // 2. Palavra-chave na URL (Slug) (Peso: 10)
        $checks['keyword_in_slug'] = self::check_keyword_in_slug( $slug, $kw_normalized );
        $total_score += $checks['keyword_in_slug']['score'];

        // 3. Meta Descrição (Peso: 15)
        $checks['meta_description'] = self::check_meta_description( $desc, $kw_normalized );
        $total_score += $checks['meta_description']['score'];

        // 4. Palavra-chave no Início do Conteúdo (Peso: 15)
        $checks['keyword_in_intro'] = self::check_keyword_in_intro( $words, $kw_normalized );
        $total_score += $checks['keyword_in_intro']['score'];

        // 5. Densidade da Palavra-chave (Peso: 10)
        $checks['keyword_density'] = self::check_keyword_density( $density, $kw_count, $keyword );
        $total_score += $checks['keyword_density']['score'];

        // 6. Tamanho do Conteúdo (Peso: 15)
        $checks['content_length'] = self::check_content_length( $word_count );
        $total_score += $checks['content_length']['score'];

        // 7. Subtítulos (H2 / H3) (Peso: 10)
        $checks['subheadings'] = self::check_subheadings( $content, $kw_normalized );
        $total_score += $checks['subheadings']['score'];

        // 8. Texto Alternativo das Imagens (Alt) (Peso: 10)
        $checks['image_alts'] = self::check_image_alts( $content, $kw_normalized );
        $total_score += $checks['image_alts']['score'];

        // Ajuste da pontuação final
        $final_score = max( 0, min( 100, (int) round( $total_score ) ) );

        // Classificação e cores
        $status_label = 'Com falhas';
        $status_class = 'poor'; // vermelho
        if ( $final_score >= 90 ) {
            $status_label = 'Artigo otimizado';
            $status_class = 'good'; // verde
        } elseif ( $final_score >= 70 ) {
            $status_label = 'Otimização moderada';
            $status_class = 'moderate'; // amarelo / laranja
        }

        return array(
            'score'        => $final_score,
            'status_label' => $status_label,
            'status_class' => $status_class,
            'metrics'      => array(
                'word_count' => $word_count,
                'density'    => $density,
                'flesch_pt'  => $flesch_pt,
                'kw_count'   => $kw_count,
            ),
            'checks'       => $checks,
        );
    }

    /**
     * 1. Palavra-chave no Título (H1)
     */
    private static function check_keyword_in_title( $title, $kw_normalized ) {
        if ( empty( $kw_normalized ) ) {
            return array(
                'title'       => 'Palavra-chave no Título',
                'status'      => 'warning',
                'score'       => 0,
                'message'     => 'Defina uma palavra-chave foco para validar o título.',
                'tip'         => 'Escolha um termo relevante que seu público busca no Google.',
                'action_text' => '',
            );
        }

        $title_norm = self::normalize_string( $title );
        if ( ! empty( $title_norm ) && strpos( $title_norm, $kw_normalized ) !== false ) {
            return array(
                'title'       => 'Palavra-chave no Título',
                'status'      => 'success',
                'score'       => 15,
                'message'     => 'A palavra-chave foco aparece no título principal (H1).',
                'tip'         => '',
                'action_text' => '',
            );
        }

        return array(
            'title'       => 'Palavra-chave no Título',
            'status'      => 'error',
            'score'       => 0,
            'message'     => 'A palavra-chave foco não foi encontrada no título do post.',
            'tip'         => 'Inclua a palavra-chave de forma natural, preferencialmente mais à esquerda do título.',
            'action_text' => '',
        );
    }

    /**
     * 2. Palavra-chave na URL (Slug)
     */
    private static function check_keyword_in_slug( $slug, $kw_normalized ) {
        if ( empty( $kw_normalized ) ) {
            return array(
                'title'       => 'Palavra-chave na URL (Slug)',
                'status'      => 'warning',
                'score'       => 0,
                'message'     => 'Defina uma palavra-chave para analisar o slug.',
                'tip'         => 'URLs curtas e com a palavra-chave facilitam o clique e o ranqueamento.',
                'action_text' => '',
            );
        }

        $slug_norm = self::slugify( $slug );
        $kw_slug   = self::slugify( $kw_normalized );

        if ( ! empty( $slug_norm ) && strpos( $slug_norm, $kw_slug ) !== false ) {
            return array(
                'title'       => 'Palavra-chave na URL (Slug)',
                'status'      => 'success',
                'score'       => 10,
                'message'     => 'A URL contém a palavra-chave foco.',
                'tip'         => '',
                'action_text' => '',
            );
        }

        return array(
            'title'       => 'Palavra-chave na URL (Slug)',
            'status'      => 'error',
            'score'       => 0,
            'message'     => 'A palavra-chave foco não aparece na URL amigável (slug).',
            'tip'         => 'Edite o slug para incluir a palavra-chave separada por hífens.',
            'action_text' => '',
        );
    }

    /**
     * 3. Meta Descrição
     */
    private static function check_meta_description( $desc, $kw_normalized ) {
        $len = mb_strlen( $desc, 'UTF-8' );

        if ( $len === 0 ) {
            return array(
                'title'       => 'Meta Descrição',
                'status'      => 'error',
                'score'       => 0,
                'message'     => 'Nenhuma meta descrição foi informada.',
                'tip'         => 'Escreva um resumo cativante de 120 a 160 caracteres com a palavra-chave.',
                'action_text' => '',
            );
        }

        $desc_norm = self::normalize_string( $desc );
        $has_kw    = ! empty( $kw_normalized ) && ( strpos( $desc_norm, $kw_normalized ) !== false );

        if ( $len >= 120 && $len <= 160 && $has_kw ) {
            return array(
                'title'       => 'Meta Descrição',
                'status'      => 'success',
                'score'       => 15,
                'message'     => 'Meta descrição perfeita! Tamanho ideal (' . $len . ' caracteres) e contém a palavra-chave.',
                'tip'         => '',
                'action_text' => '',
            );
        }

        if ( $has_kw ) {
            return array(
                'title'       => 'Meta Descrição',
                'status'      => 'warning',
                'score'       => 8,
                'message'     => 'Contém a palavra-chave, mas tem ' . $len . ' caracteres (o ideal é 120-160).',
                'tip'         => ( $len < 120 ) 
                    ? 'Aumente um pouco a descrição para informar melhor o leitor.' 
                    : 'Reduza um pouco a descrição para não ser cortada nos resultados do Google.',
                'action_text' => 'Destacar no texto',
            );
        }

        return array(
            'title'       => 'Meta Descrição',
            'status'      => 'error',
            'score'       => 3,
            'message'     => 'A meta descrição possui ' . $len . ' caracteres, mas não contém a palavra-chave foco.',
            'tip'         => 'Inclua a palavra-chave na descrição para aumentar a taxa de cliques (CTR).',
            'action_text' => '',
        );
    }

    /**
     * 4. Palavra-chave no Início do Conteúdo
     */
    private static function check_keyword_in_intro( $words, $kw_normalized ) {
        if ( empty( $kw_normalized ) || empty( $words ) ) {
            return array(
                'title'       => 'Palavra-chave no Início do Conteúdo',
                'status'      => 'warning',
                'score'       => 0,
                'message'     => 'Adicione conteúdo e palavra-chave para verificar a introdução.',
                'tip'         => 'O leitor e os buscadores devem entender o tema já nas primeiras linhas.',
                'action_text' => '',
            );
        }

        // Pega as primeiras 80 palavras para análise da introdução
        $intro_slice = array_slice( $words, 0, 80 );
        $intro_text  = self::normalize_string( implode( ' ', $intro_slice ) );

        if ( strpos( $intro_text, $kw_normalized ) !== false ) {
            return array(
                'title'       => 'Palavra-chave no Início do Conteúdo',
                'status'      => 'success',
                'score'       => 15,
                'message'     => 'A palavra-chave aparece logo no início do texto (primeiro parágrafo).',
                'tip'         => '',
                'action_text' => '',
            );
        }

        return array(
            'title'       => 'Palavra-chave no Início do Conteúdo',
            'status'      => 'warning',
            'score'       => 5,
            'message'     => 'A palavra-chave foco não foi encontrada no primeiro parágrafo.',
            'tip'         => 'Insira o termo-chave já nas primeiras frases para reforçar a relevância do post.',
            'action_text' => '',
        );
    }

    /**
     * 5. Densidade da Palavra-chave
     */
    private static function check_keyword_density( $density, $kw_count, $keyword ) {
        if ( empty( $keyword ) ) {
            return array(
                'title'       => 'Densidade da Palavra-chave',
                'status'      => 'warning',
                'score'       => 0,
                'message'     => 'Defina a palavra-chave para calcular a densidade.',
                'tip'         => 'A densidade ideal situa-se entre 1.0% e 2.5%.',
                'action_text' => '',
            );
        }

        if ( $density >= 0.8 && $density <= 2.5 ) {
            return array(
                'title'       => 'Densidade da Palavra-chave',
                'status'      => 'success',
                'score'       => 10,
                'message'     => 'Densidade equilibrada (' . $density . '% - ' . $kw_count . ' repetições).',
                'tip'         => '',
                'action_text' => '',
            );
        }

        if ( $density < 0.8 ) {
            return array(
                'title'       => 'Densidade da Palavra-chave',
                'status'      => 'warning',
                'score'       => 4,
                'message'     => 'Densidade baixa (' . $density . '%). O termo aparece ' . $kw_count . ' vez(es).',
                'tip'         => 'Distribua a palavra-chave mais vezes ao longo do texto de forma natural.',
                'action_text' => 'Destacar no texto',
            );
        }

        return array(
            'title'       => 'Densidade da Palavra-chave',
            'status'      => 'error',
            'score'       => 3,
            'message'     => 'Densidade muito alta (' . $density . '%). Risco de keyword stuffing.',
            'tip'         => 'Reduza repetições excessivas e utilize sinônimos para manter a naturalidade.',
            'action_text' => 'Destacar no texto',
        );
    }

    /**
     * 6. Tamanho do Conteúdo
     */
    private static function check_content_length( $word_count ) {
        if ( $word_count >= 600 ) {
            return array(
                'title'       => 'Tamanho do Conteúdo',
                'status'      => 'success',
                'score'       => 15,
                'message'     => 'Excelente tamanho de conteúdo (' . $word_count . ' palavras).',
                'tip'         => '',
                'action_text' => '',
            );
        }

        if ( $word_count >= 300 ) {
            return array(
                'title'       => 'Tamanho do Conteúdo',
                'status'      => 'success',
                'score'       => 12,
                'message'     => 'Bom tamanho de conteúdo (' . $word_count . ' palavras, acima do mínimo de 300).',
                'tip'         => 'Artigos com mais de 600 palavras tendem a ranquear ainda melhor para tópicos concorridos.',
                'action_text' => '',
            );
        }

        return array(
            'title'       => 'Tamanho do Conteúdo',
            'status'      => 'error',
            'score'       => 0,
            'message'     => 'Texto muito curto (' . $word_count . ' palavras). Artigos com menos de 300 palavras têm baixa relevância.',
            'tip'         => 'Escreva um texto mais completo para esclarecer o leitor e ranquear bem.',
            'action_text' => '',
        );
    }

    /**
     * 7. Subtítulos (H2 / H3)
     */
    private static function check_subheadings( $content, $kw_normalized ) {
        preg_match_all( '/<h[23][^>]*>(.*?)<\/h[23]>/is', $content, $matches );
        $headings = isset( $matches[1] ) ? $matches[1] : array();
        $total_h  = count( $headings );

        if ( $total_h === 0 ) {
            return array(
                'title'       => 'Subtítulos (H2 / H3)',
                'status'      => 'warning',
                'score'       => 2,
                'message'     => 'Nenhum subtítulo (H2 ou H3) foi encontrado no texto.',
                'tip'         => 'Divida seu artigo em seções com H2 e H3 para facilitar a leitura.',
                'action_text' => '',
            );
        }

        if ( empty( $kw_normalized ) ) {
            return array(
                'title'       => 'Subtítulos (H2 / H3)',
                'status'      => 'success',
                'score'       => 8,
                'message'     => $total_h . ' subtítulo(s) encontrado(s).',
                'tip'         => '',
                'action_text' => '',
            );
        }

        $found_in_heading = false;
        foreach ( $headings as $h ) {
            $h_norm = self::normalize_string( strip_tags( $h ) );
            if ( strpos( $h_norm, $kw_normalized ) !== false ) {
                $found_in_heading = true;
                break;
            }
        }

        if ( $found_in_heading ) {
            return array(
                'title'       => 'Subtítulos (H2 / H3)',
                'status'      => 'success',
                'score'       => 10,
                'message'     => 'A palavra-chave aparece em ao menos um subtítulo H2/H3.',
                'tip'         => '',
                'action_text' => '',
            );
        }

        return array(
            'title'       => 'Subtítulos (H2 / H3)',
            'status'      => 'warning',
            'score'       => 6,
            'message'     => 'Você tem ' . $total_h . ' subtítulo(s), mas nenhum traz a palavra-chave foco.',
            'tip'         => 'Inclua a palavra-chave em pelo menos um H2 para reforçar o tópico.',
            'action_text' => '',
        );
    }

    /**
     * 8. Texto Alternativo das Imagens (Alt)
     */
    private static function check_image_alts( $content, $kw_normalized ) {
        preg_match_all( '/<img[^>]+>/is', $content, $imgs );
        $images = isset( $imgs[0] ) ? $imgs[0] : array();
        $total_img = count( $images );

        if ( $total_img === 0 ) {
            return array(
                'title'       => 'Texto Alternativo das Imagens (Alt)',
                'status'      => 'warning',
                'score'       => 4,
                'message'     => 'Nenhuma imagem encontrada no conteúdo.',
                'tip'         => 'Imagens ilustram o artigo e melhoram a retenção do leitor.',
                'action_text' => '',
            );
        }

        $alt_with_kw = 0;
        foreach ( $images as $img ) {
            if ( preg_match( '/alt=["\']([^"\']*)["\']/i', $img, $alt_match ) ) {
                $alt_val = self::normalize_string( $alt_match[1] );
                if ( ! empty( $kw_normalized ) && strpos( $alt_val, $kw_normalized ) !== false ) {
                    $alt_with_kw++;
                }
            }
        }

        if ( $alt_with_kw > 0 ) {
            return array(
                'title'       => 'Texto Alternativo das Imagens (Alt)',
                'status'      => 'success',
                'score'       => 10,
                'message'     => 'Imagens possuem texto alternativo (alt) com a palavra-chave foco.',
                'tip'         => '',
                'action_text' => '',
            );
        }

        return array(
            'title'       => 'Texto Alternativo das Imagens (Alt)',
            'status'      => 'warning',
            'score'       => 4,
            'message'     => 'Nenhuma imagem possui a palavra-chave foco no atributo alt.',
            'tip'         => 'Atualize o texto alternativo de uma das imagens com a palavra-chave.',
            'action_text' => 'Destacar no texto',
        );
    }

    /**
     * Cálculo do Índice de Facilidade de Leitura Flesch para Português (Flesch PT)
     * Fórmula adaptada (Flesch-Martins): 248.835 - (1.015 * ASL) - (84.6 * ASW)
     */
    public static function calculate_flesch_pt( $plain_text, $words ) {
        $word_count = count( $words );
        if ( $word_count < 10 ) {
            return 50; // valor mediano padrão para texto curto
        }

        // Divide frases por pontuação (. ! ? :)
        $sentences = preg_split( '/[.!?:]+/u', $plain_text, -1, PREG_SPLIT_NO_EMPTY );
        $sentence_count = max( 1, count( $sentences ) );

        // Contagem de sílabas aproximada por vogais em português
        $total_syllables = 0;
        foreach ( $words as $w ) {
            $total_syllables += self::count_syllables_pt( $w );
        }

        $asl = $word_count / $sentence_count;
        $asw = $total_syllables / $word_count;

        $score = 248.835 - ( 1.015 * $asl ) - ( 84.6 * $asw );
        return (int) max( 0, min( 100, round( $score ) ) );
    }

    /**
     * Contagem de sílabas para português
     */
    private static function count_syllables_pt( $word ) {
        $word = mb_strtolower( $word, 'UTF-8' );
        // Grupos vocálicos em português
        preg_match_all( '/[aeiouáéíóúâêôãõü]+/u', $word, $matches );
        $count = isset( $matches[0] ) ? count( $matches[0] ) : 1;
        return max( 1, $count );
    }

    /**
     * Extrai palavras limpas de um texto
     */
    public static function extract_words( $text ) {
        if ( empty( $text ) ) {
            return array();
        }
        // Quebra em palavras preservando acentuação
        preg_match_all( '/[\p{L}\p{N}]+/u', $text, $matches );
        return isset( $matches[0] ) ? $matches[0] : array();
    }

    /**
     * Limpa HTML para texto puro
     */
    public static function strip_html( $html ) {
        if ( empty( $html ) ) {
            return '';
        }
        // Remove tags de scripts e styles com conteúdo
        $clean = preg_replace( '/<(script|style)[^>]*?>.*?<\/\\1>/si', '', $html );
        $clean = strip_tags( $clean );
        return html_entity_decode( $clean, ENT_QUOTES, 'UTF-8' );
    }

    /**
     * Normaliza string (minúsculas, remove pontuação e excesso de espaços)
     */
    public static function normalize_string( $str ) {
        if ( empty( $str ) ) {
            return '';
        }
        $str = mb_strtolower( $str, 'UTF-8' );
        $str = preg_replace( '/[^\p{L}\p{N}\s]+/u', ' ', $str );
        return trim( preg_replace( '/\s+/u', ' ', $str ) );
    }

    /**
     * Converte string para formato slug
     */
    public static function slugify( $text ) {
        if ( empty( $text ) ) {
            return '';
        }
        // Converte acentos simples
        $text = iconv( 'UTF-8', 'ASCII//TRANSLIT', $text );
        $text = strtolower( trim( $text ) );
        $text = preg_replace( '/[^a-z0-9-]+/', '-', $text );
        return trim( $text, '-' );
    }
}
