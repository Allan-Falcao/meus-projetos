const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const fundo = new Image();
fundo.src = "assets/mapa_3.png";

const botao = new Image();
botao.src = "assets/botao.png"

const personagem = new Image();
personagem.src = "assets/personagem_final_2.png";
const info_personagem = [
    {
        descontoX: 0,
        descontoY: 0,
        desconto_recorteX: 0,
        desconto_recorteY: 0
    },
    {
        descontoX: 0,
        descontoY: 0,
        desconto_recorteX: 10,
        desconto_recorteY: 0
    },
    {
        descontoX: 0,
        descontoY: 0,
        desconto_recorteX: 10,
        desconto_recorteY: 0
    },
    {
        descontoX: 0,
        descontoY: 0,
        desconto_recorteX: 0,
        desconto_recorteY: 0
    },
    {
        descontoX: 0,
        descontoY: 0,
        desconto_recorteX: 0,
        desconto_recorteY: 0
    },
    {
        descontoX: 0,
        descontoY: 0,
        desconto_recorteX: 0,
        desconto_recorteY: 0
    },
    {
        descontoX: 0,
        descontoY: 0,
        desconto_recorteX: 0,
        desconto_recorteY: 0
    },
    {
        descontoX: 0,
        descontoY: 0,
        desconto_recorteX: 0,
        desconto_recorteY: 0
    },

];

const cursos_mira = new Image();
cursos_mira.src = "assets/mira_personalizada.png";

const cargas_personalizadas = new Image();
cargas_personalizadas.src = "assets/cargas_eletricas.png";

const imagem_interface_loja = new Image()
imagem_interface_loja.src = "assets/interface_loja.png";

const imagem_memoria_ram = new Image();
imagem_memoria_ram.src = "assets/memoria ram.png";

const hdd = new Image();
hdd.src = "assets/hdd.png";

const imagem_ssd = new Image();
imagem_ssd.src = "assets/img_ssd.png";

const rachadura = new Image();
rachadura.src = "assets/rachadura.png";

const cpu = new Image();
cpu.src = "assets/cpu.png";

// inicia o tempo quando o jogo começa
let tempoInicio = Date.now(); // tempo em milissegundos

// função que retorna o tempo decorrido formatado
function obterTempoDecorrido() {

    let agora = Date.now();

    let tempoDecorrido = agora - tempoInicio; // diferença em ms

    // conversões
    let segundosTotais = Math.floor(tempoDecorrido / 1000);
    let minutos = Math.floor(segundosTotais / 60);
    let segundos = segundosTotais % 60;

    // formatação (fica bonito tipo 02:07)
    let minutosFormatado = String(minutos).padStart(2, "0");
    let segundosFormatado = String(segundos).padStart(2, "0");

    return `Tempo de jogo ${minutosFormatado}:${segundosFormatado}`;
}

// CAMERA
const camera = {
    x: 0,
    y: 0
};

//MAPA
const scale = 3;
const mapa = {
    largura: 1024 * scale,
    altura: 1024 * scale,
};

//OBJETOS
const barreiras = [];
const lojas = [];
const tiros = [];
const cargas = [];
let pontos = 0;


// CONTROLES
const controles = {
    w: false,
    a: false,
    s: false,
    d: false,
    q: false,
    e: false,
    t: false,
    mouse_left: false,
    mouse_right: false
};


document.addEventListener("mousedown", (event) => {
    if (event.button === 0) controles.mouse_left = true;
    if (event.button === 2) controles.mouse_right = true;
});

document.addEventListener("mouseup", (event) => {
    if (event.button === 0) controles.mouse_left = false;
    if (event.button === 2) controles.mouse_right = false;
});

function travar_menu() {
    canvas.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });
};
travar_menu();

document.addEventListener("keydown", (event) => {

    if (event.key === "w") controles.w = true;
    if (event.key === "a") controles.a = true;
    if (event.key === "s") controles.s = true;
    if (event.key === "d") controles.d = true;
    if (event.key === "q") controles.q = true;
    if (event.key === "e") controles.e = true;
    if (event.key === "t") controles.t = true;

});

