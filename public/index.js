const close = document.querySelectorAll('.fa-times');

close.forEach((button) => {
  button.addEventListener('click', (e) => {
    console.log(e.target.parentElement);
    e.target.parentElement.style.display = 'none';
  });
});