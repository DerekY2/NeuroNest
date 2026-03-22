import { setLocal, hideOverlays } from './popup.js'
import { ExamTools, Overlays } from './constants.js';

function show(btn){
  refresh()
  ExamTools.overlay.classList.remove('hidden')
  Overlays.darkScreen.classList.remove("hidden");
}

function save(combined=ExamTools.exportMode.checked){
  setLocal('carleton-exams', [combined])
  hideOverlays()
}

function refresh(){
  chrome.storage.local.get(['carleton-exams'], (result) => {
    const config = result['carleton-exams'];
    if (config) {
      ExamTools.exportMode.checked = config[0]==undefined?true:config[0]
      setState(config[0])
    } else {
      setState(reset())
      save()
    }
  });
}

function setState(combined) {
  const targetState = document.querySelector('.node-state[data-node="exam-tools"]');
  if (targetState) {
    targetState.textContent = combined ? 'Combined' : 'Individual';
  }
}

function reset(){
  ExamTools.exportMode.checked = true
  return true
}

function close(){
  ExamTools.overlay.classList.add('hidden')
  Overlays.darkScreen.classList.add('hidden')
}

function init(){
  refresh()
}

export { save, refresh, reset, close, show, init }
