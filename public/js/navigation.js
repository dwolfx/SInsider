/**
 * Saúde Insider — comportamento do cabeçalho.
 *
 * Dois controles: o drawer lateral e o painel de busca. Ambos partem do HTML
 * fechado (atributo hidden) e só abrem por ação do usuário, então a página
 * continua legível se este arquivo não carregar.
 */
( function () {
	'use strict';

	/**
	 * Liga um botão a um painel, sincronizando aria-expanded e hidden.
	 *
	 * @param {HTMLElement} trigger Botão que abre e fecha.
	 * @param {HTMLElement} panel   Painel controlado.
	 * @param {Function}    onOpen  Executado depois de abrir.
	 * @return {Object} API com open, close e toggle.
	 */
	function createDisclosure( trigger, panel, onOpen ) {
		function setState( open ) {
			trigger.setAttribute( 'aria-expanded', String( open ) );
			panel.hidden = ! open;

			if ( open && typeof onOpen === 'function' ) {
				onOpen();
			}
		}

		trigger.addEventListener( 'click', function () {
			setState( panel.hidden );
		} );

		return {
			open: function () {
				setState( true );
			},
			close: function () {
				setState( false );
			},
			isOpen: function () {
				return ! panel.hidden;
			},
		};
	}

	/**
	 * Barra fixa da home (L2-10).
	 *
	 * O cabeçalho vira `position: fixed` quando o principal sai de cena, e o
	 * CSS troca a marca inteira pela assinatura — a mesma apresentação da
	 * editoria, decidida pelo cliente em 24/08/2026.
	 *
	 * ⚠️ Mede a altura ANTES de fixar e a devolve ao espaçador. Sem isso a
	 * página encolhe no instante da troca, o conteúdo salta, o `scrollY` muda
	 * sozinho e o gatilho dispara de novo — a barra pisca.
	 *
	 * ⚠️ A histerese de 8px existe pelo mesmo motivo, na volta: com um limiar
	 * único, parar a rolagem exatamente sobre ele faz a barra alternar a cada
	 * quadro.
	 *
	 * @param {HTMLElement} header  O cabeçalho.
	 * @param {HTMLElement} espaco  O espaçador logo abaixo dele.
	 */
	function barraFixa( header, espaco ) {
		var FOLGA = 8;
		var limiar = 0;
		var fixo = false;
		var agendado = false;

		/**
		 * Publica a altura da barra fixa numa custom property da raiz.
		 *
		 * ⚠️ Quem precisa disso é o que gruda na rolagem — hoje o trilho de
		 * compartilhar da matéria, que sem o desconto some por baixo da barra:
		 * medido em 25/08/2026, ele grudava em `top: 24px` com a barra
		 * ocupando 0..98, e 74px do trilho ficavam escondidos.
		 *
		 * Vem do JavaScript e não de um número no CSS porque a altura muda com
		 * a largura da tela — 59, 67, 83 e 98px nos quatro degraus. Medir o
		 * elemento cobre os quatro sem repetir nenhum.
		 *
		 * Zero quando a barra não está fixa: aí o cabeçalho rola junto e não
		 * há o que descontar.
		 */
		function publicarAltura() {
			document.documentElement.style.setProperty(
				'--si-header-fixo-altura',
				( fixo ? header.offsetHeight : 0 ) + 'px'
			);
		}

		function medir() {
			// Só faz sentido medir com o cabeçalho no fluxo.
			if ( fixo ) {
				return;
			}

			limiar = header.offsetHeight;
			espaco.style.setProperty( '--si-header-altura-fluxo', limiar + 'px' );
		}

		function avaliar() {
			agendado = false;

			var y = window.scrollY || window.pageYOffset;

			if ( ! fixo && y > limiar ) {
				fixo = true;
				header.classList.add( 'is-fixo' );
				publicarAltura();
			} else if ( fixo && y <= Math.max( 0, limiar - FOLGA ) ) {
				fixo = false;
				header.classList.remove( 'is-fixo' );
				publicarAltura();
				medir();
			}
		}

		function aoRolar() {
			if ( agendado ) {
				return;
			}

			agendado = true;
			window.requestAnimationFrame( avaliar );
		}

		medir();
		avaliar();

		window.addEventListener( 'scroll', aoRolar, { passive: true } );
		window.addEventListener( 'resize', function () {
			medir();
			avaliar();
		}, { passive: true } );
	}

	document.addEventListener( 'DOMContentLoaded', function () {
		var menuButton = document.querySelector( '.si-header__button--menu' );
		var drawer = document.getElementById( 'si-drawer' );
		var searchButton = document.querySelector( '.si-header__button--search' );
		var searchPanel = document.getElementById( 'si-search-panel' );

		var drawerControl = null;
		var searchControl = null;

		if ( menuButton && drawer ) {
			drawerControl = createDisclosure( menuButton, drawer, function () {
				var close = drawer.querySelector( '.si-drawer__close' );

				if ( close ) {
					close.focus();
				}
			} );

			// Fecha pelo X e pelo fundo escuro.
			drawer.querySelectorAll( '.si-drawer__close, .si-drawer__backdrop' ).forEach( function ( el ) {
				el.addEventListener( 'click', function () {
					drawerControl.close();
					menuButton.focus();
				} );
			} );
		}

		if ( searchButton && searchPanel ) {
			searchControl = createDisclosure( searchButton, searchPanel, function () {
				var field = searchPanel.querySelector( 'input[type="search"]' );

				if ( field ) {
					field.focus();
				}
			} );
		}

		// Escape fecha o que estiver aberto e devolve o foco ao botão de origem.
		var headerFixo = document.querySelector( '[data-si-barra-fixa]' );
		var espacoFixo = document.querySelector( '.si-header__espaco' );

		if ( headerFixo && espacoFixo ) {
			barraFixa( headerFixo, espacoFixo );
		}

		document.addEventListener( 'keydown', function ( event ) {
			if ( 'Escape' !== event.key ) {
				return;
			}

			if ( drawerControl && drawerControl.isOpen() ) {
				drawerControl.close();
				menuButton.focus();
				return;
			}

			if ( searchControl && searchControl.isOpen() ) {
				searchControl.close();
				searchButton.focus();
			}
		} );
	} );
}() );

