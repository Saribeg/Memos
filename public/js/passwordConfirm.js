// Вспомогательная функция, с помощью которой можно получить DOM-єлемент по классу/id/имени

function get(selector){

	if (selector.startsWith(".")){
		return document.getElementsByClassName(selector.slice(1));	
	} else if (selector.startsWith("#")){
		return document.getElementById(selector.slice(1));
	} else {
		return document.getElementsByName(selector);
	}

};

window.onload = function (){

	// Получаем элементы, куда вводятся пароль и его подтверждение

	let userPassword = get("#userPassword");
	let userPasswordConfirm = get("#userPasswordConfirm");

	// Определяем функцию, которая отслеживает совпадение/несовпадение паролей и пропускает/выдает ошибку

	function passwordConfirm(){

		if (userPassword.value != userPasswordConfirm.value){
			userPasswordConfirm.setCustomValidity("Пароль не співпадає!");
		} else {
			userPasswordConfirm.setCustomValidity("");
		}

	};

	userPassword.onchange = passwordConfirm;
	userPasswordConfirm.onkeyup = passwordConfirm;
}



