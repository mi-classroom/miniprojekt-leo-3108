async function fetchData(apiURL, parseJSON = true) {
  const response = await fetch(apiURL);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  let data = null;
  if (parseJSON) {
    data = await response.json();
  } else {
    data = await response.text();
  }
  return data;
}

/*
  Overlay mit Karte
*/

async function generateNextCard(paintingid, data, reihenfolge, indicator) {
  const card = document.querySelector(`.card__${paintingid}`);
  const overlay = document.querySelector('.overlay-on');
  let elementdata;

  paintingid = parseInt(paintingid, 10);

  data.forEach((element) => {
    if (element.objectId === paintingid) {
      elementdata = element;
    }
  });

  const cardTemplate = await fetchData('./templates/card.html', false);
  const renderedSection = Mustache.render(cardTemplate, {
    link: elementdata.images.sizes.m.src,
    title: elementdata.titles[0].title,
    description: elementdata.description,
    location: elementdata.locations[0].term,
    repository: elementdata.repository,
    dimensions: elementdata.dimensions,
  });
  card.innerHTML += renderedSection;

  const buttonclose = card.querySelector('.card__button-close');

  buttonclose.addEventListener('click', () => {
    if (overlay.className === 'overlay-on') {
      overlay.className = 'overlay-off';
      card.className = `card__${paintingid} card-unvisible`;
      card.innerHTML = '';
    }
  });

  if (overlay.className === 'overlay-off') {
    overlay.className = 'overlay-on';
    card.className = `card__${paintingid} card`;
  }

  const buttonback = card.querySelector('.card__button-back');
  const buttonforward = card.querySelector('.card__button-forward');

  buttonback.addEventListener('click', () => {
    if (indicator - 1 !== -1) {
      card.className = `card__${paintingid} card-unvisible`;
      card.innerHTML = '';
      const newID = reihenfolge[indicator - 1];
      const newcard = document.querySelector(`.card__${newID}`);
      newcard.className = `card__${newID} card`;
      generateNextCard(reihenfolge[indicator - 1],
        data, reihenfolge, indicator - 1);
    }
  });

  buttonforward.addEventListener('click', () => {
    if (indicator + 1 !== reihenfolge.length) {
      card.className = `card__${paintingid} card-unvisible`;
      card.innerHTML = '';
      const newcard = document.querySelector(`.card__${reihenfolge[indicator + 1]}`);
      newcard.className = `card__${reihenfolge[indicator + 1]} card`;
      generateNextCard(reihenfolge[indicator + 1], data, reihenfolge, indicator + 1);
    }
  });
}

async function addoverlay(data) {
  const overlay = document.querySelector('.overlay-off');
  const paintings = document.querySelectorAll('.painting');

  const reihenfolge = [];

  paintings.forEach((element) => {
    reihenfolge.push(element.className.replace(/[^0-9.]/g, ''));
    element.addEventListener('click', async () => {
      const paintingid = parseInt(element.className.replace(/[^0-9.]/g, ''), 10);
      const card = document.querySelector(`.card__${paintingid}`);

      let elementdata;

      for (let i = 0; i < data.length; i++) {
        if (data[i] !== undefined) {
          if (data[i].objectId === paintingid) {
            elementdata = data[i];
          }
        }
      }

      const cardTemplate = await fetchData('./templates/card.html', false);
      const renderedSection = Mustache.render(cardTemplate, {
        link: elementdata.images.sizes.m.src,
        title: elementdata.titles[0].title,
        description: elementdata.description,
        location: elementdata.locations[0].term,
        repository: elementdata.repository,
        dimensions: elementdata.dimensions,
      });
      card.innerHTML += renderedSection;

      const buttonclose = card.querySelector('.card__button-close');

      buttonclose.addEventListener('click', () => {
        if (overlay.className === 'overlay-on') {
          overlay.className = 'overlay-off';
          card.className = `card__${paintingid} card-unvisible`;
          card.innerHTML = '';
        }
      });

      if (overlay.className === 'overlay-off') {
        overlay.className = 'overlay-on';
        card.className = `card__${paintingid} card`;
      }

      const buttonback = card.querySelector('.card__button-back');
      const buttonforward = card.querySelector('.card__button-forward');

      let indicator = 0;

      for (let i = 0; i < reihenfolge.length; i++) {
        if (reihenfolge[i] === element.className.replace(/[^0-9.]/g, '')) {
          indicator = i;
        }
      }

      buttonback.addEventListener('click', () => {
        if (indicator - 1 !== -1) {
          card.className = `card__${paintingid} card-unvisible`;
          card.innerHTML = '';
          const newcard = document.querySelector(`.card__${reihenfolge[indicator - 1]}`);
          newcard.className = `card__${reihenfolge[indicator - 1]} card`;
          generateNextCard(reihenfolge[indicator - 1],
            data, reihenfolge, indicator - 1);
        }
      });

      buttonforward.addEventListener('click', () => {
        if (indicator + 1 !== reihenfolge.length) {
          card.className = `card__${paintingid} card-unvisible`;
          card.innerHTML = '';
          const newcard = document.querySelector(`.card__${reihenfolge[indicator + 1]}`);
          newcard.className = `card__${reihenfolge[indicator + 1]} card`;
          generateNextCard(reihenfolge[indicator + 1], data, reihenfolge, indicator + 1);
        }
      });
    });
  });
}

