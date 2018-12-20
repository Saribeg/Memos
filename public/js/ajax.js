'use strict';

$(document).ready(function(){
	

	// Создание новой заметки и вывод на главную сраницу без обновления страницы

	let chosenColor = "memo-white"; //Переменная, в который мы запишем название класса, которое соответствует выбранному цвету заметки

	$('input[type=radio][name=ColorGroup]').on('change', function(){ // Сохраняем выбранный цвет заметки в переменную (перезаписываем значение по умолчанию)
		chosenColor = $(".modal-memo-colors input[type='radio']:checked").val();
		$('#chosen-color').removeClass().addClass(chosenColor);
	});


	// Тултип для кнопки добавления ссылки
	$(function () {
		$('.memo-link-add').tooltip();
		$('.memo-list-add').tooltip();
		$('.memo-link-show').tooltip();
		$('.memo-list-show').tooltip();
		$('.memo-update').tooltip();
		$('.memo-delete').tooltip();
		$('.memo-archive').tooltip();
	})

	let n=0; // Счетчик для создания уникальных имен (name) для полей (inputs) для сохранения списка ссылок в заметке пользователя

	function createMemoLinkItem(n){
		let memoLinkItem = 
	`
	<div class="memo-link-item">
		<div class="form-row align-items-center memo-link mt-1">
			<div class="col">
				<input type="url" class="form-control memo-link-href" placeholder="Скопіюйте лінк" name="memoLinkHref-${n}">
			</div>
			<div class="col">
				<input type="text" class="form-control memo-link-name" placeholder="Назвіть лінк" name="memoLinkName-${n}">
			</div>
			<div class="col-1">
				<i class="fas fa-trash memo-link-delete"></i>
			</div>
		</div>
	</div>
	`
	return memoLinkItem;
	}

	function createMemoListItem(n){
		let memoListItem = 
	`
	<div class="memo-list-item">
		<div class="form-row align-items-center memo-link mt-1">
			<div class="col">
				<input type="text" class="form-control memo-list-content" placeholder="Введіть текст" name="memoListItemContent-${n}">
			</div>
			<div class="col-1">
				<i class="fas fa-trash memo-list-delete"></i>
			</div>
		</div>
	</div>
	`
	return memoListItem;
	}

	

	// Изначально поля для ссылок и прочие элементы не показываются
	$('.memo-link-add').hide();
	$('.link-heading').hide();

	$('.memo-list-add').hide();
	$('.list-heading').hide();

	//При клике на значок добавления линков показываем элементы для ссылок с инпутами
	$('.memo-link-show').click(function(e){
		$('.memo-link-show').hide();
		$('.memo-list-show').hide();
		$('.list-heading').hide();
		$('.link-heading').show();
		$('.memo-link-add').show();
		$('.memo-links-wrapper').append(createMemoLinkItem(n));
		n++;
	});

	//При клике на значок добавления списка показываем элементы для лист-айтемов с инпутами
	$('.memo-list-show').click(function(e){
		$('.memo-link-show').hide();
		$('.memo-list-show').hide();
		$('.link-heading').hide();
		$('.list-heading').show();
		$('.memo-list-add').show();
		$('.memo-list-wrapper').append(createMemoListItem(n));
		n++;
	});

	//При последующих кликах на значок плюс добавляем инпуты для еще 1 ссылки или списка (смотря что выбрали)
	$(document).on('click', '.memo-link-add', function(e){
		$('.memo-links-wrapper').append(createMemoLinkItem(n));
		n++;
	});

	$(document).on('click', '.memo-list-add', function(e){
		$('.memo-list-wrapper').append(createMemoListItem(n));
		n++;
	});

	// Функция для возврата линк-контейнера в исходное состояние
	function resetMemoLinksAndLists(){
		$('.link-heading').hide();
		$('.list-heading').hide();
		$('.memo-link-add').hide();
		$('.memo-list-add').hide();
		$('.memo-link-show').show();
		$('.memo-list-show').show();
		$('.memo-links-wrapper').empty();
		$('.memo-list-wrapper').empty();
		n = 0;
	}

	//При нажатии корзинки рядом со ссылкой удаляет выбранные ссылки/поля для ссылок / списка
	$(document).on('click', '.memo-link-delete', function(e){
		e.preventDefault();

		// Удалили инпуты
		$(e.target).closest('.memo-link-item').remove(); 

		// Переименовали идентификаторы (в нашем случае все name у всех input), чтобы уникальность и порядковый номер не нарушились 
		let memoLinkHrefs = document.getElementsByClassName('memo-link-href');

		for(let i = 0; i < memoLinkHrefs.length; i++){
			memoLinkHrefs[i].setAttribute('name', `memoLinkHref-${i}`)
		}

		let memoLinkNames = document.getElementsByClassName('memo-link-name');

		for(let i = 0; i < memoLinkNames.length; i++){
			memoLinkNames[i].setAttribute('name', `memoLinkName-${i}`)
		}

		// Корректируем счетчик - порядковый номер названий инпутов для ссылок, чтобы при создании новых после удаления уникальность и порядковый номер не нарушились
		n = memoLinkNames.length;

		// Если все блоки-контейнеры ссылок были удалены, то возращаем в исходной состояние
		if(!$('.memo-link-item').length){
			resetMemoLinksAndLists()
		}
	
	});

	$(document).on('click', '.memo-list-delete', function(e){
		e.preventDefault();

		// Удалили инпуты
		$(e.target).closest('.memo-list-item').remove(); 

		// Переименовали идентификаторы (в нашем случае все name у всех input для списка), чтобы уникальность и порядковый номер не нарушились 
		let memoListItemContents = document.getElementsByClassName('memo-list-content');

		for(let i = 0; i < memoListItemContents.length; i++){
			memoListItemContents[i].setAttribute('name', `memoListItemContent-${i}`)
		}

		// Корректируем счетчик - порядковый номер названий инпутов для ссылок, чтобы при создании новых после удаления уникальность и порядковый номер не нарушились
		n = memoListItemContents.length;

		// Если все блоки-контейнеры ссылок были удалены, то возращаем в исходной состояние
		if(!$('.memo-list-item').length){
			resetMemoLinksAndLists()
		}
	
	});
	
	// Создание заметки при сабмите + Аджакс
	function createMemo(e) {

		e.preventDefault();

		let form = document.getElementById("form");
		let saveBtn = document.getElementById("save-memo");
		let memoHeader = document.getElementById("memoTitle");
		let memoDescription = document.getElementById("memoDescription");
		let memoDate = document.getElementById("memoDate");

		let title = memoHeader.value;
		let description = memoDescription.value;
		let date = memoDate.value;
		let memoLinks = [];
		let memoList = [];

		// Собираем линки (ссылки)
		let memoLinkItems = document.getElementsByClassName('memo-link-item');

		for(let i=0; i<memoLinkItems.length;i++){
			if(!$(`input[name="memoLinkHref-${i}"]`).val()) continue;
			let memoLink = {link: $(`input[name="memoLinkHref-${i}"]`).val(), linkText: $(`input[name="memoLinkName-${i}"]`).val() || $(`input[name="memoLinkHref-${i}"]`).val()};
			memoLinks.push(memoLink);
		}
		
		// Собираем список
		// let memoListItemContents = document.getElementsByClassName('memo-list-item');

		// for(let i=0; i<memoListItemContents.length;i++){
		// 	if(!$(`input[name="memoListItemContent-${i}"]`).val()) continue;
		// 	let memoListItem = $(`input[name="memoListItemContent-${i}"]`).val();
		// 	memoList.push(memoListItem);
		// }

		let memoListItemContents = document.getElementsByClassName('memo-list-item');

		for(let i=0; i<memoListItemContents.length;i++){
			if(!$(`input[name="memoListItemContent-${i}"]`).val()) continue;
			let memoListItem = {listItem: $(`input[name="memoListItemContent-${i}"]`).val(), listItemStatus: "todo", listItemId: ""};
			memoList.push(memoListItem);
		}

		// console.log(title);
		// console.log(description);
		// console.log(date);
		// console.log(checkedRad);
		//console.log(memoLinks);
		//console.log(memoLinks);
		// console.log(memoList);

		// Если форма форма проходит валидацию HTML5, то выполняем сабмит, иначе выводятся стандартные HTML5 подсказки
		if ($("#form")[0].checkValidity()){

			$.ajax({
				async: true,
				url: '/memos/create-memo',
				contentType: 'application/json',
				method: 'POST',
				data: JSON.stringify({
					title: title,
					description: description,
					date: date,
					color: chosenColor || 'memo-white',
					links: memoLinks,
					list: memoList
				}),
				success: function (memo) {

					// console.log(memo);

					$('#myModal').modal('hide'); // Закрываем модальное окно
					$('.memos').prepend('<div id="tmpdiv"></div>'); // Создаем элемент 
					$('#tmpdiv').replaceWith(memo); // Заменяем элемент тем, что получили с сервера
					$('input[type=radio][name=ColorGroup]').prop('checked', false); // Очищаем радио с цветом
					$('#chosen-color').removeClass(); // Удаляем класс-маркировку с выбранным цветом
					chosenColor = 'memo-white'; // Возвращаем цвет по умолчанию
					form.reset(); // Очищаем форму
					$('.memo-links-wrapper').empty(); // Очищаем в модалке блок со ссылками
					resetMemoLinksAndLists(); // Приводим блоки со ссілками и листами в исходное состояние
					n = 0; // Обнуляем счетчик для создания уникальных идентификаторов ссылок
				}
			});
	} else {
		$("#form")[0].reportValidity();
	}

	};

	$(document).on("click", "#save-memo", {}, createMemo);

	// Удаление заметки
	function deleteTheMemo(e){

		let memoId = $(e.target).closest('.memo').attr('id');

		$.ajax({
			async: true,
			url: '/memos/delete-memo/'+memoId,
			contentType: 'application/json',
			method: 'DELETE',
			data: JSON.stringify({
				memoId: memoId,
			}),
			success: function (memoid) {

				$('#'+memoid).remove();

			},
			error: function(err) {
        console.log(err);
      }

		});
		
	}

	$(document).on("click", '.memo-delete', {}, deleteTheMemo);

	// Поповер для выбора цвета заметки в модальном окне при создании новой заметки

	$('#modal-memo-colors-wrapper').hide();

	$('#change-modal-color').popover({
		content: $('#modal-memo-colors-wrapper'),
		placement: 'right',
		html: true
	});

	$('#change-modal-color').popover('show');

	$('#change-modal-color').popover('hide');

	$('#change-modal-color').on('hide.bs.popover', function () { // При закрытии поповера
		$('input[type=radio][name=ColorGroup]').prop('checked', false); // Очищаем радио с цветами
		//$('#chosen-color').removeClass(); // Удаляем класс-маркировку с выбранным цветом
	});

	$('#modal-memo-colors-wrapper').show();

	// Скрыть поповер, если нажали не на него, а куда-то рядом

	$('body').on('click', function (e) {
    $('#change-modal-color').each(function () {
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
        }
    });

	});

	// Редактирование заметки
	function updateMemo(e) {

		let memoId = $(e.target).closest('.memo').attr('id');

		$.ajax({
			async: true,
			url: '/memos/update-memo/'+memoId,
			contentType: 'application/json',
			method: 'PUT',
			data: JSON.stringify({
				memoId: memoId,
			}),
			success: function (memo) {

				// $('#'+memoid).remove();
				console.log(memo);

			},
			error: function(err) {
        console.log(err);
      }
		});

	}

	$(document).on('click', '.memo-update', updateMemo);


});


