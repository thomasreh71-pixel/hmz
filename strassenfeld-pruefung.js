const strassenEingabe=document.querySelector('input[name="strasse"]');
const strassenHinweis=document.getElementById('strasse-hinweis');
let strassenHinweisTimer;

function ziffernAusStrasseEntfernen(){
  if(!strassenEingabe||!/[0-9]/.test(strassenEingabe.value))return;
  const position=strassenEingabe.selectionStart??strassenEingabe.value.length;
  const neuePosition=strassenEingabe.value.slice(0,position).replace(/[0-9]/g,'').length;
  strassenEingabe.value=strassenEingabe.value.replace(/[0-9]/g,'');
  strassenEingabe.setSelectionRange(neuePosition,neuePosition);
  strassenEingabe.setCustomValidity('');
  strassenHinweis.textContent='Zahlen sind im Feld Straße nicht erlaubt und wurden gelöscht. Bitte geben Sie die Zahl im Feld Hausnummer ein.';
  strassenHinweis.classList.add('show');
  clearTimeout(strassenHinweisTimer);
  strassenHinweisTimer=setTimeout(()=>strassenHinweis.classList.remove('show'),8000);
}

if(strassenEingabe){
  strassenEingabe.addEventListener('input',ziffernAusStrasseEntfernen);
  strassenEingabe.addEventListener('paste',()=>setTimeout(ziffernAusStrasseEntfernen,0));
}
