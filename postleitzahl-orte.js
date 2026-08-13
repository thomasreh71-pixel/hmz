const plzFeld=document.querySelector('[name="postleitzahl"]');
const ortFeld=document.querySelector('[name="ort"]');
const ortListe=document.getElementById('ort-vorschlaege');
const ortHinweis=document.getElementById('ort-hinweis');
let plzAnfrage;

async function passendeOrteLaden(){
  const plz=plzFeld.value;
  if(!/^\d{5}$/.test(plz)){
    ortListe.replaceChildren();
    ortHinweis.textContent='';
    return;
  }
  if(plzAnfrage)plzAnfrage.abort();
  plzAnfrage=new AbortController();
  ortHinweis.classList.remove('error');
  ortHinweis.textContent='Passende Orte werden ermittelt …';
  try{
    const antwort=await fetch('https://api.zippopotam.us/DE/'+plz,{signal:plzAnfrage.signal});
    if(!antwort.ok)throw new Error('not-found');
    const daten=await antwort.json();
    const orte=[...new Set((daten.places||[]).map(eintrag=>eintrag['place name']).filter(Boolean))];
    ortListe.replaceChildren(...orte.map(ort=>{
      const option=document.createElement('option');
      option.value=ort;
      return option;
    }));
    if(orte.length===1){
      ortFeld.value=orte[0];
      ortFeld.setCustomValidity('');
      ortHinweis.textContent='Ort wurde anhand der Postleitzahl eingetragen.';
    }else if(orte.length>1){
      if(!orte.includes(ortFeld.value))ortFeld.value='';
      ortHinweis.textContent='Bitte wählen Sie einen der passenden Orte aus.';
    }else{
      throw new Error('not-found');
    }
  }catch(fehler){
    if(fehler.name==='AbortError')return;
    ortListe.replaceChildren();
    ortHinweis.classList.add('error');
    ortHinweis.textContent='Zur Postleitzahl wurde kein Ort gefunden. Bitte prüfen Sie die PLZ oder tragen Sie den Ort selbst ein.';
  }
}

if(plzFeld&&ortFeld){
  plzFeld.addEventListener('input',()=>{
    ortFeld.value='';
    passendeOrteLaden();
  });
  plzFeld.addEventListener('blur',passendeOrteLaden);
}
