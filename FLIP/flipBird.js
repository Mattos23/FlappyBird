console.log("FLIP");

let frames = 0;

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

// PLANO DE FUNDO]

const planoDeFundo = {
    spritex: 390,
    spritey: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha(){
        contexto.fillStyle = '#808080';
     contexto.fillRect(0,0, canvas.width, canvas.height);

        contexto.drawImage(
            sprites,
            planoDeFundo.spritex, planoDeFundo.spritey,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );

        contexto.drawImage(
            sprites,
            planoDeFundo.spritex, planoDeFundo.spritey,
            planoDeFundo.largura, planoDeFundo.altura,
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
    },
};

// [CHAO]

function criaChao(){
    const chao = {
        spritex: 0,
        spritey: 610,
        largura: 224,
        altura: 112,
        x:0,
        y: canvas.height - 112,
        atualiza(){
            const movimentoDoChao = 1;
            const repeteEm = chao.largura / 2 ;
            const movimentacao = chao.x - movimentoDoChao;
            chao.x = movimentacao % repeteEm;
        },
        desenha(){
            contexto.drawImage( 
                sprites,
                chao.spritex, chao.spritey,
                chao.largura, chao.altura,
                chao.x, chao.y,
                chao.largura, chao.altura,
            );
                
            contexto.drawImage( 
                sprites,
                chao.spritex, chao.spritey,
                chao.largura, chao.altura,
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura,
            );
        },
    };
    return chao;
}


function criaFlappy() {
    const flappy = { 

        spritex: 0,
        spritey: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 4.6,
        pula(){
            flappy.velocidade = -flappy.pulo;
        },
       gravidade: 0.25,
       velocidade: 0,
       atualiza(){
        if(fazColisao(flappy, globais.chao)){
           
            mudaParaTela(telas.INICIO);
            return;
        }
        flappy.velocidade = flappy.velocidade + flappy.gravidade;
        flappy.y = flappy.y + flappy.velocidade;
       },
       movimentos:[
        { spritex: 0, spritey: 0, }, // asa de cima
        { spritex: 0, spritey: 26, }, // asa do meio
        { spritex: 0, spritey: 52, }, // asa de baixo
        { spritex: 0, spritey: 26, }, // asa do meio
       ],
       frameAtual: 0,
       atualizaFrameAtual(){
        const intervaloDeFrames = 10;
        const passouOIntervalo = frames % intervaloDeFrames === 0;

            if(passouOIntervalo){
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + flappy.frameAtual;
                const baseRepeticao = flappy.movimentos.length;
                flappy.frameAtual = incremento % baseRepeticao
            }
        
       },
        desenha(){
            flappy.atualizaFrameAtual();
            const { spritex, spritey } = flappy.movimentos[flappy.frameAtual];
            contexto.drawImage(
                sprites, 
                spritex, spritey, // sprites x e sprites y
                flappy.largura, flappy.altura, // tamanho do recorte na sprite
                flappy.x, flappy.y, 
                flappy.largura, flappy.altura,
            );
        }
    }
    return flappy;
}

function fazColisao(flappy, chao){
    const flappyY = flappy.y + flappy.altura;
    const chaoY = chao.y;

    if(flappyY >= chaoY){
        return true;
    }

    return false;
}


// TELA INICIO

const telaInicio = {
    spritex: 134,
    spritey: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width /2) - 174 / 2,
    y: 50,
    desenha(){
        contexto.drawImage(
            sprites,
            telaInicio.spritex, telaInicio.spritey,
            telaInicio.largura, telaInicio.altura,
            telaInicio.x, telaInicio.y,
            telaInicio.largura, telaInicio.altura
        );
    }
}


// TELAS
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela){
    telaAtiva = novaTela;

    if(telaAtiva.inicializa()){
        inicializa();
    }
    
}

const telas = {
    INICIO: {
        inicializa(){
            globais.flappy = criaFlappy();
            globais.chao = criaChao();
        },
        desenha(){
            planoDeFundo.desenha();  
            globais.chao.desenha();
            globais.flappy.desenha();
            telaInicio.desenha();
        },
        click(){
            mudaParaTela(telas.JOGO);
        },
        atualiza(){
            globais.chao.atualiza();
        }
    }
}

telas.JOGO = {
    desenha(){
        planoDeFundo.desenha();  
        globais.chao.desenha();
        globais.flappy.desenha();
    },

    click(){
        globais.flappy.pula();
    },

    atualiza(){
        globais.flappy.atualiza();
    }
};
//


function loop() { 

telaAtiva.desenha();
telaAtiva.atualiza();

frames = frames + 1;
requestAnimationFrame(loop);

}

window.addEventListener('click', function() {
    if (telaAtiva.click){
        telaAtiva.click();
    }
});

mudaParaTela(telas.INICIO);
loop();