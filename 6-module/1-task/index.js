/**
 * Компонент, который реализует таблицу
 * с возможностью удаления строк
 *
 * Пример одного элемента, описывающего строку таблицы
 *
 *      {
 *          name: 'Ilia',
 *          age: 25,
 *          salary: '1000',
 *          city: 'Petrozavodsk'
 *      }
 *
 */
export default class UserTable {
  constructor(rows) {
    this.elem = document.createElement("TABLE");
    this.elem.insertAdjacentHTML(
      "beforeend",
      `<thead>
        <tr>
          <th>Имя</th>
          <th>Возраст</th>
          <th>Зарплата</th>
          <th>Город</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      </tbody>`
    );

    let tbody = this.elem.querySelector("tbody");

    for (let { name, age, salary, city } of rows) {
      tbody.insertAdjacentHTML(
        "beforeend",
        `<tr>
          <td>${name}</td>
          <td>${age}</td>
          <td>${salary}</td>
          <td>${city}</td>
          <td><button>X</button></td>
        </tr>`
      );
    }

    tbody.addEventListener("click", this.handleClick);
  }

  handleClick(event) {
    if (event.target.closest("BUTTON")) {
      event.target.closest("TR").remove();
    }
  }
}
