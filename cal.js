let input = document.getElementById('inputBox');
let buttons = document.querySelectorAll('.calculator button');
let string = "";
let historyData = [];

// Calculator Logic 
buttons.forEach(button => {
  button.addEventListener('click', (e) => {
    let value = e.target.innerHTML;

    if (value === '=') {
      try {
        let expr = string;
        let result = eval(string);
        string = String(result);
        input.value = string;
        addHistory(expr, result);
      } catch {
        input.value = "Error";
        string = "";
      }
    }
    else if (value === 'AC') {
      string = "";
      input.value = string;
    }
    else if (value === 'DEL') {
      string = string.slice(0, -1);
      input.value = string;
    }
    else if (value === '%') {
      try {
        string = String(eval(string) / 100);
        input.value = string;
      } catch {
        input.value = "Error";
        string = "";
      }
    }
    else {
      string += value;
      input.value = string;
    }
  });
});

// History: Add Entry
function addHistory(expr, result) {
  historyData.unshift({ expr, result });
  renderHistory();
}

function renderHistory() {
  let list = document.getElementById('historyList');
  list.innerHTML = '';

  if (historyData.length === 0) {
    let li = document.createElement('li');
    li.className = 'empty-msg';
    li.textContent = 'No history yet';
    list.appendChild(li);
    return;
  }

  historyData.forEach((item, index) => {
    let li = document.createElement('li');

    let left = document.createElement('div');
    left.className = 'history-left';
    left.innerHTML = `
      <div class="history-expr">${item.expr} =</div>
      <div class="history-result">${item.result}</div>
    `;
    left.addEventListener('click', () => {
      string = String(item.result);
      input.value = string;
      closePanel();
    });

    let delBtn = document.createElement('button');
    delBtn.className = 'history-del-btn';
    delBtn.textContent = '✕';
    delBtn.title = 'Delete entry';
    delBtn.addEventListener('click', () => {
      historyData.splice(index, 1);
      renderHistory();
    });

    li.appendChild(left);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

let panelOpen = false;

function openPanel() {
  document.getElementById('historyPanel').classList.add('open');
  panelOpen = true;
}

function closePanel() {
  document.getElementById('historyPanel').classList.remove('open');
  panelOpen = false;
}

// ── Slide Handle — pointerdown use karo ──
// pointerdown = mouse click + touch dono pe instantly fire hota hai
let handleEl = document.getElementById('slideHandle');
let pointerStartY = 0;
let isDragging = false;

handleEl.addEventListener('pointerdown', (e) => {
  pointerStartY = e.clientY;
  isDragging = false;
  handleEl.setPointerCapture(e.pointerId);
});

handleEl.addEventListener('pointermove', (e) => {
  if (Math.abs(e.clientY - pointerStartY) > 10) {
    isDragging = true;
  }
});

handleEl.addEventListener('pointerup', (e) => {
  let diffY = pointerStartY - e.clientY;

  if (!isDragging) {
    // Simple tap/click — toggle
    if (panelOpen) closePanel();
    else openPanel();
  } else {
    // Drag/swipe — direction se decide karo
    if (diffY > 20) openPanel();    // upar drag = open
    else if (diffY < -20) closePanel(); // neeche drag = close
  }
});

document.getElementById('closeHistory').addEventListener('click', closePanel);

document.getElementById('clearHistory').addEventListener('click', () => {
  historyData = [];
  renderHistory();
});