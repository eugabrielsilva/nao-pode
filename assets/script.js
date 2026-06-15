$(function() {

    let palavras = [];
    let pontos = 0;
    let cronometro;

    const $palavras = $('.palavras');
    const $cronometro = $('.cronometro');
    const $gameContainer = $('.game-container');
    const $startContainer = $('.start-container');
    const $endContainer = $('.end-container');
    const $pontuacao = $('.pontuacao');

    $.get('assets/words.json', function(data) {
        palavras = data;
    });

    function proximaPalavra() {
        const indice = Math.floor(Math.random() * palavras.length);
        const palavra = palavras[indice];

        $palavras.empty().append(`<div class="resposta">${palavra.resposta}</div>`);

        palavra.proibidas.forEach(function(proibida) {
            $palavras.append(`<div class="proibida">${proibida}</div>`);
        });

        pontos++;
        $pontuacao.text(pontos);
    }

    function iniciarCronometro() {
        let tempo = 60;
        $cronometro.removeClass('text-danger').removeClass('text-warning').addClass('text-success').text(tempo);

        cronometro = setInterval(function() {
            tempo--;
            $cronometro.text(tempo);

            if(tempo === 30) {
                $cronometro.removeClass('text-success').addClass('text-warning');
            }

            if(tempo === 10) {
                $cronometro.removeClass('text-warning').addClass('text-danger');
            }

            if(tempo <= 0) {
                encerrarJogo();
            }
        }, 1000);
    }

    function encerrarJogo() {
        clearInterval(cronometro);
        $gameContainer.addClass('d-none');
        $endContainer.removeClass('d-none');
        $pontuacao.text(pontos);
    }

    function iniciarJogo() {
        $startContainer.addClass('d-none');
        $endContainer.addClass('d-none');
        $gameContainer.removeClass('d-none');
        proximaPalavra();
        pontos = 0;
        $pontuacao.text(pontos);
        iniciarCronometro();
    }

    $('.btn-iniciar').click(iniciarJogo);

    $('.btn-proxima').click(proximaPalavra);

    $('.btn-encerrar').click(encerrarJogo);

});