export default pageScroll;

//смещение для параллакса
let parallaxOffset = 20;

let scrollContainer = document.querySelector('.main');
let parallaxContainer = document.querySelector('.slide-section__parallax');

/**
 * @description Функция для инициализации скролла страницы
 */
function pageScroll() {
  //точка начала нажатия
  let touchStart = 0;

  let scrollDownArrow = document.querySelector('.scroll-down');

  //устанавливает начальное значение трансформации
  scrollContainer.style.transform = 'translateY(0%)';
  parallaxContainer.style.transform = `translateY(${parallaxOffset}%)`;

  //обработчик события на начало нажатия
  document.addEventListener('touchstart', (e) => {
    touchStart = e.targetTouches[0].clientY;
  });

  //обработчик события на конец нажатия
  document.addEventListener('touchend', (e) => {
    console.log(e);
    //точка конца нажатия
    let touchEnd = e.changedTouches[0].clientY;

    //разница между точками начала и конца
    let touchDiff = touchStart - touchEnd;
    let direction;

    //если свайпа не было, то выходим из функции
    if (touchDiff === 0) return;

    //устанавливает направление свайпа
    direction = touchDiff < 0 ? 'up' : 'down';

    scroll(direction);
  });

  //обработчик события при нажатии на кнопку
  scrollDownArrow.addEventListener('click', () => {
    scroll('down');
  });
}

/**
 * Функция для скролла страницы
 * @param direction {string} Направление скролла
 */
function scroll(direction) {
  let activePaginationNumber;
  let transform;

  let sectionsLength = document.getElementsByClassName('slide-section').length - 1;

  //текущее состояние трансформации
  let currentOffset = getNumber(scrollContainer.style.transform);
  let transformOffset = currentOffset;

  //следующее состояние трансформации
  if (direction === 'up' && currentOffset !== 0) {
    transformOffset = currentOffset + 100;
    parallax(direction);
  }
  else if (direction === 'down' && currentOffset !== sectionsLength * -100) {
    transformOffset = currentOffset - 100;
    parallax(direction);
  }

  //устаналивает новое состояние трансформации
  transform = `translateY(${transformOffset}%)`;
  scrollContainer.style.transform = transform;

  //следующий номер активной пагинации
  activePaginationNumber = Math.abs(transformOffset / 100);
  setPagination(activePaginationNumber);
}

/**
 * @description Меняет активную пагинацию
 * @param activeNumber {number} Номер устанавливаемой пагинации
 */
function setPagination(activeNumber) {
  let paginationList = document.getElementsByClassName('pagination__item');

  for (let i = 0; i < paginationList.length; i++) {
    //делает пагинацию активной
    if (i === activeNumber) {
      paginationList[i].classList.add('active');
      continue;
    }

    //остальные делает неактивными
    paginationList[i].classList.remove('active');
  }
}

/**
 * @description Функция для параллакса на втором слайде
 * @param direction {string} Направление параллакса
 */
function parallax(direction) {
  let containerTransform = parallaxContainer.style.transform;

  let currentParallax = getNumber(containerTransform);
  let transformParallax = direction === 'up' ? currentParallax + parallaxOffset : currentParallax - parallaxOffset;

  parallaxContainer.style.transform = `translateY(${transformParallax}%)`;
}

/**
 * @description Функция для извлечения числа из строки
 * @param string {string} Строка, из которой извлекается число
 * @returns {number} Извлеченное число
 */
function getNumber(string) {
  return parseInt(string.match(/-?\d+/));
}