/*
  Bilder werden in die Struktur eingefügt
*/

async function addpaintings(data) {
  const paintingsTemplate = await fetchData('./templates/painting.html', false);

  data.forEach((element) => {
    const jahr = element.dating.begin;

    // Gemälde, welche keine Grafik haben, werden nicht auf der Website angezeigt
    if (element.images !== null) {
      const link = element.images.sizes.m.src;
      const id = element.objectId;
      const { title } = element.titles[0];

      const mustacheElement = document.querySelector(`.paintinglist__${jahr}`);

      const renderedSection = Mustache.render(paintingsTemplate, {
        link, id, title, jahr,
      });
      mustacheElement.innerHTML += renderedSection;
    }
  });

  addoverlay(data);
}

function removepaintings() {
  const tmp = document.querySelectorAll('.paintinglist');
  tmp.forEach((element) => {
    element.innerHTML = '';
  });
}

/*
  Menu-Funktion für den Header in der Dektop-Version
*/

function toggleMenu() {
  const headerButton = document.querySelector('.button-top');
  const headerMenu = document.querySelector('.header-menu__unvisible');

  headerButton.addEventListener('click', () => {
    if (headerMenu.className === 'header-menu__unvisible') {
      headerMenu.className = 'header-menu__visible';
      headerButton.innerHTML = '<i class="material-icons" style="font-size:45px;">close</i>';
    } else {
      headerMenu.className = 'header-menu__unvisible';
      headerButton.innerHTML = '<i class="material-icons" style="font-size:45px;">menu</i>';
    }
  });
}

/*
  Menu-Funktion für den Footer in der Mobile-Version
*/

function toggleMobileMenu() {
  const Button = document.querySelector('.button-bot');
  const Footer = document.querySelector('footer');
  const Settings = document.querySelector('.footer-settings__unvisible');

  Button.addEventListener('click', () => {
    if (Footer.className === 'footer') {
      Footer.className = 'footer__open';
      Settings.className = 'footer-settings';
      Button.innerHTML = '<i class="material-icons" style="font-size:45px;">close</i>';
    } else {
      Footer.className = 'footer';
      Settings.className = 'footer-settings__unvisible';
      Button.innerHTML = '<i class="material-icons" style="font-size:45px;">menu</i>';
    }
  });
}

/*
  Funktion zum ändern der Größe
*/

function switchdimensions() {
  document.querySelector('.vorschaubilder-select').onchange = async function () {
    const wert = document.querySelector('.select-vorschaubilder').value;

    if (wert === 'klein') {
    }
    if (wert === 'groß') {
    }
  };
}

/*
  Main-Funktion mit Sprachen-Wechsler
*/

async function main() {
  let DataDe = await fetchData('./data/json/cda-paintings-v2.de.json');
  DataDe = DataDe.items;
  let DataEn = await fetchData('./data/json/cda-paintings-v2.en.json');
  DataEn = DataEn.items;

  let Data = DataDe;

  for (let i = 0; i < Data.length; i++) {
    if (Data[i].images !== null && (Data[i].images.infos.maxDimensions.height === 0
      || Data[i].images.infos.maxDimensions.width === 0)) {
      delete Data[i];
    }
  }
  addpaintings(Data);
  toggleMenu();
  toggleMobileMenu();
  switchdimensions();

  // Switch Langauge

  document.querySelector('.language-select').onchange = async function () {
    const language = document.querySelector('select').value;
    if (language === 'de') Data = DataDe;
    if (language === 'en') Data = DataEn;

    for (let i = 0; i < Data.length; i++) {
      if (Data[i] !== undefined) {
        if (Data[i].images !== null && (Data[i].images.infos.maxDimensions.height === 0
        || Data[i].images.infos.maxDimensions.width === 0)) {
          delete Data[i];
        }
      }
    }

    // Alle Bilder werden gelöscht und wieder neu hinzugefügt
    removepaintings();
    addpaintings(Data);
  };
}

main();
