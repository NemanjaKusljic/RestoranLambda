var acc = document.getElementsByClassName("menu__accordion-button");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("menu__accordion-button--down");
    this.classList.toggle("menu__accordion-button--up");

    
    var panel = this.nextElementSibling.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }

  });
}