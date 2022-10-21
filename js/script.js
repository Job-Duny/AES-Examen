$(function(){

	var body = $('body'),
		stage = $('#stage'),
		back = $('a.back');

	/* Paso 1 */

	$('#step1 .encrypt').click(function(){
		body.attr('class', 'encrypt');

		// Ir al paso 2
		step(2);
	});

	$('#step1 .decrypt').click(function(){
		body.attr('class', 'decrypt');
		step(2);
	});


	/* Pasos 2 */


	$('#step2 .button').click(function(){
		// Activar el diálogo del explorador de archivos
		$(this).parent().find('input').click();
	});


	// Configurar los eventos para la entrada de archivos

	var file = null;

	$('#step2').on('change', '#encrypt-input', function(e){

		// Si ningún archivo ha sido seleccionado

		if(e.target.files.length!=1){
			alert('Por favor selecciona un archivo para poder cifrar');
			return false;
		}

		file = e.target.files[0];

		// Si el archivo es de más de 50mb

		if(file.size > 1024*1024*50){
			alert('Por favor, elija archivos de menos de 50 mb, de lo contrario podría bloquearse el navegador');
			return;
		}
		step(3);
	});

	$('#step2').on('change', '#decrypt-input', function(e){

		if(e.target.files.length!=1){
			alert('Por favor selecciona un archivo para poder descifrar');
			return false;
		}

		file = e.target.files[0];
		step(3);
	});


	/* Paso 3 */


	$('a.button.process').click(function(){

		var input = $(this).parent().find('input[type=password]')
			//a = $('#step4 a.download'),
			password = input.val();

		input.val(''); 

		let tcifrado=document.querySelector('input[name="tclave"]:checked').value

		//validación de la clave para 128 bits

		if(tcifrado=="128"){
			if(password.length!=16){
				alert('Por favor ingresa una clave solo de 16 bytes')
			}else{
				a = $('#step4 a.download')
			}
		}

		//Validación de la clave para 192 bits

		if(tcifrado=="192"){
			if(password.length!=24){
				alert('Por favor ingresa una clave solo de 24 bytes')
			}else{
				a = $('#step4 a.download')
			}
		}

		//Validación de la clave para 256 bits

		if(tcifrado=="256"){
			if(password.length!=32){
				alert('Por favor ingresa una clave solo de 32 bytes')
			}else{
				a = $('#step4 a.download')
			}
		}
		

		// El objeto HTML5 FileReader nos permitirá leer el 
		// contenido del archivo seleccionado

		var reader = new FileReader();

		if(body.hasClass('encrypt')){

			// Encriptar el archivo!

			reader.onload = function(e){

				// Utilice la biblioteca CryptoJS y el cifrado AES para cifrar el 
				// contenido del archivo, guardado en e.target.result, con la contraseña

				var encrypted = CryptoJS.AES.encrypt(e.target.result, password);

				// El atributo download hará que el contenido del atributo href
				// se descargue cuando se haga clic en él. El atributo download
				// también contiene el nombre del archivo que se ofrece para su descarga

				a.attr('href', 'data:application/octet-stream,' + encrypted);
				a.attr('download', file.name + '.cifrado');

				step(4);
			};

			// Esto codificará el contenido del archivo en un data-uri.
			// Activará el manejador onload anterior, con el resultado

			reader.readAsDataURL(file);
		}
		else {

			// Desencriptarlo!

			reader.onload = function(e){

				var decrypted = CryptoJS.AES.decrypt(e.target.result, password)
										.toString(CryptoJS.enc.Latin1);

				if(!/^data:/.test(decrypted)){
					alert("Archivo o clave no válidos. Por favor, inténtalo de nuevo");
					return false;
				}

				a.attr('href', decrypted);
				a.attr('download', file.name+'.descifrado');

				step(4);
			};

			reader.readAsText(file);
		}
	});


	/* 	El botón de regreso */


	back.click(function(){

		// Reinicie las entradas de archivos ocultos,
		// para que no mantengan la selección 
		// de la última vez

		$('#step2 input[type=file]').replaceWith(function(){
			return $(this).clone();
		});

		step(1);
	});


	// Función de ayuda que mueve el viewport al div de paso correcto

	function step(i){

		if(i == 1){
			back.fadeOut();
		}
		else{
			back.fadeIn();
		}

		// Mueve el div #stage. El cambio de la propiedad top desencadenará
		// una transición css en el elemento. i-1 porque queremos que los
		// pasos comiencen desde el 1:

		stage.css('top',(-(i-1)*100)+'%');
	}

});
