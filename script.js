/**
 * Retorna um inteiro aleatório entre dois números
 **/
function getRandomBetween(min, max) {
  return Math.trunc(Math.random() * (max - min) + min);
}

/**
 * Embaralha os valores de um array
 **/
function shuffle(array) {
  let result = array;
  for (let i = result.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Exibe o valor dos inputs do tipo range no output
 **/
const allRanges = document.querySelectorAll(".range-wrap");
allRanges.forEach(wrap => {
  const range = wrap.querySelector(".range-wrap input");
  const bubble = wrap.querySelector(".bubble");

  range.addEventListener("input", () => {
    setBubble(range, bubble);
  });
  setBubble(range, bubble);
});

function setBubble(range, bubble) {
  const val = range.value;
  const min = range.min ? range.min : 0;
  const max = range.max ? range.max : 100;
  const newVal = Number(((val - min) * 100) / (max - min));
  bubble.innerHTML = val;

  // Sorta magic numbers based on size of the native UI thumb
  bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
}

/**
 * Previne o formulário de ser enviado
 **/
document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
})


const tabela = {
  elemento: document.querySelector('#table'),
  matriz: [],
  colunas,
  linhas,
  build(colunas, linhas) {
    this.colunas = colunas;
    this.linhas = linhas;
    this.matriz = [...Array(colunas)].map(() => Array(linhas).fill(undefined));
    while (this.elemento.firstElementChild) {
      this.elemento.firstElementChild.remove();
    }
    for (let i = 0; i < colunas; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < linhas; j++) {
        const cell = document.createElement("td");
        row.appendChild(cell);
      }
      this.elemento.append(row);
    }
  },
  attemptInsertWorld(x, y, sumX, sumY, world) {
    const newMatriz = JSON.parse(JSON.stringify(this.matriz));
    let newX = x;
    let newY = y;
    let count = 0;
    while (count < world.length) {
      if (newMatriz[newX][newY] === undefined 
          || newMatriz[newX][newY] === null 
          || newMatriz[newX][newY] === world[count]) {
        newMatriz[newX][newY] = world[count];
      } else {
        return false;
      }
      newX = newX + sumX;
      newY = newY + sumY;
      count++;
    }
    this.matriz = newMatriz;
    return true;
  },
  insertWorld(world) {
    let attempt = 0;
    while (attempt < 100) {
      attempt++;
      let x = getRandomBetween(0, this.colunas);
      let y = getRandomBetween(0, this.linhas);
      let count = 0;
      let direcoes = shuffle(['cima', 'direita', 'baixo', 'esquerda'])

      while (count < 4) {
        let direcao = direcoes[count];
        count++;
        if (direcao == 'cima' && world.length <= y + 1) {
          if (this.attemptInsertWorld(x, y, 0, -1, world)) return true;
        } else if (direcao == 'direita' && world.length < this.matriz.length - x) {
          if (this.attemptInsertWorld(x, y, 1, 0, world)) return true;
        } else if (direcao == 'baixo' && world.length < this.matriz[x].length - y) {
          if (this.attemptInsertWorld(x, y, 0, 1, world)) return true;
        } else if (direcao == 'esquerda' && world.length <= x + 1) {
          if (this.attemptInsertWorld(x, y, -1, 0, world)) return true;
        }
      }
    }
    return false;
  },
  complete(){
    this.matriz = this.matriz.map(x => {
      return x.map(y => {
        if(y === null || y === undefined) {
          return String.fromCharCode(getRandomBetween(65,90));
        }else{
          return y;
        }
      })
    })
  }
}

const onChangeTableSize = () => {
  const colunas = Number(document.querySelector('#colunas').value);
  const linhas = Number(document.querySelector('#linhas').value);
  tabela.build(colunas, linhas)
}

onChangeTableSize();

const renderMatriz = () => {
  let x = 0;
  let y = 0;
  document.querySelectorAll('#table tr').forEach(tr => {
    tr.querySelectorAll('td').forEach(td => {
      td.innerText = tabela.matriz[x][y] || '';
      x++;
    })
    x = 0;
    y++;
  })
}

document.querySelector('.pin-button').addEventListener('click', () => {
  document.querySelectorAll('.fail').forEach(ele => {
    ele.classList.remove('fail');
  })
  onChangeTableSize();
  document.querySelectorAll('.world-form-group input').forEach((element => {
    if (tabela.insertWorld(element.value)) {
    } else {
      element.classList.add('fail');
    }
  }));
  renderMatriz();
})


document.querySelectorAll('.range-wrap input').forEach((ele) => {
  ele.addEventListener('change', onChangeTableSize);
})

const wordlInputCreate = () => {
  const groupPlusContainer = document.querySelector('.world-form-group')
  const newWordlWrap = document.createElement('div');
  const newWordlInput = document.createElement('input');
  const newWordlButtonRemove = document.createElement('button');

  newWordlWrap.classList.add('world-wrap');
  newWordlInput.type = 'text'
  newWordlButtonRemove.classList.add('button-remove');
  newWordlButtonRemove.innerText = '-';
  newWordlButtonRemove.type = 'button';

  newWordlButtonRemove.addEventListener('click', () => {
    newWordlWrap.remove();
  });

  newWordlWrap.append(newWordlInput, newWordlButtonRemove)
  groupPlusContainer.append(newWordlWrap)
}

wordlInputCreate();

document.querySelector('.add-button').addEventListener('click', () => {
  wordlInputCreate();
})

document.querySelector('.complete-button').addEventListener('click', () => {
  tabela.complete();
  renderMatriz();
})