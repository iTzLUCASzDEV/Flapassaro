const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
  canvas.style.width = '100vw'
  canvas.style.height = '100vh'
  canvas.style.border = 'transparent'
  document.querySelector('body').style.background = '#63b623'
}

const bird_image = new Image()
bird_image.src = './Sprites/sprites4.png'

const bird_image2 = new Image()
bird_image2.src = './Sprites/sprites5.png'

const bird_image3 = new Image()
bird_image3.src = './Sprites/sprites6.png'

const fundo_image = new Image()
fundo_image.src = './Sprites/sprites2.png'

const chao_image = new Image()
chao_image.src = './Sprites/sprites3.png'

const cano1_image = new Image()
cano1_image.src = './Sprites/sprites7.png'

const cano2_image = new Image()
cano2_image.src = './Sprites/sprites8.png'

const inicio_image = new Image()
inicio_image.src = './Sprites/inicio.png'

const gameover_image = new Image()
gameover_image.src = './Sprites/sprites9.png'

const medal_image = new Image()
medal_image.src = './Sprites/sprites10.png'

const medal_image1 = new Image()
medal_image1.src = './Sprites/sprites12.png'

const medal_image2 = new Image()
medal_image2.src = './Sprites/sprites131.png'

const medal_image3 = new Image()
medal_image3.src = './Sprites/sprites14.png'


const musica_jogo = new Audio()
musica_jogo.src = './Sounds/Heatwave_DNB_09-10-2021_11-52.mp3'
musica_jogo.volume = '0.1'
musica_jogo.loop = 'loop'

const musica_inicio = new Audio()
musica_inicio.src = './Sounds/Música sem título.mp3'
musica_inicio.volume = '0.01'

const som_morte = new Audio()
som_morte.src = './Sounds/som_morte.mp3'

function fazColisao(Bird, chao) {
  const BirdY = Bird.spriteY + 17;
  const chaoY = chao.spriteY;
  if (BirdY >= chaoY) {
    return true;
  }
  return false;
}

let score_player_maior = localStorage.getItem('score')

let frames = 0

let medal_atual = 0

function cria_bird() {
  const bird = {
    spriteX: 10,
    spriteY: 10,
    pulo: 4,
    pula() {
      bird.velocidade = -bird.pulo
    },
    gravidade: 0.20,
    velocidade: 0,
    atualiza() {
      bird.velocidade += bird.gravidade
      bird.spriteY += bird.velocidade
      if (fazColisao(bird, globais.chao)) {
        som_morte.play()
        mudatela(telas.GAMEOVER)
      }
    },
    frame_atual: 0,
    sprite_bird: 4,
    attFrame() {
      bird.frame_atual++
      if (bird.frame_atual == 7) {
        bird.sprite_bird = 4
      } else if (bird.frame_atual == 17) {
        bird.sprite_bird = 5
      } else if (bird.frame_atual == 27) {
        bird.sprite_bird = 6
      } else if (bird.frame_atual == 37) {
        bird.sprite_bird = 5
        bird.frame_atual = 0
      }
    },
    desenha() {
      bird.attFrame()
      bird_image.src = `./Sprites/sprites${bird.sprite_bird}.png`
      contexto.drawImage(bird_image, bird.spriteX, bird.spriteY)
    }
  }
  return bird
}

const fundo = {
  desenha() {
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0, 0, canvas.width, canvas.height)
    contexto.drawImage(fundo_image, 0, 280, 320, 201)
  }
}

function cria_canos() {
  const canos = {
    spriteX: 200,
    spriteY: 0,
    altura: 400,
    largura: 52,
    desenha() {
      canos.pares.forEach(function (par) {
        const y_random = par.y
        const espaco = 110
        const canoCeuX = par.x
        const canoCeuY = y_random
        contexto.drawImage(cano2_image, canoCeuX, canoCeuY, canos.largura, canos.altura)

        const canoChaoX = par.x
        const canoChaoY = canos.altura + espaco + y_random
        contexto.drawImage(cano1_image, canoChaoX, canoChaoY, canos.largura, canos.altura)
        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY
        }
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY
        }
      })
    },
    colisao_bird(par) {
      const bird_cabeca = globais.bird.spriteY
      const bird_pe = globais.bird.spriteY + 24
      if (globais.bird.spriteX + 35 >= par.x) {
        if (bird_cabeca <= par.canoCeu.y) {
          return true
        }
        if (bird_pe >= par.canoChao.y) {
          return true
        }
      }
      return false
    },
    pares: [],
    atualiza() {
      const pass_100_frames = frames % 100 === 0
      if (pass_100_frames) {
        canos.pares.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        })
      }
      canos.pares.forEach(function (par) {
        par.x -= 2
        if (canos.colisao_bird(par)) {
          som_morte.play()
          mudatela(telas.GAMEOVER)
        }
        if (par.x + canos.largura <= 0) {
          canos.pares.shift()
        }
        if (par.x + canos.largura == 24) {
          globais.score.score_player++
        }
      })
    }
  }
  return canos
}

