const buttonCollapse = document.getElementById('buttonCollapse');
const menu = document.getElementById('menu');

buttonCollapse.addEventListener('click', () => {
    console.log('click');
    menu.classList.toggle('hidden');
});