/**
 * Botões "copiar link".
 *
 * ⚠️ Vive aqui, e não no script da matéria, porque deixou de ser exclusivo
 * dela: o trilho, o menu de compartilhar e o rodapé usam o mesmo botão, e o
 * rodapé aparece em toda página. Preso ao `is_singular('post')`, o do rodapé
 * ficaria morto fora da matéria.
 *
 * Nasce `aria-disabled` no HTML e só é habilitado onde a API existe — em
 * contexto inseguro (http sem TLS) ela não existe, e um botão que não copia é
 * melhor desabilitado que mudo.
 */
(function () {
	'use strict';

	if ( ! navigator.clipboard || ! window.isSecureContext ) {
		return;
	}

	/**
	 * Região que anuncia o "Link copiado" a quem usa leitor de tela.
	 *
	 * ⚠️ Uma só para a página inteira, criada na primeira cópia. `role="status"`
	 * já implica `aria-live="polite"`, então o anúncio não atropela o que estiver
	 * sendo lido.
	 *
	 * @return {HTMLElement} O elemento da região.
	 */
	function regiao() {
		var el = document.getElementById( 'si-aviso-copiado' );

		if ( ! el ) {
			el = document.createElement( 'span' );
			el.id = 'si-aviso-copiado';
			el.className = 'si-visually-hidden';
			el.setAttribute( 'role', 'status' );
			document.body.appendChild( el );
		}

		return el;
	}

	document.addEventListener( 'DOMContentLoaded', function () {
		document.querySelectorAll( '[data-si-copy]' ).forEach( function ( botao ) {
			botao.removeAttribute( 'aria-disabled' );

			var relogio = null;

			botao.addEventListener( 'click', function () {
				navigator.clipboard.writeText( botao.getAttribute( 'data-si-copy' ) ).then( function () {
					var texto = botao.dataset.siCopied || '';

					/*
					 * A classe liga o balão visível, que o CSS desenha com
					 * `content: attr(data-si-copied)` — a mensagem sai do
					 * próprio markup, sem string no JavaScript.
					 */
					botao.classList.add( 'si-acao--copiado' );

					/*
					 * ⚠️ O ANÚNCIO VAI PARA UMA REGIÃO À PARTE, e não mais para
					 * o `aria-label` do botão.
					 *
					 * Trocar o nome de um elemento que acabou de ser clicado é
					 * confuso — o botão passa a se chamar "Link copiado" —, e a
					 * versão anterior nunca desfazia a troca: depois de copiar
					 * uma vez, o botão ficava com esse nome até recarregar a
					 * página. Corrigido em 04/09/2026.
					 */
					if ( texto ) {
						regiao().textContent = texto;
					}

					window.clearTimeout( relogio );

					relogio = window.setTimeout( function () {
						botao.classList.remove( 'si-acao--copiado' );

						// Esvazia para que a próxima cópia seja anunciada de novo.
						if ( texto ) {
							regiao().textContent = '';
						}
					}, 2400 );
				} );
			} );
		} );
	} );
}());