function cria_chao() {
  const chao = {
    spriteX: 0,
    spriteY: 380,
    largura: 100,
    atualiza() {
      const mov_chao = 1
      const mov_repete = chao.largura / 2.1
      const mov = chao.spriteX - mov_chao
      chao.spriteX = mov % mov_repete
    },
    desenha() {
      contexto.drawImage(chao_image, chao.spriteX, chao.spriteY, chao.spriteY, chao.largura)
    }
  }
  return chao
}

const my_name = {
  desenha() {
    contexto.font = '12px Courier'
    contexto.textAlign = 'center'
    contexto.fillStyle = 'black'
    contexto.fillText('criado e desenvolvido por Lucas Yamada', canvas.width - canvas.width / 2, 420)
    contexto.font = '10px Arial'
    contexto.fillStyle = 'black'
    contexto.fillText('v1.3', canvas.width - 20, canvas.height - 10)
    if (localStorage.getItem('score') >= 1 && localStorage.getItem('score') < 5) {
      contexto.drawImage(medal_image, 48, 0, 44, 44, 6, 430, 44, 44)
    }
    if (localStorage.getItem('score') >= 5 && localStorage.getItem('score') < 15) {
      contexto.drawImage(medal_image, 0, 0, 44, 44, 6, 430, 44, 44)
    }
    if (localStorage.getItem('score') >= 15 && localStorage.getItem('score') < 30) {
      contexto.drawImage(medal_image, 48, 46, 44, 44, 6, 430, 44, 44)
    }
    if (localStorage.getItem('score') >= 30 && localStorage.getItem('score') < 50) {
      contexto.drawImage(medal_image, 0, 44, 44, 47, 6, 428, 44, 47)
    }
    if (localStorage.getItem('score') >= 50 && localStorage.getItem('score') < 70) {
      contexto.drawImage(medal_image1, 48, 0, 44, 44, 6, 430, 44, 44)
    }
    if (localStorage.getItem('score') >= 70 && localStorage.getItem('score') < 90) {
      contexto.drawImage(medal_image1, 0, 0, 44, 44, 6, 430, 44, 44)
    }
    if (localStorage.getItem('score') >= 90 && localStorage.getItem('score') < 100) {
      contexto.drawImage(medal_image1, 48, 46, 44, 44, 6, 430, 44, 44)
    }
    if (localStorage.getItem('score') >= 100 && localStorage.getItem('score') < 150) {
      contexto.drawImage(medal_image1, 0, 44, 44, 47, 6, 428, 44, 47)
    }
    if (localStorage.getItem('score') >= 150 && localStorage.getItem('score') < 200) {
      contexto.drawImage(medal_image3, 6, 430)
    }
    if (localStorage.getItem('score') >= 200) {
      contexto.drawImage(medal_image2, 6, 430)
    }
    contexto.font = '20px VT323'
    contexto.textAlign = 'center'
    contexto.fillStyle = 'black'
    if (localStorage.getItem('score') == null) {
      localStorage.setItem('score', 0)
    }
    contexto.fillText(localStorage.getItem('score'), canvas.width - canvas.width / 2, canvas.height - 20)
    contexto.font = '12px VT323'
    contexto.textAlign = 'center'
    contexto.fillStyle = 'black'
    contexto.fillText('HIGHSCORE', canvas.width - canvas.width / 2, canvas.height - 10)
  }
}

const mensagem_inicio = {
  spriteX: 70,
  spriteY: 50,
  desenha() {
    contexto.drawImage(inicio_image, mensagem_inicio.spriteX, mensagem_inicio.spriteY)
  }
}

