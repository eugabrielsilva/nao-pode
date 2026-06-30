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
    const $seletorTempo = $('.seletor-tempo');

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

    function formatarTempo(tempo) {
        if(tempo <= 60) {
            return tempo;
        }

        let minutos = Math.floor(tempo / 60);
        let segundos = (tempo % 60).toString().padStart(2, '0');
        return `${minutos}:${segundos}`;
    }

    function iniciarCronometro() {
        let tempo = parseInt($seletorTempo.val());
        $cronometro.removeClass('blink text-danger text-warning').addClass('text-success').text(formatarTempo(tempo));

        cronometro = setInterval(function() {
            tempo--;
            $cronometro.text(formatarTempo(tempo));

            if(tempo <= 0) {
                encerrarJogo();
            } else if(tempo <= 10) {
                $cronometro.removeClass('text-success text-warning').addClass('blink text-danger');
            } else if(tempo <= 30) {
                $cronometro.removeClass('text-success blink text-danger').addClass('text-warning');
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
        pontos = 0;
        $startContainer.addClass('d-none');
        $gameContainer.removeClass('d-none');
        proximaPalavra(false);
        iniciarCronometro();
    }

    function novoJogo() {
        $endContainer.addClass('d-none');
        $startContainer.removeClass('d-none');
    }

    function resize() {
        $('html').css('font-size', ((window.innerHeight / 960) * 16 * 1.1) + 'px');
    }

    $('.btn-iniciar').click(iniciarJogo);

    $('.btn-proxima').click(proximaPalavra);

    $('.btn-pular').click(function() {
        proximaPalavra(false);
    });

    $('.btn-encerrar').click(encerrarJogo);

    $('.btn-novo').click(novoJogo);

    window.onresize = resize;

    resize();

});

if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}