export default slider;

let sliderList = document.querySelector('.slider__list');

/**
 * @description Функция инициализирующая слайдер
 */
function slider() {
  let sliderControl = document.querySelector('.slider__control');
  let sliderSwitcherContainer = document.querySelector('.slider__switcher-container');
  let sliderSwitcher = document.querySelector('.slider__switcher');
  let sliderActiveLine = document.querySelector('.slider__line_active');

  //координаты и ширина контрола
  let sliderCoords = sliderControl.getBoundingClientRect();
  let sliderCoordLeft = sliderCoords.left;
  let sliderWidth = sliderControl.clientWidth;

  //начальное нажатие
  let startTouch;

  //для состояния слайдера
  let startStateTransform = 0;
  let endStateTransform = 0;

  //стили
  let startTransition = 'transform 100ms';
  let endTransition = 'transform 1s';

  //для работы со слайдами
  let nextSlide = 0;
  let canSliderMove = true;

  //обработчик события на начало нажатия
  sliderSwitcher.addEventListener('touchstart', (e) => {
    startTouch = e.touches[0];

    //применение начальных стилей
    sliderSwitcherContainer.style.transition = startTransition;
    sliderActiveLine.style.transition = startTransition;
  });

  //обработчик события на передвижение нажатия
  sliderSwitcher.addEventListener('touchmove', (e) => {
    let touch = e.targetTouches[0];

    //вычилсение процента смещения для контрола слайдера
    let sliderOffset = (touch.clientX - sliderCoordLeft) / sliderWidth * 100;

    let transformString;

    if (sliderOffset < 0 || sliderOffset > 100)
      return;

    //условия для изменения состояния контрола
    //в правую сторону
    if (startStateTransform === 0 && sliderOffset > 50) {
      startStateTransform = 50;
      nextSlide = canSliderMove ? ++nextSlide : nextSlide;
      canSliderMove = true;
    }
    //в левую сторону
    else if (startStateTransform === 100 && sliderOffset < 50) {
      startStateTransform = 50;
      nextSlide = canSliderMove ? --nextSlide : nextSlide;
      canSliderMove = true;
    }

    //условия при перемещении контрола более чем на 25 процентов от начальной точки
    if (canSliderMove && sliderOffset > 0 && sliderOffset < 100) {
      let needSlideMove = true;

      //в правую сторону
      if (sliderOffset >= 25 && startStateTransform === 0 ||
        sliderOffset >= 75 && startStateTransform === 50) {
        nextSlide++;
      }
      //в левую сторону
      else if (sliderOffset <= 75 && startStateTransform === 100 ||
        sliderOffset <= 25 && startStateTransform === 50) {
        nextSlide--;
      }
      //блокировка смены слайда
      else {
        needSlideMove = false;
      }

      //если нет блокировки, то изменем слайд и запрещаем ему меняться
      if (needSlideMove) {
        moveSlide(nextSlide);
        canSliderMove = false;
      }
    }

    transformString = `translateX(${sliderOffset}%)`;

    //стили для трансформации
    sliderSwitcherContainer.style.transform = transformString;
    sliderActiveLine.style.transform = transformString;
  });

  //обработчик события на конец нажатия
  sliderSwitcher.addEventListener('touchend', (e) => {
    //остановка всплытия
    e.stopPropagation();

    let touch = e.changedTouches[0];

    let direction = getDirection(startTouch, touch);

    let transform;

    //для перемещения контрола в конечную позицию
    //в левую сторону
    if (direction === 'left' && startStateTransform !== 0) {
      endStateTransform = startStateTransform - 50;
      nextSlide = canSliderMove ? --nextSlide : nextSlide;
    }
    //в правую сторону
    else if (direction === 'right' && startStateTransform !== 100) {
      endStateTransform = startStateTransform + 50;
      nextSlide = canSliderMove ? ++nextSlide : nextSlide;
    }

    //изменение состояния контрола
    startStateTransform = endStateTransform;

    transform = `translateX(${endStateTransform}%)`;

    //стили для трансформации
    sliderSwitcherContainer.style.transform = transform;
    sliderActiveLine.style.transform = transform;
    sliderSwitcherContainer.style.transition = endTransition;
    sliderActiveLine.style.transition = endTransition;

    //перемещение слайда
    if (canSliderMove)
      moveSlide(nextSlide);

    canSliderMove = true;
  });
}


/**
 * @description Функция для получения направления
 * @param startTouch {Touch} Начальное касание
 * @param endTouch {Touch} Конечное касание
 * @returns {string} Направление
 */
function getDirection(startTouch, endTouch) {
  let direction = '';
  let diff = startTouch.clientX - endTouch.clientX;

  if (diff < 0) {
    direction = 'right';
  }
  else if (diff > 0) {
    direction = 'left';
  }

  return direction;
}


/**
 * @description Функция для изменения слайда
 * @param slide {number} Номер следующего слайда
 */
function moveSlide(slide) {
  if (slide < 0 || slide >= 3)
    return;

  let transformOffset = slide * -100;
  sliderList.style.transform = `translateX(${transformOffset}%)`;
}
