'use strict';

$(document).ready(function(){
	

	// Создание новой заметки и вывод на главную сраницу без обновления страницы

	let chosenColor;

	$('input[type=radio][name=ColorGroup]').on('change', function(){
		chosenColor = $(".modal-memo-colors input[type='radio']:checked").val();
		$('#chosen-color').removeClass().addClass(chosenColor);
	});

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
		
		// console.log(title);
		// console.log(description);
		// console.log(date);
		// console.log(checkedRad);

		$.ajax({
			async: true,
			url: '/memos/create-memo',
			contentType: 'application/json',
			method: 'POST',
			data: JSON.stringify({
				title: title,
				description: description,
				date: date,
				color: chosenColor || 'memo-white'
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
				
			}
		});
	};

	$(document).on("click", "#save-memo", {}, createMemo);

	// saveBtn.addEventListener("click", createMemo);


	// Удаление выбранной заметки
	// $('.memo-delete').each(function(){
	// 	$( this ).on("click", deleteTheMemo);
	// })

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
        //the 'is' for buttons that trigger popups
        //the 'has' for icons within a button that triggers a popup
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
        }
    });
});




})


