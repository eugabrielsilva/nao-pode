$(function() {

    let palavras = [];
    let cronometro;

    const $palavras = $('.palavras');
    const $cronometro = $('.cronometro');

    $.get('assets/words.json', function(data) {
        palavras = data;
        novaPalavra();
        iniciarCronometro();
    });

    function novaPalavra() {
        const indice = Math.floor(Math.random() * palavras.length);
        const palavra = palavras[indice];

        $palavras.empty().append(`<div class="resposta">${palavra.resposta}</div>`);

        palavra.proibidas.forEach(function(proibida) {
            $palavras.append(`<div class="proibida">${proibida}</div>`);
        });
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
                clearInterval(cronometro);
            }
        }, 1000);
    }

    function resetarCronometro() {
        clearInterval(cronometro);
        iniciarCronometro();
    }

    $('.btn-resetar').click(resetarCronometro);

    $('.btn-nova').click(novaPalavra);

});