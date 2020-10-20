const view = document.getElementById("view");

document.getElementById("numbers").addEventListener("click", event => {
  view.value = view.value + event.target.id;
});

