var currentX = 2;
var currentY = 2;
var gameStarted = false;
var white = [];
var black = [];
var steps = 0;

function xInputListener (e) {
    var width = parseInt(e.target.value);
    if (width) {
        if (width != currentX) {
            currentX = width;
            drawTable(currentX, currentY);
        }
    }
}

function yInputListener (e) {
    var height = parseInt(e.target.value);
    if (height) {
        if (height != currentY) {
            currentY = height;
            drawTable(currentX, currentY);
        }
    }
}

function colorCell(num, isBlack) {
    var cell = document.getElementById('cell-' + num);
    if (isBlack) {
        cell.classList.add('black');
    } else {
        cell.classList.add('white');
    }
}

function configureStart(x, y) {
    white = [];
    black = [];
    steps = x * y;
    for (var i = 0; i < y; i++) {
        for (var j = 0; j < x; j++) {
            var cell = i.toString() + '_' + j.toString();
            if (Math.random() <= 0.5) {
                white.push(cell);
            } else {
                black.push(cell);
            }
        }
    }

    // Исключаем возможность того, что при инициализации все заполнено черным
    if (black.length === currentX * currentY) {
        white.push(black.pop());
    }

    white.forEach(function (cell) {
        colorCell(cell, false);
    });
    black.forEach(function (cell) {
        colorCell(cell, true);
    });

    storeState();
}

function btnStartEventListener (e) {
    e.preventDefault();
    if (gameStarted) {
        return;
    }

    gameStarted = true;

    // Make random configuration
    configureStart(currentX, currentY);

    activateDesk();
}

function activateDesk () {
    document.addEventListener('click', cellClickHandler);

    var x = document.getElementById('x');
    x.removeEventListener('input', xInputListener);
    var y = document.getElementById('y');
    y.removeEventListener('input', yInputListener);

    // Make button for reset
    var wrap = document.createElement('div');
    wrap.classList.add('form-group');
    wrap.classList.add('text-center');
    var btnEnd = document.createElement('button');
    btnEnd.classList.add('btn');
    btnEnd.classList.add('btn-danger');
    btnEnd.textContent = 'Сбросить';
    btnEnd.addEventListener('click', reset);
    wrap.appendChild(btnEnd);
    var field = document.getElementById('field');
    field.parentNode.appendChild(wrap);

    // Score panel
    var wrap = document.createElement('div');
    wrap.classList.add('form-group');
    wrap.classList.add('steps-count');
    wrap.classList.add('text-center');
    wrap.textContent = 'Осталось ходов: ';
    field.parentNode.appendChild(wrap);
}

function documentLoaded() {
    var x = document.getElementById('x');
    x.addEventListener('input', xInputListener);

    // Disallow typing
    x.addEventListener('keypress', function(e) {
        e.preventDefault();
    });

    var y = document.getElementById('y');
    y.addEventListener('input', yInputListener);

    // Disallow typing
    y.addEventListener('keypress', function(e) {
        e.preventDefault();
    });

    restoreState();
}

function storeState() {
    Cookies.set('gameStarted', gameStarted);
    Cookies.set('currentX', currentX);
    Cookies.set('currentY', currentY);
    Cookies.set('white', white);
    Cookies.set('black', black);
    Cookies.set('steps', steps);

}

function restoreState() {
    if (Cookies.get('white')) {
        white = JSON.parse(Cookies.get('white'));
    }
    if (Cookies.get('black')) {
        black = JSON.parse(Cookies.get('black'));
    }
    gameStarted = Cookies.get('gameStarted') === 'true';
    currentX = Number(Cookies.get('currentX')).valueOf() || 2;
    currentY = Number(Cookies.get('currentY')).valueOf() || 2;
    steps = Number(Cookies.get('steps')).valueOf() || currentX * currentY;
    console.log(white);
    console.log(black);
    console.log('Game Started ' + gameStarted);
    console.log(currentX);
    console.log(currentY);
    drawTable(currentX, currentY);
    if (gameStarted) {
        white.forEach(function (cell) {
            colorCell(cell, false);
        });
        black.forEach(function (cell) {
            colorCell(cell, true);
        });
        activateDesk();
    } else {
        var btnStart = document.getElementById('start');
        btnStart.removeEventListener('click', btnStartEventListener);
        btnStart.addEventListener('click', btnStartEventListener);
    }
}

function drawTable(x, y) {
    var field = document.getElementById('field');
    var html = '';
    for (var i = 0; i < y; i++){
        html += '<tr>';
        for (var j = 0; j < x; j++) {
            html += '<td id="cell-' + i + '_' + j + '">&nbsp;</td>';
        }
        html += '</tr>'
    }
    field.innerHTML = html;
}

function cellClickHandler (e) {
    console.log(steps);
    if (e.target.id.indexOf('cell-') >= 0) {
        var id = e.target.id;
        var currentCell = id.substring(id.indexOf('-') + 1);
        var row = parseInt(currentCell.substring(0, currentCell.indexOf('_')));
        var col = parseInt(currentCell.substring(currentCell.indexOf('_') + 1));
        var activeCells = [];
        activeCells.push(row.toString() + '_' + col.toString());
        activeCells.push((row + 1).toString() + '_' + col.toString());
        activeCells.push(row.toString() + '_' + (col + 1).toString());
        activeCells.push((row - 1).toString() + '_' + col.toString());
        activeCells.push(row.toString() + '_' + (col - 1).toString());

        activeCells.forEach(function (cellNumber) {
            var cell = document.getElementById('cell-' + cellNumber);
            if (cell) {
                var classes = [].slice.call(cell.classList);
                if (classes.indexOf('black') >= 0) {
                    cell.classList.remove('black');
                    cell.classList.add('white');
                    black.splice(black.indexOf(cellNumber), 1);
                    white.push(cellNumber);
                } else {
                    cell.classList.remove('white');
                    cell.classList.add('black');
                    white.splice(white.indexOf(cellNumber), 1);
                    black.push(cellNumber);
                }
            }
        });

        steps -= 1;
        storeState();
    }
}

function reset (e) {

    var x = document.getElementById('x');
    x.addEventListener('input', xInputListener);
    var y = document.getElementById('y');
    y.addEventListener('input', yInputListener);

    gameStarted = false;
    steps = 0;

    var row = document.getElementById('field').parentNode;
    var widthInput = document.getElementById('x');
    widthInput.value = currentX;
    var heightInput = document.getElementById('y');
    heightInput.value = currentY;
    row.removeChild(row.firstChild);
    var html = '<table id="field"></table>';
    row.innerHTML = html;
    document.removeEventListener('click', cellClickHandler);
    drawTable(currentX, currentY);
    var btnStart = document.getElementById('start');
    btnStart.removeEventListener('click', btnStartEventListener);
    btnStart.addEventListener('click', btnStartEventListener)

    storeState();
}