document.addEventListener("keyup", (event) => {

    if (event.key === "w") controles.w = false;
    if (event.key === "a") controles.a = false;
    if (event.key === "s") controles.s = false;
    if (event.key === "d") controles.d = false;
    if (event.key === "q") controles.q = false;
    if (event.key === "e") controles.e = false;
    if (event.key === "t") controles.t = false;;

});

//CURSOS PERSONALIZADO
canvas.style.cursor = "none";
const cursor = {
    recorteX: 0,
    recorteY: 0,
    largura_recorte: 144,
    altura_recorte: 144,
    largura: 75,
    altura: 75,
    x: 0,
    y: 0
};

document.addEventListener("mousemove", (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
})


// PERSONAGEM
class Personagem {

    constructor(spritesheet) {

        this.spritesheet = spritesheet;

        this.x = 1100;
        this.y = 1700;

        this.altura = 100;
        this.largura = 100;

        this.vel = 6;

        this.indice_recorteX = 0;
        this.indice_recorteY = 0;
        this.largura_recorte = 1218 / 8;
        this.altura_recorte = 205;
        this.velocidade_animacao = 7;
        this.contador_animacao = 0;
        this.direcao = 1; // 1 = direita, -1 = esquerda

        this.cadencia = 100;
        this.contator_cadencia = 0
        this.recarga = 200;
        this.contador_recarga = 0;
        this.quantidade_maxima_balas = 3;
        this.quantidade_balas = 3;
        this.estado_arma = "carregada";
        this.velocidade_tiro = 5;
    }

    limites() {
        // Limite esquerdo
        if (this.x < 0) this.x = 0;

        // Limite superior
        if (this.y < 0) this.y = 0;

        // Limite direito
        if (this.x + this.largura > mapa.largura) {
            this.x = mapa.largura - this.largura;
        }

        // Limite inferior
        if (this.y + this.altura > mapa.altura) {
            this.y = mapa.altura - this.altura;
        }
    }

    atualizar() {
        let novoX = this.x;
        let novoY = this.y;

        if (controles.w) novoY -= this.vel;
        if (controles.s) novoY += this.vel;
        if (controles.a) novoX -= this.vel;
        if (controles.d) novoX += this.vel;

        let futuro = {
            x: novoX,
            y: novoY,
            largura: this.largura,
            altura: this.altura
        };

        let bateu = false;

        for (let obj of barreiras) {
            if (verificar_colisao(futuro, obj)) {
                bateu = true;
                break;
            };
        };
        if (!bateu) {
            this.x = futuro.x;
            this.y = futuro.y;
        };

        for (let loja of lojas) {
            if (verificar_colisao(this, loja)) {
                loja.interagir();
            } else loja.loja_aberta = false;
        }
        if (controles.a) {
            novoX -= this.vel;
            this.direcao = -1;
        }
        if (controles.d) {
            novoX += this.vel;
            this.direcao = 1;
        }


    };

    animar() {
        if (controles.a || controles.d || controles.w || controles.s) {
            this.contador_animacao++;
            if (this.contador_animacao >= this.velocidade_animacao) {
                this.contador_animacao = 0;
                this.indice_recorteX++;
                if (this.indice_recorteX >= 7) this.indice_recorteX = 0;
            };
        }
    }

    desenhar() {

        const telaX = this.x - camera.x;
        const telaY = this.y - camera.y;

        ctx.save(); // salva o estado atual

        if (this.direcao === -1) {
            ctx.scale(-1, 1);

            ctx.drawImage(
                this.spritesheet,
                this.indice_recorteX * this.largura_recorte - info_personagem[this.indice_recorteX].descontoX,
                this.indice_recorteY * this.altura_recorte - info_personagem[this.indice_recorteX].descontoY,
                this.largura_recorte - info_personagem[this.indice_recorteX].desconto_recorteX,
                this.altura_recorte - info_personagem[this.indice_recorteX].desconto_recorteY,
                -(telaX + this.largura), // MUITO IMPORTANTE
                telaY,
                this.largura,
                this.altura
            );

        } else {

            ctx.drawImage(
                this.spritesheet,
                this.indice_recorteX * this.largura_recorte - info_personagem[this.indice_recorteX].descontoX,
                this.indice_recorteY * this.altura_recorte - info_personagem[this.indice_recorteX].descontoY,
                this.largura_recorte - info_personagem[this.indice_recorteX].desconto_recorteX,
                this.altura_recorte - info_personagem[this.indice_recorteX].desconto_recorteY,
                telaX,
                telaY,
                this.largura,
                this.altura
            );
        }

        ctx.restore(); // volta ao normal
    }
    atirar() {
        if (this.estado_arma != "descarregada") {
            this.contator_cadencia--;
            if (this.contator_cadencia <= 0) {
                this.estado_arma = "carregada";
            } else this.estado_arma = "coldown";

            if (this.estado_arma === "carregada" && (controles.mouse_left || controles.mouse_right)) {
                this.contator_cadencia = this.cadencia;
                this.quantidade_balas--;
                this.disparo();

            };
        }
    };