const mensagem_gameover = {
  desenha() {
    contexto.drawImage(gameover_image, 50, 100)
    contexto.font = '30px VT323'
    contexto.textAlign = ''
    contexto.fillStyle = 'white'
    contexto.fillText(`${globais.score.score_player}`, 237, 195)
    if (globais.score.score_player >= 1 && globais.score.score_player < 5) {
      contexto.drawImage(medal_image, 48, 0, 44, 44, 76, 187, 44, 44)
    }
    if (globais.score.score_player >= 5 && globais.score.score_player < 15) {
      contexto.drawImage(medal_image, 0, 0, 44, 44, 76, 187, 44, 44)
    }
    if (globais.score.score_player >= 15 && globais.score.score_player < 30) {
      contexto.drawImage(medal_image, 48, 46, 44, 44, 76, 187, 44, 44)
    }
    if (globais.score.score_player >= 30 && globais.score.score_player < 50) {
      contexto.drawImage(medal_image, 0, 44, 44, 47, 76, 185, 44, 47)
    }
    if (globais.score.score_player >= 50 && globais.score.score_player < 70) {
      contexto.drawImage(medal_image1, 48, 0, 44, 44, 76, 187, 44, 44)
    }
    if (globais.score.score_player >= 70 && globais.score.score_player < 90) {
      contexto.drawImage(medal_image1, 0, 0, 44, 44, 76, 187, 44, 44)
    }
    if (globais.score.score_player >= 90 && globais.score.score_player < 100) {
      contexto.drawImage(medal_image1, 48, 46, 44, 44, 76, 187, 44, 44)
    }
    if (globais.score.score_player >= 100 && globais.score.score_player < 150) {
      contexto.drawImage(medal_image1, 0, 44, 44, 47, 76, 185, 44, 47)
    }
    if (globais.score.score_player >= 150 && globais.score.score_player < 200) {
      contexto.drawImage(medal_image3, 76, 187)
    }
    if (globais.score.score_player >= 200) {
      contexto.drawImage(medal_image2, 76, 187)
    }
  },
  atualiza() {
    contexto.font = '30px VT323'
    contexto.textAlign = ''
    contexto.fillStyle = 'white'
    if (globais.score.score_player > localStorage.getItem('score')) {
      localStorage.setItem('score', globais.score.score_player)
      score_player_maior = localStorage.getItem('score')
    }
    if (localStorage.getItem('score') == null) {
      score_player_maior = 0
    }
    contexto.fillText(`${score_player_maior}`, 237, 235)
  }
}

const globais = {}
let telaAtiva = {}

function mudatela(tela) {
  telaAtiva = tela
  if (telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}

function cria_placar() {
  const placar = {
    score_player: 0,
    desenha() {
      contexto.font = '40px VT323'
      contexto.textAlign = 'right'
      contexto.fillStyle = 'white'
      contexto.fillText(`${placar.score_player}`, canvas.width - 20, 40)
    },
    atualiza() {

    }
  }
  return placar
}

const telas = {
  INICIO: {
    inicializa() {
      globais.bird = cria_bird()
      globais.chao = cria_chao()
      globais.canos = cria_canos()
    },
    desenha() {
      fundo.desenha()
      globais.bird.desenha()
      globais.chao.desenha()
      mensagem_inicio.desenha()
      my_name.desenha()
    },
    click() {
      mudatela(telas.JOGO)
    },
    atualiza() {
      globais.chao.atualiza()
    },
  }
}

telas.JOGO = {
  inicializa() {
    globais.score = cria_placar()
  },
  desenha() {
    fundo.desenha()
    globais.canos.desenha()
    globais.chao.desenha()
    globais.bird.desenha()
    globais.score.desenha()
  },
  click() {
    globais.bird.pula()
  },
  atualiza() {
    globais.canos.atualiza()
    globais.chao.atualiza()
    globais.bird.atualiza()
    globais.score.atualiza()
  }
}

telas.GAMEOVER = {
  desenha() {
    mensagem_gameover.desenha()
  },
  atualiza() {
    mensagem_gameover.atualiza()
  },
  click() {
    mudatela(telas.INICIO)
  }
}

function loop() {
  telaAtiva.desenha()
  telaAtiva.atualiza()
  frames++
  requestAnimationFrame(loop)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

window.addEventListener('click', function () {
  if (telaAtiva.click()) {
    telaAtiva.click()
  }
})

mudatela(telas.INICIO)
loop()