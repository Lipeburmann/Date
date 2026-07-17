document.addEventListener('DOMContentLoaded', () => {
    const tela1 = document.getElementById('tela1');
    const tela2 = document.getElementById('tela2');
  
    const btnSim = document.getElementById('btn-sim');
    const btnNao = document.getElementById('btn-nao');
    const audioTriste = document.getElementById('sad-audio');
  
    const DISTANCIA_FUGA = 130;
    let jaEstaSolto = false; // controla se o botão já virou "fixed"
  
    function distancia(x1, y1, x2, y2) {
      return Math.hypot(x2 - x1, y2 - y1);
    }
  
    function fugirDoCursor(cursorX, cursorY) {
      // na primeira fuga, "solta" o botão do fluxo normal
      if (!jaEstaSolto) {
        const rect = btnNao.getBoundingClientRect();
        btnNao.style.position = 'fixed';
        btnNao.style.left = rect.left + 'px';
        btnNao.style.top = rect.top + 'px';
        btnNao.style.margin = '0';
        jaEstaSolto = true;
      }
  
      const largura = btnNao.offsetWidth;
      const altura = btnNao.offsetHeight;
  
      const maxX = window.innerWidth - largura - 10;
      const maxY = window.innerHeight - altura - 10;
  
      let novoX, novoY, tentativas = 0;
  
      do {
        novoX = Math.random() * maxX + 5;
        novoY = Math.random() * maxY + 5;
        tentativas++;
      } while (
        distancia(cursorX, cursorY, novoX + largura / 2, novoY + altura / 2) < DISTANCIA_FUGA * 1.3 &&
        tentativas < 20
      );
  
      btnNao.style.left = novoX + 'px';
      btnNao.style.top = novoY + 'px';
    }
  
    function checarProximidade(x, y) {
      const rect = btnNao.getBoundingClientRect();
      const centroX = rect.left + rect.width / 2;
      const centroY = rect.top + rect.height / 2;
  
      if (distancia(x, y, centroX, centroY) < DISTANCIA_FUGA) {
        fugirDoCursor(x, y);
      }
    }
  
    document.addEventListener('mousemove', (e) => {
      if (!tela1.classList.contains('escondida')) {
        checarProximidade(e.clientX, e.clientY);
      }
    });
  
    btnNao.addEventListener('mouseenter', (e) => {
      fugirDoCursor(e.clientX, e.clientY);
    });
  
    btnNao.addEventListener('mousedown', (e) => {
      e.preventDefault();
      fugirDoCursor(e.clientX, e.clientY);
    });
  
    document.addEventListener('touchmove', (e) => {
      if (!tela1.classList.contains('escondida')) {
        const toque = e.touches[0];
        checarProximidade(toque.clientX, toque.clientY);
      }
    });
  
    btnNao.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const toque = e.touches[0];
      fugirDoCursor(toque.clientX, toque.clientY);
    });
  
    btnNao.addEventListener('click', () => {
      audioTriste.currentTime = 0;
      audioTriste.play().catch(() => {});
    });
  
    window.addEventListener('resize', () => {
      if (!jaEstaSolto) return; // se ainda não fugiu, não tem nada pra reposicionar
      const rect = btnNao.getBoundingClientRect();
      const maxX = window.innerWidth - rect.width - 10;
      const maxY = window.innerHeight - rect.height - 10;
      btnNao.style.left = Math.min(rect.left, maxX) + 'px';
      btnNao.style.top = Math.min(rect.top, maxY) + 'px';
    });
