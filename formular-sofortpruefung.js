const sofortFormular=document.getElementById('hmz-contact-form');

if(sofortFormular){
  const pruefFelder=[...sofortFormular.querySelectorAll('input,textarea')];

  function meldungFuer(feld){
    if(feld.validity.valueMissing)return 'Pflichtangabe: Bitte füllen Sie dieses Feld aus.';
    if(feld.name==='telefon'&&feld.validity.patternMismatch)return 'Bitte geben Sie die Telefonnummer ausschließlich mit Zahlen ein.';
    if(feld.name==='email'&&(feld.validity.typeMismatch||feld.validity.patternMismatch))return 'Bitte geben Sie eine vollständige gültige E-Mail-Adresse ein, z. B. name@firma.de.';
    if(feld.name==='strasse'&&feld.validity.patternMismatch)return 'Bitte geben Sie nur den Straßennamen ein. Zahlen gehören in das Feld Hausnummer.';
    if(feld.name==='postleitzahl'&&feld.validity.patternMismatch)return 'Bitte geben Sie eine gültige fünfstellige Postleitzahl ein.';
    if(feld.name==='ort'&&feld.validity.patternMismatch)return 'Bitte geben Sie im Feld Ort nur Buchstaben und übliche Ortsnamenszeichen ein.';
    return 'Bitte prüfen Sie Ihre Eingabe.';
  }

  function hinweisElement(feld){
    let hinweis=feld.parentElement.querySelector('.inline-error');
    if(!hinweis){
      hinweis=document.createElement('span');
      hinweis.className='inline-error';
      hinweis.setAttribute('role','alert');
      hinweis.setAttribute('aria-live','polite');
      if(feld.type==='checkbox'){
        const zustimmungstext=feld.parentElement.querySelector('span:not(.inline-error)');
        zustimmungstext.insertAdjacentElement('afterend',hinweis);
      }else{
        feld.insertAdjacentElement('afterend',hinweis);
      }
    }
    return hinweis;
  }

  function feldPruefen(feld){
    feld.setCustomValidity('');
    const hinweis=hinweisElement(feld);
    if(feld.checkValidity()){
      feld.classList.remove('invalid');
      feld.removeAttribute('aria-invalid');
      hinweis.textContent='';
      return true;
    }
    const meldung=meldungFuer(feld);
    feld.setCustomValidity(meldung);
    feld.classList.add('invalid');
    feld.setAttribute('aria-invalid','true');
    hinweis.textContent=meldung;
    return false;
  }

  let fokusRueckkehr=false;
  pruefFelder.forEach(feld=>{
    feld.addEventListener('blur',()=>{
      if(!feldPruefen(feld)&&feld.type!=='checkbox'&&!fokusRueckkehr){
        fokusRueckkehr=true;
        setTimeout(()=>{
          feld.focus();
          if(typeof feld.select==='function')feld.select();
          fokusRueckkehr=false;
        },0);
      }
    });
    feld.addEventListener('input',()=>{
      if(feld.classList.contains('invalid'))feldPruefen(feld);
    });
  });
}