    recarregar() {
        if (this.quantidade_balas <= 0) {
            this.estado_arma = "descarregada";
        };
        if (this.estado_arma === "descarregada") {
            this.contador_recarga++;
            if (this.contador_recarga >= this.recarga) {
                this.estado_arma = "carregada";
                this.contador_recarga = 0;
                this.quantidade_balas = this.quantidade_maxima_balas;
            }
        }
    }

    disparo() {
        let angulo = Math.atan2(
            (cursor.y + camera.y) - (this.y + this.altura / 2),
            (cursor.x + camera.x) - (this.x + this.largura / 2)
        );
        let carga = 0;
        if (controles.mouse_left) carga = 1;
        if (controles.mouse_right) carga = -1;

        tiros.push({
            x: this.x + this.largura / 2,
            y: this.y + this.altura / 2,
            velX: Math.cos(angulo) * this.velocidade_tiro,
            velY: Math.sin(angulo) * this.velocidade_tiro,
            carga: carga,
            altura: 40,
            largura: 40
        })
    };

    atualizar_tiros() {
        for (let tiro of tiros) {
            tiro.x += tiro.velX;
            tiro.y += tiro.velY;
        };
    };
    desenhar_tiros() {
        for (let tiro of tiros) {
            if (tiro.carga === 1) {
                ctx.drawImage(
                    cargas_personalizadas,
                    317 / 2, 0,
                    317 / 2, 157,
                    tiro.x - camera.x - 25, tiro.y - camera.y - 25,
                    50, 50
                )
            }
            else if (tiro.carga === -1) {
                ctx.drawImage(
                    cargas_personalizadas,
                    0, 0,
                    317 / 2, 157,
                    tiro.x - camera.x - 25, tiro.y - camera.y - 25,
                    50, 50
                )
            };
        };
    };

};

class Objetos {
    constructor(x, y, largura, altura) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
    };

    colisao_visivel() {

        const telaX = this.x - camera.x;
        const telaY = this.y - camera.y;

        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 2;

        ctx.strokeRect(
            telaX,
            telaY,
            this.largura,
            this.altura
        );

    }
};

class Botao {
    constructor(x, y, largura, altura) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
    }

    desenhar_botao() {
        ctx.drawImage(
            botao,
            0, 0,
            500, 500,
            this.x,
            this.y,
            this.largura,
            this.altura
        );
    }

    verificar_colisao() {
        if (
            controles.mouse_left &&
            cursor.x > this.x &&
            cursor.x < this.x + this.largura &&
            cursor.y > this.y &&
            cursor.y < this.y + this.altura
        ) {
            return true;
        }
        return false;
    }
}


class Lojas extends Objetos {
    constructor(x, y, largura, altura, funcao) {
        super(x, y, largura, altura);
        this.funcao = funcao;
        this.loja_aberta = false;
        this.pode_abrir = true; // evita abrir várias vezes segurando tecla
        this.preco_memoria_ram = 10;
        this.preco_hdd = 10;
        this.preco_ssd = 10;
        this.estado_cpu = "quebrada";
        this.preco_cpu = 1000;
        this.atualizar_timer = true;
        this.tempo_total = null;
    }

