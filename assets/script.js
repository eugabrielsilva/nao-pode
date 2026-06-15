$(function() {

    let palavras = [];
    let pontos = 0;
    let cronometro = null;

    const $palavras = $('.palavras');
    const $cronometro = $('.cronometro');
    const $gameContainer = $('.game-container');
    const $startContainer = $('.start-container');
    const $endContainer = $('.end-container');
    const $pontuacao = $('.pontuacao');

    $.get('assets/words.json', function(data) {
        palavras = data;
        shuffle(palavras);
    });

    function shuffle(array) {
        for(let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function proximaPalavra(aumentarPontos = true) {
        if(palavras.length === 0) {
            encerrarJogo();
            return;
        }

        const palavra = palavras.pop();
        $palavras.empty().append(`<div class="resposta">${palavra.resposta}</div>`);

        palavra.proibidas.forEach(function(proibida) {
            $palavras.append(`<div class="proibida">${proibida}</div>`);
        });

        if(aumentarPontos) {
            pontos++;
        }

        $pontuacao.text(pontos);
    }

    function iniciarCronometro() {
        let tempo = 60;
        $cronometro.removeClass('blink text-danger text-warning').addClass('text-success').text(tempo);

        cronometro = setInterval(function() {
            tempo--;
            $cronometro.text(tempo);

            if(tempo === 30) {
                $cronometro.removeClass('text-success').addClass('text-warning');
            }

            if(tempo === 10) {
                $cronometro.removeClass('text-warning').addClass('blink text-danger');
            }

            if(tempo <= 0) {
                encerrarJogo();
            }
        }, 1000);
    }

    function encerrarJogo() {
        if(cronometro) {
            clearInterval(cronometro);
        }

        $gameContainer.addClass('d-none');
        $endContainer.removeClass('d-none');
    }

    function iniciarJogo() {
        $startContainer.addClass('d-none');
        $endContainer.addClass('d-none');
        $gameContainer.removeClass('d-none');
        pontos = 0;
        proximaPalavra(false);
        iniciarCronometro();
    }

    function resize() {
        $('html').css('font-size', ((window.innerHeight / 960) * 16 * 1.1) + 'px');
    }

    $('.btn-iniciar').click(iniciarJogo);

    $('.btn-proxima').click(proximaPalavra);

    $('.btn-encerrar').click(encerrarJogo);

    window.onresize = resize;

    resize();

});

if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}