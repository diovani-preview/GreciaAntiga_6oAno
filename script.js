"use strict";

const apresentacao = document.getElementById("apresentacao");
const slides = Array.from(document.querySelectorAll(".slide"));
const botaoAnterior = document.getElementById("anterior");
const botaoProximo = document.getElementById("proximo");
const botaoFullscreen = document.getElementById("fullscreen");
const numeroAtual = document.getElementById("numeroAtual");
const totalSlides = document.getElementById("totalSlides");
const indicadores = document.getElementById("indicadores");
const ajuda = document.getElementById("ajuda");
const slide14 = document.getElementById("slide14");
const slide15 = document.getElementById("slide15");

const linkYoutube = "https://youtu.be/UJDqNuIpjFU?si=7gpab8p0RHTzNQI3";

let slideAtual = 0;

totalSlides.textContent = slides.length;

slides.forEach((slide, indice) => {
  const indicador = document.createElement("button");
  indicador.type = "button";
  indicador.className = "indicador";
  indicador.setAttribute("aria-label", `Ir para o slide ${indice + 1}`);
  indicador.addEventListener("click", () => irParaSlide(indice));
  indicadores.appendChild(indicador);
});

function mostrarSlide() {
  slides.forEach((slide, indice) => {
    const estaAtivo = indice === slideAtual;
    slide.classList.toggle("ativo", estaAtivo);
    slide.setAttribute("aria-hidden", estaAtivo ? "false" : "true");
  });

  numeroAtual.textContent = slideAtual + 1;
  atualizarIndicadores();
  atualizarSetas();
  atualizarAjudaEspecial();
}

function atualizarIndicadores() {
  const pontos = document.querySelectorAll(".indicador");
  pontos.forEach((ponto, indice) => {
    ponto.classList.toggle("ativo", indice === slideAtual);
    ponto.setAttribute("aria-current", indice === slideAtual ? "true" : "false");
  });
}

function atualizarSetas() {
  botaoAnterior.style.opacity = slideAtual === 0 ? "0.18" : "";
  botaoProximo.style.opacity = slideAtual === slides.length - 1 ? "0.18" : "";
}

function atualizarAjudaEspecial() {
  if (slideAtual === 13) {
    ajuda.textContent = "Clique na imagem para continuar";
    ajuda.classList.remove("ocultar");
    return;
  }

  if (slideAtual === 14) {
    ajuda.textContent = "Clique na imagem para assistir ao vídeo";
    ajuda.classList.remove("ocultar");
    return;
  }

  ajuda.textContent = "Use ← → ou deslize para navegar";
}

function irParaSlide(indice) {
  if (indice < 0 || indice >= slides.length) return;
  slideAtual = indice;
  mostrarSlide();
  preCarregarProximos();
}

function avancar() {
  if (slideAtual < slides.length - 1) {
    irParaSlide(slideAtual + 1);
  }
}

function voltar() {
  if (slideAtual > 0) {
    irParaSlide(slideAtual - 1);
  }
}

botaoProximo.addEventListener("click", avancar);
botaoAnterior.addEventListener("click", voltar);

slide14.addEventListener("click", () => {
  if (slideAtual === 13) {
    irParaSlide(14);
  }
});

slide15.addEventListener("click", () => {
  if (slideAtual === 14) {
    window.location.href = linkYoutube;
  }
});

document.addEventListener("keydown", (evento) => {
  if (evento.key === "ArrowRight" || evento.key === "PageDown") avancar();
  if (evento.key === "ArrowLeft" || evento.key === "PageUp") voltar();

  if (evento.code === "Space") {
    evento.preventDefault();
    avancar();
  }

  if (evento.key === "Home") irParaSlide(0);
  if (evento.key === "End") irParaSlide(slides.length - 1);
  if (evento.key.toLowerCase() === "f") alternarTelaCheia();

  if (evento.key === "Enter" && slideAtual === 13) {
    irParaSlide(14);
  } else if (evento.key === "Enter" && slideAtual === 14) {
    window.location.href = linkYoutube;
  }
});

async function alternarTelaCheia() {
  try {
    if (!document.fullscreenElement) {
      if (apresentacao.requestFullscreen) {
        await apresentacao.requestFullscreen();
      }
    } else if (document.exitFullscreen) {
      await document.exitFullscreen();
    }
  } catch (erro) {
    console.log("O modo tela cheia não está disponível.", erro);
  }
}

botaoFullscreen.addEventListener("click", alternarTelaCheia);

document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) {
    botaoFullscreen.textContent = "×";
    botaoFullscreen.title = "Sair da tela cheia";
    botaoFullscreen.setAttribute("aria-label", "Sair da tela cheia");
  } else {
    botaoFullscreen.textContent = "⛶";
    botaoFullscreen.title = "Tela cheia";
    botaoFullscreen.setAttribute("aria-label", "Ativar tela cheia");
  }
});

let inicioX = 0;
let inicioY = 0;

apresentacao.addEventListener("touchstart", (evento) => {
  const toque = evento.changedTouches[0];
  inicioX = toque.clientX;
  inicioY = toque.clientY;
}, { passive: true });

apresentacao.addEventListener("touchend", (evento) => {
  const toque = evento.changedTouches[0];
  analisarSwipe(toque.clientX, toque.clientY);
}, { passive: true });

function analisarSwipe(finalX, finalY) {
  const movimentoX = inicioX - finalX;
  const movimentoY = inicioY - finalY;
  const distanciaMinima = 50;

  if (Math.abs(movimentoX) < distanciaMinima) return;
  if (Math.abs(movimentoX) <= Math.abs(movimentoY)) return;

  if (movimentoX > 0) avancar();
  else voltar();
}

window.setTimeout(() => {
  if (slideAtual < 13) ajuda.classList.add("ocultar");
}, 4000);

function preCarregarImagem(indice) {
  if (indice < 0 || indice >= slides.length) return;
  const imagem = slides[indice].querySelector("img");
  if (!imagem) return;

  const preCarregar = new Image();
  preCarregar.src = imagem.getAttribute("src");
}

function preCarregarProximos() {
  preCarregarImagem(slideAtual + 1);
  preCarregarImagem(slideAtual + 2);
}

function iniciarPreCarregamento() {
  preCarregarImagem(0);
  preCarregarImagem(1);
  preCarregarImagem(2);

  window.setTimeout(() => {
    slides.forEach((slide, indice) => {
      if (indice > 2) preCarregarImagem(indice);
    });
  }, 800);
}

slides.forEach((slide) => {
  const imagem = slide.querySelector("img");
  if (!imagem) return;

  imagem.addEventListener("error", () => {
    console.error("Não foi possível carregar:", imagem.src);
  });
});

mostrarSlide();
iniciarPreCarregamento();