    interagir() {

        // abre/fecha com tecla E (apenas 1 clique)
        if (verificar_colisao(jogador, this)) {
            if (controles.e && this.pode_abrir) {
                this.loja_aberta = !this.loja_aberta;
                this.pode_abrir = false;
            }
            if (!controles.e) this.pode_abrir = true;
        }

        if (this.funcao === "cpu") {
            let escala = 1
            if (this.estado_cpu === "quebrada") {
                ctx.drawImage(
                    rachadura,
                    0, 0,
                    591, 422,
                    this.x - camera.x + 120, this.y - camera.y + 200,
                    491 * escala, 422 * escala
                )
            }
            if (this.estado_cpu === "funcionando") {
                filtro_de_cor("rgba(250, 255, 106, 0.54)")
                ctx.font = "100px Arial black";
                ctx.fillStyle = "rgb(12, 74, 0)";
                ctx.fillText("Memoria concertada 🎉", 70, 300);
                ctx.font = "30px Arial black";
                if (this.atualizar_timer) {
                    this.tempo_total = obterTempoDecorrido();
                    this.atualizar_timer = false;
                }
                ctx.fillText(this.tempo_total, 70, 400);

            }
        }


        if (this.loja_aberta) {
            const biblioteca_lojas = {

                memoria_ram: () => {
                    // desenha botão na tela (UI fixa)
                    filtro_de_cor("rgba(62, 62, 62, 0.8)");
                    botao_compra.desenhar_botao();
                    interface_loja();
                    ctx.drawImage(
                        imagem_memoria_ram,
                        0, 0,
                        500, 500,
                        400, 150,
                        350, 350
                    );
                    descricao(":Aumenta cadencia");
                    preco(this.preco_memoria_ram)


                    // verifica clique
                    if (botao_compra.verificar_colisao()) {
                        if (pontos - this.preco_memoria_ram <= 0) {
                            alerta("Pontos insuficientes");
                        } else {
                            pontos -= this.preco_memoria_ram;
                            jogador.cadencia -= 10;
                            this.preco_memoria_ram = Math.round(this.preco_memoria_ram) * 1.5;
                            this.loja_aberta = false;
                        }
                    }
                },

                hd: () => {
                    filtro_de_cor("rgba(62, 62, 62, 0.8)");
                    botao_compra.desenhar_botao();
                    interface_loja();
                    ctx.drawImage(
                        hdd,
                        0, 0,
                        577, 433,
                        400, 150,
                        350, 350
                    );
                    descricao(":Aumenta quantidade de balas maxima");
                    preco(this.preco_hdd);

                    if (botao_compra.verificar_colisao()) {
                        if (pontos - this.preco_hdd <= 0) {
                            alerta("Pontos insuficientes");
                        } else {
                            pontos -= this.preco_hdd;
                            jogador.quantidade_maxima_balas += 2;
                            this.preco_hdd = Math.round(this.preco_hdd) * 2;
                            this.loja_aberta = false;
                        }
                    }
                },

                ssd: () => {
                    filtro_de_cor("rgba(62, 62, 62, 0.8)");
                    botao_compra.desenhar_botao();
                    interface_loja();
                    ctx.drawImage(
                        imagem_ssd,
                        0, 0,
                        614, 407,
                        400, 150,
                        350, 350
                    );
                    descricao(":Diminue tempo de recarga")
                    preco(this.preco_ssd);

                    if (botao_compra.verificar_colisao()) {
                        if (pontos - this.preco_ssd <= 0) {
                            alerta("Pontos insuficientes");
                        } else {
                            pontos -= this.preco_ssd;
                            jogador.recarga -= 25;
                            this.preco_ssd = Math.round(this.preco_ssd) * 1.3;
                            this.loja_aberta = false;
                        }
                    }
                },
                cpu: () => {
                    filtro_de_cor("rgba(62, 62, 62, 0.8)");
                    botao_compra.desenhar_botao();
                    interface_loja();
                    ctx.drawImage(
                        cpu,
                        0, 0,
                        254, 234,
                        450, 200,
                        254, 234
                    );
                    descricao(":Memoria nova para finalizar jogo");
                    preco(300);

                    if (botao_compra.verificar_colisao()) {
                        if (pontos - 300 <= 0) {
                            alerta("Pontos insuficientes");
                        } else {
                            pontos -= 300;
                            this.estado_cpu = "funcionando";
                            this.loja_aberta = false;

                        }
                    }
                }
            };

            biblioteca_lojas[this.funcao]();
        }
    }
}

