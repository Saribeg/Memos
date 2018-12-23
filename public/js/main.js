'use strict';

$(document).ready(function(){

	// ==================== Объявляем глобальные переменные ====================

	let chosenColor = "memo-white"; //Переменная, в который мы запишем название класса, которое соответствует выбранному цвету заметки, присваиваем значение по умолчанию
	let n=0; // Счетчик для создания уникальных имен (name) для полей (inputs) для сохранения list-items и link-items в заметке пользователя
	const currentUserName = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);

	// ==================== Объявляем функции, которые будут нужны для работы с интерфейсом и данными ====================

	// Функция для активации тултипов для некоторых иконок
	function showTooltips(){
		$('.memo-link-add').tooltip();
		$('.memo-list-add').tooltip();
		$('.memo-link-show').tooltip();
		$('.memo-list-show').tooltip();
	}

	// Функция для активации поповера для выбора цвета заметки в модальном окне при создании / редактировании заметки
	function showPopoverForSelectingColor(){
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
	};

	//Функция для показа цвета существующей заметки в модалке при редактировании
	function showThisMemoColor(){
		chosenColor = $(".modal-memo-colors input[type='radio']:checked").val();
		$('#chosen-color').removeClass().addClass(chosenColor);
	}

	// Функция для сохранения выбранного цвета заметки в ранее объявленную переменную chosenColor (перезаписываем значение по умолчанию)
	function saveChosenMemoColor(){
		$('input[type=radio][name=ColorGroup]').on('change', function(){ 
			chosenColor = $(".modal-memo-colors input[type='radio']:checked").val();
			$('#chosen-color').removeClass().addClass(chosenColor);
		});
	};

	// Функция для создания контейнеров для сохранения ссылок (link-items)
	function createMemoLinkItem(n){
		const memoLinkItem = 
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

	// Функция для создания контейнеров для сохранения списков (list-items)
	function createMemoListItem(n){
		const memoListItem = 
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

	// Функция для скрытия некоторых элементов интерфейса для ссылок и списков
	function hideMemoListsElements(){
		if ( $('.memo-links-wrapper').children().length == 0 && $('.memo-list-wrapper').children().length == 0) {
			$('.memo-link-add').hide();
			$('.link-heading').hide();
			$('.memo-list-add').hide();
			$('.list-heading').hide();
			$('.memo-link-show').show();
			$('.memo-list-show').show();
		} else if ($('.memo-links-wrapper').children().length >= 1){
			$('.memo-link-show').hide();
			$('.memo-list-show').hide();
			$('.memo-link-add').show();
			$('.link-heading').show();
			$('.memo-list-add').hide();
			$('.list-heading').hide();
		} else if($('.memo-list-wrapper').children().length >= 1){
			$('.memo-link-show').hide();
			$('.memo-list-show').hide();
			$('.memo-link-add').hide();
			$('.link-heading').hide();
			$('.memo-list-add').show();
			$('.list-heading').show();
		};
	};


	// Функция-обработик первичного клика на значок добавления линков (показываем первый элемент для ссылок с инпутами)
	function showMemoLinkElements(){
		$('.memo-link-show').click(function(e){
			$('.memo-link-show').hide();
			$('.memo-list-show').hide();
			$('.list-heading').hide();
			$('.link-heading').show();
			$('.memo-link-add').show();
			$('.memo-links-wrapper').append(createMemoLinkItem(n));
			n++;
		});
	};

	// Функция-обработик первичного клика на значок добавления списка (показываем первый элемент для списка с инпутами)
	function showMemoListElements(){
		$('.memo-list-show').click(function(e){
			$('.memo-link-show').hide();
			$('.memo-list-show').hide();
			$('.link-heading').hide();
			$('.list-heading').show();
			$('.memo-list-add').show();
			$('.memo-list-wrapper').append(createMemoListItem(n));
			n++;
		});
	};

	// Функция-обработик последующих кликов на значок добавления линков (добавляем еще один link-item при каждом клике);
	function newLinkItemHandler(e){
		let memoLinkItems = $('.memo-link-item');
		n = memoLinkItems.length;
		$('.memo-links-wrapper').append(createMemoLinkItem(n));
		n++;
	}

	function addNewLinkItem(){
		$(document).off('click', '.memo-link-add', newLinkItemHandler).on('click', '.memo-link-add', newLinkItemHandler);
	};
	
	// Функция-обработик последующих кликов на значок добавления списка (добавляем еще один list-item при каждом клике);
	function newListItemHandler(e){
		let memoListItems = $('.memo-list-item');
		n = memoListItems.length;
		$('.memo-list-wrapper').append(createMemoListItem(n));
		n++;
	}

	function addNewListItem(){
		$(document).off('click', '.memo-list-add', newListItemHandler).on('click', '.memo-list-add', newListItemHandler);
	};

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
		chosenColor = 'memo-white';
		n = 0;
	}

	// Функция обработчик нажатия на иконку удаления ссылок (link-items)
	function deleteLinkItem(){

		$(document).on('click', '.memo-link-delete', function(e){

			e.preventDefault();
	
			// Удаляем выбранный link-item
			$(e.target).closest('.memo-link-item').remove(); 
	
			// Переименовали идентификаторы (в нашем случае все name у всех input), чтобы уникальность и порядковый номер не нарушились 
			let memoLinkHrefs = document.getElementsByClassName('memo-link-href');
	
			for(let i = 0; i < memoLinkHrefs.length; i++){
				memoLinkHrefs[i].setAttribute('name', `memoLinkHref-${i}`);
			};
	
			let memoLinkNames = document.getElementsByClassName('memo-link-name');
	
			for(let i = 0; i < memoLinkNames.length; i++){
				memoLinkNames[i].setAttribute('name', `memoLinkName-${i}`);
			};
	
			// Корректируем счетчик - порядковый номер названий инпутов для ссылок, чтобы при создании новых после удаления єтих уникальность и порядковый номер не нарушились
			n = memoLinkNames.length;
	
			// Если все блоки-контейнеры ссылок были удалены, то возращаем интерфейс в исходное состояние
			if(!$('.memo-link-item').length){
				resetMemoLinksAndLists();
			};
		
		});

	};

	// Функция обработчик нажатия на иконку удаления списка (list-items)
	function deleteListItem(){

		$(document).on('click', '.memo-list-delete', function(e){

			e.preventDefault();
	
			// Удаляем выбранный list-item
			$(e.target).closest('.memo-list-item').remove(); 
	
			// Переименовали идентификаторы (в нашем случае все name у всех input для списка), чтобы уникальность и порядковый номер не нарушились 
			let memoListItemContents = document.getElementsByClassName('memo-list-content');
	
			for(let i = 0; i < memoListItemContents.length; i++){
				memoListItemContents[i].setAttribute('name', `memoListItemContent-${i}`);
			};
	
			// Корректируем счетчик - порядковый номер названий инпутов для ссылок, чтобы при создании новых после удаления уникальность и порядковый номер не нарушились
			n = memoListItemContents.length;
	
			// Если все блоки-контейнеры ссылок были удалены, то возращаем интерфейс в исходное состояние
			if(!$('.memo-list-item').length){
				resetMemoLinksAndLists();
			};
		
		});;

	};

	// Агрегирующая функция для запуска все функций, которые отвечают за работу интерфейса модального окна создания / просмотра / редактирования заметки
	function allModalHandlers(){
		showTooltips();
		showPopoverForSelectingColor();
		saveChosenMemoColor();
		hideMemoListsElements();
		showMemoLinkElements();
		showMemoListElements();
		addNewLinkItem();
		addNewListItem();
		deleteLinkItem();
		deleteListItem();
	};

	// ==================== Создание новой заметки ====================

	// Отображаем пустое модальное окно для заполнения данных (на сервере рендерится pug-шаблон страницы, который мы выводим). 
	function createNewMemoModal(e){
		$.ajax({
			async: true,
			url: '/memos/show-create-memo-modal',
			contentType: 'application/json',
			method: 'GET',
			success: function (modal) {

				// Имплементим полученную разметку 
				$('#show-modal-body').empty();
				$('#show-modal-body').prepend(modal);
				
				// Запускаем функции, которые контролируют интерфейс модального окна создания заметки
				allModalHandlers();

				// Сразу после закрытия модалки
				$('#myModal').on('hidden.bs.modal', function (e) {
					$('#creating-new-memo').remove();
				});
			}
		});
	};

	$(document).on('click', '#create-new-memo-modal', createNewMemoModal);
	

	// Функция-обработчик для создания новой заметки при submit
	function createMemo(e) {

		e.preventDefault();

		let form = document.getElementById("form");
		let title = $('#memoTitle').val();
		let description = $('#memoDescription').val();
		let date = $('#memoDate').val();
		let memoLinks = [];
		let memoList = [];

		// Собираем линки (ссылки) в массив memoLinks
		let memoLinkItems = document.getElementsByClassName('memo-link-item');

		for(let i=0; i<memoLinkItems.length;i++){
			if(!$(`input[name="memoLinkHref-${i}"]`).val()) continue;
			let memoLink = {link: $(`input[name="memoLinkHref-${i}"]`).val(), linkText: $(`input[name="memoLinkName-${i}"]`).val() || $(`input[name="memoLinkHref-${i}"]`).val()};
			memoLinks.push(memoLink);
		}
		
		// Собираем список в массив memoList
		let memoListItemContents = document.getElementsByClassName('memo-list-item');

		for(let i=0; i<memoListItemContents.length;i++){
			if(!$(`input[name="memoListItemContent-${i}"]`).val()) continue;
			let memoListItem = {listItem: $(`input[name="memoListItemContent-${i}"]`).val(), listItemStatus: false, listItemId: ""};
			memoList.push(memoListItem);
		}

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

					$('#myModal').modal('hide'); // Закрываем модальное окно
					$('.memos').prepend('<div id="tmpdiv"></div>'); // Создаем элемент 
					$('#tmpdiv').replaceWith(memo); // Заменяем элемент тем, что получили с сервера
					resetMemoLinksAndLists(); // Приводим блоки со ссілками и листами в исходное состояние
					getMemoStatistics(); // Обновляем статистику
				}
			});
	} else {
		$("#form")[0].reportValidity();
	}
	};

	$(document).on("click", "#save-memo", {}, createMemo);

	// ==================== Удаление заметки ====================

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
				getMemoStatistics(); // Обновляем статистику

			},
			error: function(err) {
        console.log(err);
      }
		});
		
	}

	$(document).on("click", '.memo-delete', {}, deleteTheMemo);

	// ==========================================Редактирование заметки==========================================

	// Сначала показываем заметку в модалке в режиме редактирования

	function showMemoInModalEventHandler(e) {

		let memoId = $(e.target).closest('.memo').attr('id');

		$.ajax({
			async: true,
			url: '/memos/show-memo-for-update/'+memoId,
			contentType: 'application/json',
			get: 'PUT',
			data: JSON.stringify({
				memoId: memoId,
			}),
			success: function (memo) {

				// Имплементим полученную разметку 
				$('#show-modal-body').empty();
				$('#show-modal-body').prepend(memo);
				
				// Запускаем функции, которые контролируют интерфейс модального окна создания заметки
				allModalHandlers();
				showThisMemoColor();

				// Сразу после закрытия модалки
				$('#myModal').on('hidden.bs.modal', function (e) {
					$('#updating-old-memo').remove();
				})
			},
			error: function(err) {
        console.log(err);
      }
		});

	}

	$(document).on('click', '.memo-update', showMemoInModalEventHandler);


	// При нажатии на сохранение изменений отправляем данные на сервер и обновляем заметку

	function updateMemo(e) {

		e.preventDefault();

		let memoId = $('.unique-memo').attr('id');
		let newMemoTitle = $('#memoTitle').val();
		let newMemoDescription = $('#memoDescription').val();
		let newMemoDate = $('#memoDate').val();
		let newMemoLinks = [];
		let newMemoList = [];

		// Собираем линки (ссылки) в массив memoLinks
		let memoLinkItems = document.getElementsByClassName('memo-link-item');

		for(let i=0; i<memoLinkItems.length;i++){
			if(!$(`input[name="memoLinkHref-${i}"]`).val()) continue;
			let memoLink = {link: $(`input[name="memoLinkHref-${i}"]`).val(), linkText: $(`input[name="memoLinkName-${i}"]`).val() || $(`input[name="memoLinkHref-${i}"]`).val()};
			newMemoLinks.push(memoLink);
		}
		
		// Собираем список в массив memoList
		let memoListItemContents = document.getElementsByClassName('memo-list-item');

		for(let i=0; i<memoListItemContents.length;i++){
			if(!$(`input[name="memoListItemContent-${i}"]`).val()) continue;
			let memoListItem = {listItem: $(`input[name="memoListItemContent-${i}"]`).val(), listItemStatus: $(`input[name="memoListItemContent-${i}"]`).data().checked, listItemId: ""};
			newMemoList.push(memoListItem);
		}

		if ($("#form")[0].checkValidity()){

			$.ajax({
				async: true,
				url: '/memos/update-memo/'+memoId,
				contentType: 'application/json',
				method: 'PUT',
				data: JSON.stringify({
					memoId: memoId,
					newMemoTitle: newMemoTitle,
					newMemoDescription: newMemoDescription,
					newMemoLinks: newMemoLinks,
					newMemoList: newMemoList,
					newMemoColor: chosenColor,
					newMemoDate: newMemoDate
				}),
				success: function (updatedMemo) {

					$('#myModal').modal('hide'); // Закрываем модальное окно
					$('.memos').find('#'+memoId).replaceWith(updatedMemo); // Заменяем наш существующий блок с мемо на тот, что получили с сервера
					resetMemoLinksAndLists(); // Приводим блоки со ссылками и листами в исходное состояние (на всякий случай)
					getMemoStatistics(); // Обновляем статистику
	
				},
				error: function(err) {
					console.log(err);
				}
			});

		} else {
			$("#form")[0].reportValidity();
		}

	};

	$(document).on('click', '#update-memo', updateMemo);

	// Работа с чек-боксом (лист-айтемы)

	function checkListItem(e){

		let checkedListItemId = $(this).prop('id');
		let memoId = $(e.target).closest('.memo').attr('id');
		let checkedListItemStatus = $(this).prop('checked');

		$.ajax({
			async: true,
			url: '/memos/update-list-item-checked/'+checkedListItemId,
			contentType: 'application/json',
			method: 'PUT',
			data: JSON.stringify({
				checkedListItemId: checkedListItemId,
				memoId: memoId,
				checkedListItemStatus: checkedListItemStatus
			}),
			success: function (updatedMemo) {

			},
			error: function(err) {
				console.log(err);
			}
		});
		
	}

	$(document).on('change', '.hidden-box', checkListItem);

	// ========================================== Архивация заметки ==========================================

	// При клике на архивацию по конкретной заметке переместить её в архив

	function moveMemoToArchive(e){

		let memoId = $(e.target).closest('.memo').attr('id');

		$.ajax({
			async: true,
			url: '/memos/move-memo-to-archive/'+memoId,
			contentType: 'application/json',
			method: 'PUT',
			data: JSON.stringify({
				memoId: memoId,
			}),
			success: function (memoId) {

				$('#'+memoId).remove();
				getMemoStatistics(); // Обновляем статистику

			},
			error: function(err) {
        console.log(err);
      }
		});


	}

	$(document).on('click', '.memo-archive', moveMemoToArchive);


	// При клике на архив в главном меню осуществить переход на соответствующую страницу

	function showArchivedMemos(e){

		$.ajax({
			async: true,
			url: '/archive/'+currentUserName,
			contentType: 'application/json',
			method: 'GET',
			success: function (info) {

				window.location.replace("/archive/"+currentUserName);
				getMemoStatistics(); // Обновляем статистику

			},
			error: function(err) {
        console.log(err); 
      }
		});

	}


	$(document).on('click', '#show-archived-memos, #show-archived-memos-mobile', showArchivedMemos);

	// Удаление мемо из архива

	function deleteTheMemoFromArchive(e){

		let memoId = $(e.target).closest('.memo').attr('id');

		$.ajax({
			async: true,
			url: '/memos/delete-memo-from-archive/'+memoId,
			contentType: 'application/json',
			method: 'DELETE',
			data: JSON.stringify({
				memoId: memoId,
			}),
			success: function (memoid) {

				$('#'+memoid).remove();
				getMemoStatistics(); // Обновляем статистику

			},
			error: function(err) {
        console.log(err);
      }
		});
		
	}

	$(document).on("click", '.memo-delete-archived', {}, deleteTheMemoFromArchive);

		// Возобновление из архива

		function undoMemoFromArchive(e){

			let memoId = $(e.target).closest('.memo').attr('id');
	
			$.ajax({
				async: true,
				url: '/memos/undo-memo-from-archive/'+memoId,
				contentType: 'application/json',
				method: 'PUT',
				data: JSON.stringify({
					memoId: memoId,
				}),
				success: function (memoId) {
	
					$('#'+memoId).remove();
					getMemoStatistics(); // Обновляем статистику
	
				},
				error: function(err) {
					console.log(err);
				}
			});
	
	
		}
	
		$(document).on('click', '.memo-archive-undo', undoMemoFromArchive);

		// Перенаправить на главную страницу при клике на "Актуальні нотатки" в разделе архива

		$(document).on('click', '#go-to-main-page', function(e){

			window.location.replace("/");

		})

		// ========================================== Статистика ==========================================

		// Количество документов

		function getMemoStatistics(){

			$.ajax({
				async: true,
				url: '/memos/get-memo-statistics/',
				contentType: 'application/json',
				method: 'GET',
				success: function (data) {

					$('#create-new-memo-modal, #go-to-main-page').attr('data-actualmemos', data.actualMemoQuantity);
					$('#show-archived-memos, #show-archived-memos-mobile').attr('data-archivememos', data.archivedMemoQuantity);
	
				},
				error: function(err) {
					console.log(err);
				}
			});

		}

		getMemoStatistics();

		// Скроллбар

		window.onscroll = function() {myFunction()};

		function myFunction() {
			var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
			var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
			var scrolled = (winScroll / height) * 100;
			document.getElementById("progress-bar").style.width = scrolled + "%";
		}

		$('#user-name').text(`For ${currentUserName}`);

		// Меню для мобильных для главной страницы

		$(document).on('click', '.burger-menu', function(e){
			$('.hamburger').toggleClass('is-active');
			$('#main-mobile-menu').toggle('slow');
		})


});


