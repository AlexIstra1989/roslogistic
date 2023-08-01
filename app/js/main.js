//Burger
$('.header__btn').on('click', function() {
 $('.menu').toggleClass('menu_active'),
 $('.header__btn').toggleClass('header__btn_active');
});

//Замена лого
// Получаем ссылку на изображение логотипа
const logoImage = document.getElementById('logoImage');

// Получаем ссылку на кнопку меню
const menuToggle = document.getElementById('menuToggle');

// Обработчик события при клике на кнопку меню
menuToggle.addEventListener('click', function () {
  // Получаем ссылку на элемент меню
  const menu = document.querySelector('.header__menu.menu');

  // Проверяем, есть ли у меню класс .menu_active
  if (menu.classList.contains('menu_active')) {
    // Если класс есть, меняем изображение логотипа на новое изображение
    logoImage.src = '../images/logo/main-black.svg';
  } else {
    // Если класс отсутствует, меняем изображение логотипа на исходное изображение
    logoImage.src = '../images/logo/main.svg';
  }
});