function interface_loja() {
    const scale = 1;
    ctx.drawImage(
        imagem_interface_loja,
        0, 0,
        544, 459,
        300, 100,
        544 * scale, 459 * scale
    )
};

function descricao(mensagem) {
    ctx.font = "30px Arial black";
    ctx.fillStyle = "rgb(206, 41, 41)";
    ctx.fillText(mensagem, 850, 350);
};
function preco(mensagem) {
    ctx.font = "30px Arial black";
    ctx.fillStyle = "rgb(206, 41, 41)";
    ctx.fillText(`:${mensagem} pontos`, 850, 390);
};

function filtro_de_cor(cor) {
    ctx.fillStyle = cor;
    ctx.fillRect(0, 0, 10000, 10000);
}
function alerta(mensagem) {
    ctx.font = "30px Arial black";
    ctx.fillStyle = "rgb(206, 41, 41)";
    ctx.fillText(mensagem, 420, 200);
};

class Cargas extends Objetos {
    constructor(x, y, largura, altura, raio, escala) {
        super(x, y, largura, altura)
        this.contador_timer = 0;
        this.save_timer = Math.floor(Math.random() * (5000 - 0 + 1)) + 0;
        this.carga = 0;
        this.estado = "descarregado";
        this.raio = raio;
        this.escala = escala;
        this.contador_tempo = 0;
        this.tempo_limite = 1000;
    };

    quebrar() {
        if (this.estado === "descarregado") this.contador_tempo = 0;
        if (this.estado === "carregado") {
            this.contador_tempo++;
            if (this.contador_tempo >= this.tempo_limite) {
                this.estado = "quebrado";
            };
        };
        if (this.estado === "quebrado") {
            ctx.drawImage(
                rachadura,
                0, 0,
                591, 422,
                this.x -camera.x - 20, this.y -camera.y - 20,
                491 * this.escala, 422 * this.escala
            )
        }
    }

    atualizar() {
        this.contador_timer++;
        if (this.contador_timer >= this.save_timer && this.estado === "descarregado") {
            this.contador_timer = this.save_timer;
            this.carga = Math.random() < 0.5 ? -1 : 1;
            this.estado = "carregado";
        };
    };

    desenhar() {
        if (this.estado === "carregado") {

            const raio = this.raio; // 🔧 controle do tamanho do círculo (pode ajustar aqui)

            if (this.carga >= 1) {
                ctx.fillStyle = `rgba(0,0,255, ${Math.abs(this.carga) * 0.2})`;
            } else if (this.carga <= -1) {
                ctx.fillStyle = `rgba(255,0,0, ${Math.abs(this.carga) * 0.2})`;
            }

            ctx.beginPath(); // inicia o desenho
            ctx.arc(
                (this.x - camera.x) + this.largura / 2, // centro X
                (this.y - camera.y) + this.altura / 2,  // centro Y
                raio, // raio do círculo
                0,
                Math.PI * 2 // círculo completo
            );
            ctx.fill(); // preenche o círculo
        }
    }

    descarregar() {
        if (this.estado === "carregado") {

            for (let i = 0; i < tiros.length; i++) {
                let tiro = tiros[i];

                if (verificar_colisao(this, tiro)) {
                    this.carga += tiro.carga;
                    tiros.splice(i, 1);
                    pontos += 10;
                    break;
                }
            }

            if (this.carga === 0) {
                this.estado = "descarregado";
                this.contador_timer = 0;
                this.save_timer = Math.floor(Math.random() * 1000);
            }
        }
    }
};


function verificar_colisao(a, b) {

    return (
        a.x < b.x + b.largura &&
        a.x + a.largura > b.x &&
        a.y < b.y + b.altura &&
        a.y + a.altura > b.y
    );

};


// FUNDO
class Interface {

    constructor(spritesheet) {

        this.spritesheet = spritesheet;
        this.x = 0;
        this.y = 0;
        this.estado_jogo = "rodando";
        this.angulo = 0;

    }

    desenhar_fundo() {

        ctx.drawImage(
            this.spritesheet,
            0,
            0,
            1024,
            1024,
            this.x - camera.x,
            this.y - camera.y,
            mapa.largura,
            mapa.altura
        );

    };