/**
 * Reserva da miniatura do YouTube.
 *
 * ⚠️ `maxresdefault.jpg` não existe para todo vídeo — o YouTube só a gera acima
 * de certa resolução de origem e devolve 404 quando falta. A `hqdefault.jpg`
 * existe sempre. A troca é feita no evento `error` da própria imagem, que é o
 * único jeito de saber sem uma requisição extra do servidor.
 *
 * ⚠️ O ouvinte é registrado na FASE DE CAPTURA e no documento: `error` de imagem
 * não borbulha, então um ouvinte comum no documento nunca seria chamado.
 */
(function () {
	'use strict';

	document.addEventListener(
		'error',
		function ( e ) {
			var img = e.target;

			if ( ! img || 'IMG' !== img.tagName ) {
				return;
			}

			var reserva = img.getAttribute( 'data-si-poster-reserva' );

			if ( ! reserva ) {
				return;
			}

			// Uma tentativa só: sem isto, reserva quebrada vira laço infinito.
			img.removeAttribute( 'data-si-poster-reserva' );
			img.src = reserva;
		},
		true
	);
}());

/**
 * Vídeo no cartão da home (`L3-09`).
 *
 * ⚠️ O `iframe` do provedor só nasce no CLIQUE. Carregá-lo junto com a home
 * significaria um player do YouTube por cartão de vídeo, cada um puxando
 * centenas de KB de script antes de alguém pedir — a home ficaria lenta de um
 * jeito difícil de reverter. O que carrega com a página é a foto destacada,
 * que já estava lá, mais um botão.
 *
 * ⚠️ Sem JavaScript o botão não faz nada, e é o caso em que isso é aceitável:
 * o cartão inteiro continua sendo um link para a matéria, onde o vídeo está no
 * corpo. Ninguém fica sem o conteúdo, só sem o atalho.
 */
(function () {
	'use strict';

	document.addEventListener( 'DOMContentLoaded', function () {
		document.querySelectorAll( '[data-si-video]' ).forEach( function ( botao ) {
			botao.addEventListener( 'click', function () {
				var url = botao.getAttribute( 'data-si-video' );

				if ( ! url ) {
					return;
				}

				var frame = document.createElement( 'iframe' );

				frame.className = 'si-midia__frame';
				frame.src = url;
				frame.title = botao.getAttribute( 'aria-label' ) || '';
				frame.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture';
				frame.setAttribute( 'allowfullscreen', '' );
				// Só o necessário: sem acesso ao documento que o hospeda.
				frame.setAttribute( 'referrerpolicy', 'strict-origin-when-cross-origin' );

				var area = botao.parentNode;

				if ( area ) {
					area.innerHTML = '';
					area.appendChild( frame );
				}
			} );
		} );
	} );
}());
