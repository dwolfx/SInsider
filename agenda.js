/**
 * Carrossel da Agenda de Eventos, na home.
 *
 * O bloco tem espaço para três eventos e a agenda costuma ter mais. Este
 * script transforma a faixa numa roda infinita, com giro automático e duas
 * setas — uma de cada lado.
 *
 * ⚠️ O laço infinito é feito RODANDO O DOM, não duplicando slides. A cada
 * avanço a pista desliza um passo e, terminada a transição, o primeiro item vai
 * para o fim com a transição desligada e o deslocamento zerado. Duplicar
 * slides seria mais simples de escrever e leria cada evento duas vezes para
 * quem usa leitor de tela.
 *
 * ⚠️ As setas são criadas AQUI, não no PHP. Sem JavaScript não há carrossel, e
 * botão que não faz nada é pior que botão nenhum — a janela nasce com
 * `overflow-x: auto` e a faixa continua percorrível por toque e por teclado.
 *
 * @package SaudeInsider
 */

( function () {
	'use strict';

	// Tempo parado entre um giro e o seguinte.
	var INTERVALO = 6000;
	// Duração do deslize. Casada com o `transition` do CSS.
	var DURACAO = 600;

	var textos = window.siAgenda || {};

	/**
	 * O visitante pediu menos movimento?
	 *
	 * Consultado a cada uso, e não uma vez só: a preferência pode mudar com o
	 * sistema durante a visita.
	 *
	 * @return {boolean} Verdadeiro quando o sistema pede movimento reduzido.
	 */
	function menosMovimento() {
		return window.matchMedia && window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
	}

	function inicia( carrossel ) {
		var janela = carrossel.querySelector( '[data-si-janela]' );
		var pista = carrossel.querySelector( '[data-si-pista]' );

		if ( ! janela || ! pista ) {
			return;
		}

		/**
		 * Quantos eventos a pista tem AGORA.
		 *
		 * ⚠️ Lido a cada uso, não guardado numa variável. O número não muda em
		 * produção, mas guardá-lo faz o script mentir se algo mexer na pista —
		 * e foi assim que um teste pegou as setas continuando à vista depois de
		 * a lista encolher para o tamanho da janela.
		 *
		 * @return {number} Total de slides.
		 */
		function quantos() {
			return pista.children.length;
		}

		// Um evento só não é carrossel: sem setas, sem giro, sem nada.
		if ( quantos() < 2 ) {
			return;
		}

		/*
		 * ⚠️ O tabindex ORIGINAL de cada foco fica guardado antes de qualquer
		 * mexida. O link da foto do evento já nasce com -1 de propósito (ele
		 * duplica o link do nome), e devolver "sem atributo" o tornaria
		 * tabulável — um foco novo, invisível, em cima da foto.
		 */
		var focaveis = [].slice.call( pista.querySelectorAll( 'a[href], button' ) );

		focaveis.forEach( function ( el ) {
			el.setAttribute( 'data-si-tab-original', null === el.getAttribute( 'tabindex' ) ? '' : el.getAttribute( 'tabindex' ) );
		} );

		var relogio = null;
		var animando = false;
		var pendenteAvanco = false;
		var salvaVidas = null;

		/*
		 * ⚠️ TRAVAS NOMEADAS, e não um contador de pausas.
		 *
		 * A primeira versão contava: `pausa()` somava, `retoma()` subtraía. Não
		 * funcionou, e o motivo é que os pares não são simétricos — o
		 * `IntersectionObserver` dispara uma vez ao observar, e se a seção
		 * estiver abaixo da dobra ele trava sem que nada tenha destravado
		 * antes. O contador nascia em 2 e nunca voltava a 0: o giro automático
		 * simplesmente não acontecia. `focusout` tem o mesmo problema, porque
		 * dispara também ao mover o foco DENTRO do carrossel.
		 *
		 * Com uma trava por motivo, cada evento escreve só a sua, e "pode
		 * girar" é a pergunta de todas serem falsas.
		 */
		var travas = {
			ponteiro: false,
			foco: false,
			aba: document.hidden,
			// Só nasce travado se houver quem destrave — ver mais abaixo.
			fora: !! window.IntersectionObserver,
		};

		/**
		 * Largura de um passo: o slide mais o vão entre eles.
		 *
		 * Medida a cada uso porque muda com a largura da tela, e o CSS é quem
		 * decide quantos cabem — o script não repete os breakpoints.
		 *
		 * @return {number} Passo em pixels.
		 */
		function passo() {
			var estilo = window.getComputedStyle( pista );
			var vao = parseFloat( estilo.columnGap || estilo.gap ) || 0;

			return pista.children[ 0 ].getBoundingClientRect().width + vao;
		}

		/**
		 * Quantos slides cabem na janela agora.
		 *
		 * @return {number} Pelo menos 1.
		 */
		function visiveis() {
			var p = passo();

			return p > 0 ? Math.max( 1, Math.round( janela.clientWidth / p ) ) : 1;
		}

		/**
		 * Há mais evento do que cabe na janela?
		 *
		 * @return {boolean} Verdadeiro quando sobra evento fora de vista.
		 */
		function sobra() {
			return quantos() > visiveis();
		}

		/**
		 * Tira do foco e da leitura o que está fora da janela.
		 *
		 * ⚠️ Sem isto o Tab entraria nos eventos escondidos pelo `overflow`,
		 * que é o mesmo defeito que o `N-26` corrigiu no aviso de citação:
		 * invisível não é o mesmo que ausente.
		 *
		 * @return {void}
		 */
		function atualizaAlcance() {
			var n = visiveis();

			[].forEach.call( pista.children, function ( slide, i ) {
				var dentro = i < n;

				// Nunca esconder de leitor de tela algo que está com o foco.
				if ( ! dentro && slide.contains( document.activeElement ) ) {
					dentro = true;
				}

				slide.setAttribute( 'aria-hidden', dentro ? 'false' : 'true' );

				[].forEach.call( slide.querySelectorAll( 'a[href], button' ), function ( el ) {
					var original = el.getAttribute( 'data-si-tab-original' );

					if ( ! dentro ) {
						el.setAttribute( 'tabindex', '-1' );
					} else if ( '' === original || null === original ) {
						el.removeAttribute( 'tabindex' );
					} else {
						el.setAttribute( 'tabindex', original );
					}
				} );
			} );
		}

		/**
		 * Gira um evento para a esquerda ou para a direita.
		 *
		 * @param {number} direcao 1 avança, -1 volta.
		 * @return {void}
		 */
		function gira( direcao ) {
			if ( animando || ! sobra() ) {
				return;
			}

			var deslocamento = passo();

			if ( menosMovimento() ) {
				// Sem deslize: troca a ordem e pronto.
				if ( direcao > 0 ) {
					pista.appendChild( pista.firstElementChild );
				} else {
					pista.insertBefore( pista.lastElementChild, pista.firstElementChild );
				}

				atualizaAlcance();
				return;
			}

			animando = true;

			/*
			 * ⚠️ O `transitionend` pode não vir — transição cancelada, aba que
			 * volta do fundo, aceleração desligada. Sem isto o carrossel
			 * travaria de vez em `animando = true`.
			 */
			window.clearTimeout( salvaVidas );
			salvaVidas = window.setTimeout( fecha, DURACAO + 250 );

			if ( direcao > 0 ) {
				pendenteAvanco = true;
				pista.style.transition = 'transform ' + DURACAO + 'ms cubic-bezier(0.4, 0, 0.2, 1)';
				pista.style.transform = 'translateX(-' + deslocamento + 'px)';
			} else {
				/*
				 * Voltar é o avanço ao contrário: o último item vem para a
				 * frente com a pista já deslocada, e a animação a traz de volta
				 * ao zero. O reflow entre as duas coisas é obrigatório — sem
				 * ele o navegador junta os dois estados e não anima nada.
				 */
				pista.style.transition = 'none';
				pista.insertBefore( pista.lastElementChild, pista.firstElementChild );
				pista.style.transform = 'translateX(-' + deslocamento + 'px)';
				void pista.offsetWidth;
				pista.style.transition = 'transform ' + DURACAO + 'ms cubic-bezier(0.4, 0, 0.2, 1)';
				pista.style.transform = 'translateX(0)';
			}
		}

		/*
		 * Fim do deslize: no avanço, o primeiro vai para o fim e o
		 * deslocamento volta a zero sem transição — é o que fecha a roda. No
		 * retorno não há o que fazer, porque a troca de ordem já aconteceu
		 * ANTES da animação.
		 *
		 * @return {void}
		 */
		function fecha() {
			window.clearTimeout( salvaVidas );

			if ( pendenteAvanco ) {
				pendenteAvanco = false;
				pista.style.transition = 'none';
				pista.appendChild( pista.firstElementChild );
				pista.style.transform = 'translateX(0)';
				void pista.offsetWidth;
				pista.style.transition = '';
			}

			animando = false;
			atualizaAlcance();
		}

		pista.addEventListener( 'transitionend', function ( e ) {
			if ( 'transform' === e.propertyName && e.target === pista ) {
				fecha();
			}
		} );

		function para() {
			window.clearInterval( relogio );
			relogio = null;
		}

		function anda() {
			para();

			// Movimento reduzido: as setas funcionam, o giro sozinho não.
			if ( menosMovimento() || ! sobra() ) {
				return;
			}

			for ( var motivo in travas ) {
				if ( travas[ motivo ] ) {
					return;
				}
			}

			relogio = window.setInterval( function () {
				gira( 1 );
			}, INTERVALO );
		}

		/**
		 * Liga ou desliga uma trava e reavalia o giro.
		 *
		 * @param {string}  motivo Nome da trava.
		 * @param {boolean} valor  Verdadeiro trava.
		 * @return {void}
		 */
		function trava( motivo, valor ) {
			travas[ motivo ] = !! valor;
			anda();
		}

		// --- Setas -------------------------------------------------------

		function criaSeta( direcao, rotulo ) {
			var b = document.createElement( 'button' );

			b.type = 'button';
			b.className = 'si-agenda__seta si-agenda__seta--' + ( direcao > 0 ? 'proxima' : 'anterior' );
			b.setAttribute( 'aria-label', rotulo );
			b.innerHTML = textos.seta || '';
			b.addEventListener( 'click', function () {
				gira( direcao );
				// Um toque na seta reinicia a contagem: dá tempo de ler.
				anda();
			} );

			return b;
		}

		var anterior = criaSeta( -1, textos.anterior || 'Anterior' );
		var proxima = criaSeta( 1, textos.proximo || 'Próximo' );

		carrossel.appendChild( anterior );
		carrossel.appendChild( proxima );
		carrossel.setAttribute( 'role', 'group' );
		carrossel.setAttribute( 'aria-roledescription', textos.regiao || 'Carrossel' );
		carrossel.setAttribute( 'aria-label', textos.rotulo || '' );

		/**
		 * Mostra ou esconde as setas conforme sobre evento fora de vista.
		 *
		 * Com três eventos e três lugares não há o que girar, e duas setas
		 * mortas seriam ruído. `hidden` de verdade: some da tela e do Tab.
		 *
		 * @return {void}
		 */
		function atualizaSetas() {
			var precisa = sobra();

			anterior.hidden = ! precisa;
			proxima.hidden = ! precisa;
			carrossel.classList.toggle( 'is-ativo', precisa );
		}

		// --- Pausas ------------------------------------------------------

		carrossel.addEventListener( 'mouseenter', function () {
			trava( 'ponteiro', true );
		} );

		carrossel.addEventListener( 'mouseleave', function () {
			trava( 'ponteiro', false );
		} );

		carrossel.addEventListener( 'focusin', function () {
			trava( 'foco', true );
		} );

		/*
		 * ⚠️ O `focusout` dispara também ao mover o foco DE UMA seta para a
		 * outra, e nesse instante o `activeElement` ainda é o `body`. Por isso
		 * a pergunta é feita no fim da fila, e é sobre onde o foco parou — não
		 * sobre o evento ter acontecido.
		 */
		carrossel.addEventListener( 'focusout', function () {
			window.setTimeout( function () {
				trava( 'foco', carrossel.contains( document.activeElement ) );
			}, 0 );
		} );

		// Aba escondida não precisa girar nada.
		document.addEventListener( 'visibilitychange', function () {
			trava( 'aba', document.hidden );
		} );

		// Fora da tela também não. A trava nasce ligada e é o observador que a
		// solta — ele dispara uma vez assim que passa a observar.
		if ( window.IntersectionObserver ) {
			new window.IntersectionObserver( function ( entradas ) {
				entradas.forEach( function ( entrada ) {
					trava( 'fora', ! entrada.isIntersecting );
				} );
			} ).observe( carrossel );
		}

		// --- Largura da tela ---------------------------------------------

		var espera = null;

		window.addEventListener( 'resize', function () {
			window.clearTimeout( espera );
			espera = window.setTimeout( function () {
				pista.style.transition = 'none';
				pista.style.transform = 'translateX(0)';
				void pista.offsetWidth;
				pista.style.transition = '';
				animando = false;
				atualizaSetas();
				atualizaAlcance();
				anda();
			}, 150 );
		} );

		atualizaSetas();
		atualizaAlcance();
		anda();
	}

	document.addEventListener( 'DOMContentLoaded', function () {
		[].forEach.call( document.querySelectorAll( '[data-si-agenda]' ), inicia );
	} );
}() );