    animar_cursor() {

        if (this.estado_jogo !== "rodando") return;

        const escala = 0.3;
        const largura = 324 * escala;
        const altura = 276 * escala;

        ctx.save();

        ctx.translate(cursor.x, cursor.y);
        ctx.rotate(this.angulo);

        ctx.drawImage(
            cursos_mira,
            -largura / 2,
            -altura / 2,
            largura,
            altura
        );

        ctx.restore();

        this.angulo += 0.3;
    }

    mensagens_tela() {
        ctx.font = "30px Arial black";
        ctx.fillStyle = "rgb(0,255,0)";
        ctx.fillText(`Pontuação: ${Math.round(pontos)} pontos`, 10, 30);
    }
}


// OBJETOS
//barreiras.push(new Objetos(480, 970, 140, 220));
//barreiras.push(new Objetos(745, 970, 140, 220));
const botao_compra = new Botao(900, 50, 300, 300);
lojas.push(new Lojas(1650, 118, 980, 300, "memoria_ram"));
barreiras.push(new Objetos(1690, 118, 900, 230));
lojas.push(new Lojas(70, 400, 1035, 390, "hd"));
barreiras.push(new Objetos(70, 400, 1035, 290));
lojas.push(new Lojas(1650, 730, 980, 300, "ssd"));
barreiras.push(new Objetos(1650, 730, 980, 230))
lojas.push(new Lojas(1180, 1660, 730, 730, "cpu"));
barreiras.push(new Objetos(1240, 1810, 570, 440))

//CAPACITORES
cargas.push(new Cargas(1100, 1490, 100, 100, 60, 0.3));
cargas.push(new Cargas(1250, 1490, 100, 100, 60, 0.3));
cargas.push(new Cargas(1400, 1490, 100, 100, 60, 0.3));
cargas.push(new Cargas(1550, 1470, 100, 100, 60, 0.3));
cargas.push(new Cargas(1700, 1470, 100, 100, 60, 0.3));
cargas.push(new Cargas(1850, 1470, 100, 100, 60, 0.3));
cargas.push(new Cargas(1945, 2690, 320, 320, 155, 0.7));

barreiras.push(new Objetos(1100, 1490, 100, 100));
barreiras.push(new Objetos(1250, 1490, 100, 100));
barreiras.push(new Objetos(1400, 1490, 100, 100));
barreiras.push(new Objetos(1550, 1470, 100, 100));
barreiras.push(new Objetos(1700, 1470, 100, 100));
barreiras.push(new Objetos(1850, 1470, 100, 100));

function carregar_arrays() {
    for (let carga of cargas) {
        carga.quebrar();
        carga.atualizar();
        carga.desenhar();
        //console.log(carga.carga);

        carga.descarregar();
    }
}

const debug = false;

const interface = new Interface(fundo);
const jogador = new Personagem(personagem);



// CAMERA SEGUE JOGADOR
function atualizar_camera() {

    camera.x = jogador.x - canvas.width / 2;
    camera.y = jogador.y - canvas.height / 2;

    // LIMITES DA CAMERA
    if (camera.x <= 0) camera.x = 0;
    if (camera.y <= 0) camera.y = 0;
    if (camera.x + canvas.width >= mapa.largura) camera.x = mapa.largura - canvas.width;
    if (camera.y + canvas.height >= mapa.altura) camera.y = mapa.altura - canvas.height;

}


// LOOP
function loop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    jogador.atualizar();

    atualizar_camera();

    interface.desenhar_fundo();
    carregar_arrays();

    interface.desenhar_fundo();

    carregar_arrays();


    jogador.limites();
    jogador.recarregar();
    jogador.atirar();
    jogador.atualizar_tiros();
    jogador.desenhar_tiros();

    jogador.animar();
    jogador.desenhar();
    for (let loja of lojas) {
        loja.interagir();
    }

    interface.mensagens_tela();

    interface.animar_cursor();
    console.log(`posicao x: ${cursor.x + camera.x}, posicao y: ${cursor.y + camera.y}`);

    if (debug) {
        for (let obj of barreiras) {
            obj.colisao_visivel();
        };
        for (let loja of lojas) {
            loja.colisao_visivel();

        };
        for (let carga of cargas) {
            carga.colisao_visivel();
        };
    };

    requestAnimationFrame(loop);

}


// INICIAR
fundo.onload = () => {
    loop();
}