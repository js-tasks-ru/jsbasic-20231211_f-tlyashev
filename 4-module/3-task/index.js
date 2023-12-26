function highlight(table) {
  let tableBodyRows = table.querySelectorAll("tbody > tr");

  for (let tr of tableBodyRows) {
    let td = tr.querySelectorAll("td");

    if (td[1].textContent < 18) {
      tr.style.textDecoration = "line-through";
    }

    if (td[2].textContent === "m") {
      tr.classList.add("male");
    } else if (td[2].textContent === "f") {
      tr.classList.add("female");
    }

    if (td[3].hasAttribute("data-available")) {
      td[3].dataset.available === "true"
        ? tr.classList.add("available")
        : tr.classList.add("unavailable");
    } else {
      tr.hidden = true;
    }
  }
}
