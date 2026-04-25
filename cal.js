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

document.getElementById('slideHandle').addEventListener('click', () => {
  if (panelOpen) closePanel();
  else openPanel();
});

document.getElementById('closeHistory').addEventListener('click', closePanel);

document.getElementById('clearHistory').addEventListener('click', () => {
  historyData = [];
  renderHistory();
});

let touchStartY = 0;
let handleEl = document.getElementById('slideHandle');

handleEl.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
});

handleEl.addEventListener('touchend', (e) => {
  let diff = touchStartY - e.changedTouches[0].clientY;
  if (diff > 20) openPanel();
  else if (diff < -20) closePanel();
  else {
    if (panelOpen) closePanel();
    else openPanel();
  }
});