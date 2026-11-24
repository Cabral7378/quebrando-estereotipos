/* JavaScript básico: menu para celular, destaque do menu e quiz. */

// MENU PARA CELULAR
const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');
const menuLinks = document.querySelectorAll('.main-nav a');

menuButton.hidden = false;
menu.classList.add('menu-ready');

function closeMenu() {
  menu.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('.menu-label').textContent = 'Menu';
}

menuButton.addEventListener('click', function () {
  const isOpen = menu.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.querySelector('.menu-label').textContent = isOpen ? 'Fechar' : 'Menu';
});

menuLinks.forEach(function (link) {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && menu.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});

document.addEventListener('click', function (event) {
  if (!event.target.closest('.site-header')) closeMenu();
});

// Destaca no menu a seção que está sendo lida.
const sections = document.querySelectorAll('main > section');
function updateActiveSection() {
  const home = sections[0];
  header.classList.toggle('is-over-hero', home.getBoundingClientRect().bottom > header.offsetHeight);
  let currentId = home.id;
  sections.forEach(function (section) {
    if (section.getBoundingClientRect().top <= 160) currentId = section.id;
  });
  menuLinks.forEach(function (link) {
    if (link.getAttribute('href') === '#' + currentId) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

window.addEventListener('scroll', updateActiveSection, { passive: true });
window.addEventListener('resize', updateActiveSection);
updateActiveSection();

// QUIZ: altere ou acrescente objetos neste array para mudar as perguntas.
const questions = [
  {
    text: 'Pessoas mais velhas não conseguem aprender a usar novas tecnologias.',
    answer: 'estereotipo',
    explanation: 'A idade não define a capacidade de aprender. Experiências e acesso a oportunidades variam. Generalizar ignora as habilidades de cada pessoa.'
  },
  {
    text: 'Gênero não determina a capacidade de uma pessoa para exercer uma profissão.',
    answer: 'fato',
    explanation: 'Interesses, formação e habilidades são individuais. Dividir profissões em “para homens” e “para mulheres” cria barreiras e limita escolhas.',
    source: '#fonte-unesco',
    sourceLabel: 'Saiba mais na UNESCO'
  },
  {
    text: 'É possível saber o caráter de alguém pelo bairro onde mora.',
    answer: 'estereotipo',
    explanation: 'O endereço e a condição financeira não definem honestidade, caráter ou potencial. Para conhecer alguém, precisamos ir além das suposições.'
  },
  {
    text: 'Pessoas de um mesmo grupo podem ter histórias, interesses e habilidades diferentes.',
    answer: 'fato',
    explanation: 'Fazer parte de um grupo não torna as pessoas iguais. Cada indivíduo tem experiências próprias; um rótulo não conta sua história inteira.',
    source: '#fonte-apa',
    sourceLabel: 'Veja a definição da APA'
  },
  {
    text: 'Uma deficiência define tudo o que uma pessoa consegue fazer.',
    answer: 'estereotipo',
    explanation: 'A deficiência é uma das características de uma pessoa. Suas capacidades, interesses e necessidades são individuais. Acessibilidade e respeito à autonomia são fundamentais.',
    source: '#fonte-mdhc',
    sourceLabel: 'Entenda o capacitismo no MDHC'
  },
  {
    text: 'Em 2024, 69,8% das pessoas com 60 anos ou mais usaram a internet no Brasil.',
    answer: 'fato',
    explanation: 'Esse é um dado da PNAD Contínua TIC do IBGE. A pesquisa considera o uso nos três meses anteriores à entrevista. É um exemplo concreto para repensar os rótulos sobre idade e tecnologia.',
    source: '#fonte-ibge-internet',
    sourceLabel: 'Consulte a pesquisa do IBGE'
  }
];

const quizPlay = document.getElementById('quiz-play');
const quizResult = document.getElementById('quiz-result');
const counter = document.getElementById('quiz-counter');
const scoreLabel = document.getElementById('quiz-score');
const progress = document.getElementById('quiz-progress');
const questionTitle = document.getElementById('quiz-question');
const options = document.querySelectorAll('.quiz-option');
const feedback = document.getElementById('quiz-feedback');
const nextButton = document.getElementById('quiz-next');
const helper = document.getElementById('quiz-helper');
const restartButton = document.getElementById('quiz-restart');
let currentQuestion = 0;
let score = 0;
let answered = false;

function showQuestion(moveFocus) {
  const question = questions[currentQuestion];
  answered = false;
  counter.textContent = 'Pergunta ' + (currentQuestion + 1) + ' de ' + questions.length;
  scoreLabel.textContent = score + (score === 1 ? ' acerto' : ' acertos');
  questionTitle.textContent = '“' + question.text + '”';
  progress.max = questions.length;
  progress.value = currentQuestion;
  progress.textContent = currentQuestion + ' de ' + questions.length;
  options.forEach(function (button) {
    button.disabled = false;
    button.classList.remove('is-correct', 'is-incorrect', 'is-chosen');
    button.removeAttribute('aria-label');
    const answerState = button.querySelector('.answer-state');
    answerState.textContent = '';
    answerState.hidden = true;
  });
  feedback.hidden = true;
  feedback.replaceChildren();
  feedback.classList.remove('feedback-rethink');
  nextButton.hidden = true;
  helper.hidden = false;
  if (moveFocus) questionTitle.focus({ preventScroll: true });
}

function answerQuestion(chosenAnswer, chosenButton) {
  if (answered) return;
  answered = true;
  const question = questions[currentQuestion];
  const isCorrect = chosenAnswer === question.answer;
  if (isCorrect) score++;

  options.forEach(function (button) {
    const isRightAnswer = button.dataset.answer === question.answer;
    const wasChosen = button === chosenButton;
    button.disabled = true;
    button.classList.add(isRightAnswer ? 'is-correct' : 'is-incorrect');
    button.classList.toggle('is-chosen', wasChosen);

    const answerState = button.querySelector('.answer-state');
    answerState.textContent = (isRightAnswer ? 'Certa' : 'Errada') + (wasChosen ? ' · sua escolha' : '');
    answerState.hidden = false;
    const answerLabel = button.querySelector('.answer-label').textContent;
    button.setAttribute('aria-label', answerLabel + '. Resposta ' + (isRightAnswer ? 'certa.' : 'errada.') + (wasChosen ? ' Sua escolha.' : ''));
  });

  const feedbackTitle = document.createElement('strong');
  feedbackTitle.textContent = (isCorrect ? 'Isso mesmo! ' : 'Vamos repensar? ') + (question.answer === 'fato' ? 'É fato.' : 'É estereótipo.');
  const explanation = document.createElement('p');
  explanation.textContent = question.explanation;
  feedback.append(feedbackTitle, explanation);

  if (question.source) {
    const sourceLink = document.createElement('a');
    sourceLink.href = question.source;
    sourceLink.textContent = question.sourceLabel;
    feedback.append(sourceLink);
  }

  feedback.classList.toggle('feedback-rethink', !isCorrect);
  feedback.hidden = false;
  progress.value = currentQuestion + 1;
  progress.textContent = (currentQuestion + 1) + ' de ' + questions.length;
  scoreLabel.textContent = score + (score === 1 ? ' acerto' : ' acertos');
  helper.hidden = true;
  nextButton.textContent = currentQuestion === questions.length - 1 ? 'Ver meu resultado' : 'Próxima pergunta';
  nextButton.hidden = false;
  nextButton.focus({ preventScroll: true });
}

options.forEach(function (button) {
  button.addEventListener('click', function () {
    answerQuestion(button.dataset.answer, button);
  });
});

function showResult() {
  quizPlay.hidden = true;
  quizResult.hidden = false;
  document.getElementById('result-score').textContent = 'Você acertou ' + score + ' de ' + questions.length + ' perguntas.';

  let message;
  if (score === questions.length) {
    message = 'Você reconheceu todos os exemplos! Continue questionando generalizações e abrindo espaço para conhecer outras histórias.';
  } else if (score >= questions.length / 2) {
    message = 'Você já reconhece muitos rótulos. Releia os conceitos e continue praticando: repensar também faz parte de aprender.';
  } else {
    message = 'Todo aprendizado começa com uma pergunta. Revisite os conceitos e tente de novo. O objetivo é ampliar o olhar, no seu tempo.';
  }
  document.getElementById('result-message').textContent = message;
  document.getElementById('result-title').focus({ preventScroll: true });
}

nextButton.addEventListener('click', function () {
  if (!answered) return;
  currentQuestion++;
  if (currentQuestion < questions.length) showQuestion(true);
  else showResult();
});

restartButton.addEventListener('click', function () {
  currentQuestion = 0;
  score = 0;
  quizResult.hidden = true;
  quizPlay.hidden = false;
  showQuestion(true);
});

quizPlay.hidden = false;
showQuestion(false);
