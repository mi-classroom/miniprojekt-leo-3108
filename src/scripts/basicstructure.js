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
  Accordeon
*/

function togglevisibility(year) {
  const paintinglist = document.querySelector(`.paintinglist__${year}`);
  const button = document.querySelector(`.yearindicator__button-${year}`);

  if (paintinglist.className === `paintinglist paintinglist__${year} paintinglist-invisible`) {
    button.className = `yearindicator__button yearindicator__button-${year} yearindicator__button-open`;
    paintinglist.className = `paintinglist paintinglist__${year} paintinglist-visible`;
  } else {
    paintinglist.className = `paintinglist paintinglist__${year} paintinglist-invisible`;
    button.className = `yearindicator__button yearindicator__button-${year} yearindicator__button-close`;
  }
}

function createaccordeon(listesortiert) {
  const yearindicatorButtons = document.querySelectorAll('.yearindicator');

  yearindicatorButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const buttonname = button.className;
      const year = parseInt(buttonname.replace(/[^0-9\.]/g, ''), 10);
      togglevisibility(year);
    });
  });

  /*
    Button um alle Accordeons einzuklappen
  */

  const buttonbot = document.querySelector('.button-bot');
  buttonbot.addEventListener('click', (event) => {
    listesortiert.forEach((jahr) => {
      togglevisibility(jahr);
    });
  });
}

/*
  Erstellt die Grundstruktur mit den Jahres-Teilbereichen
*/

async function createstructure() {
  let DataDe = await fetchData('./data/json/cda-paintings-v2.de.json');
  DataDe = DataDe.items;

  for (let i = 0; i < DataDe.length; i++) {
    if (DataDe[i].images !== null && (DataDe[i].images.infos.maxDimensions.height === 0
      || DataDe[i].images.infos.maxDimensions.width === 0)) {
      delete DataDe[i];
    }
  }

  let listesortiert = [];
  const zuordnung = [];

  DataDe.forEach((element) => {
    listesortiert.push(element.dating.begin);
  });

  listesortiert.sort();
  listesortiert = listesortiert.filter((elem, index, self) => index === self.indexOf(elem));

  listesortiert.forEach((element) => {
    const neweintrag = {
      jahr: element,
      bildercounter: 0,
    };
    zuordnung.push(neweintrag);
  });

  DataDe.forEach((element) => {
    const jahr = element.dating.begin;

    zuordnung.forEach((item) => {
      if (item.jahr === jahr) {
        item.bildercounter += 1;
      }
    });
  });

  const mustacheElement = document.querySelector('main');

  const yearTemplate = await fetchData('./templates/basicstructure.html', false);

  zuordnung.forEach((element) => {
    const renderedSection = Mustache.render(yearTemplate, {
      year: element.jahr,
      counter: element.bildercounter,
    });
    mustacheElement.innerHTML += renderedSection;
  });
  createaccordeon(listesortiert);
}

createstructure();
