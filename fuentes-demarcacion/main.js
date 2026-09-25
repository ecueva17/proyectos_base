(function () {
    var form = document.getElementById('formConsulta');
    var dni = document.getElementById('dni');
    var fecha = document.getElementById('fecha');
    var errDni = document.getElementById('err-dni');
    var errFecha = document.getElementById('err-fecha');
    var btnLimpiar = document.getElementById('btn-limpiar');
    var cuerpo = document.getElementById('cuerpo-resultado');

    function limpiarErrores() {
        errDni.textContent = '';
        errFecha.textContent = '';
        errDni.classList.remove('visible');
        errFecha.classList.remove('visible');
    }

    form.addEventListener('submit', function (e) {
        limpiarErrores();
        dni.value = dni.value.replace(/\D/g, '');
        var ok = true;
        if (!/^\d{8}$/.test(dni.value)) {
            errDni.textContent = 'Ingresa los 8 dígitos de tu DNI.';
            errDni.classList.add('visible');
            ok = false;
        }
        if (!fecha.value) {
            errFecha.textContent = 'Ingresa la fecha de emisión de tu DNI.';
            errFecha.classList.add('visible');
            ok = false;
        }
        if (!ok) e.preventDefault();
    });

    dni.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').substring(0, 8);
    });

    btnLimpiar.addEventListener('click', function () {
        // La URL de inicio se inyecta desde el servidor vía atributo data-home
        // (ver th:attr="data-home=@{/}" en el botón, dentro de index.html)
        window.location.href = btnLimpiar.dataset.home || '/';
    });
})();