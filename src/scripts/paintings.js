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

// Overlay

async function generateCard(paintingid, data, reihenfolge, indicator) {
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
    console.log('back');
    card.className = `card__${paintingid} card-unvisible`;
    card.innerHTML = '';
    const newID = reihenfolge[indicator - 1];
    console.log(newID);
    const newcard = document.querySelector(`.card__${newID}`);
    newcard.className = `card__${newID} card`;
    generateCard(reihenfolge[indicator - 1], data, reihenfolge, indicator - 1);
  });

  buttonforward.addEventListener('click', () => {
    console.log('forward');
    card.className = `card__${paintingid} card-unvisible`;
    card.innerHTML = '';
    console.log(reihenfolge[indicator + 1]);
    const newcard = document.querySelector(`.card__${reihenfolge[indicator + 1]}`);
    newcard.className = `card__${reihenfolge[indicator + 1]} card`;
    generateCard(reihenfolge[indicator + 1], data, reihenfolge, indicator + 1);
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
        if (data[i].objectId === paintingid) {
          elementdata = data[i];
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
        console.log('back');
        card.className = `card__${paintingid} card-unvisible`;
        card.innerHTML = '';
        const newcard = document.querySelector(`.card__${reihenfolge[indicator - 1]}`);
        newcard.className = `card__${reihenfolge[indicator - 1]} card`;
        console.log(reihenfolge[indicator - 1]);
        generateCard(reihenfolge[indicator - 1], data, reihenfolge, indicator - 1);
      });

      buttonforward.addEventListener('click', () => {
        console.log('forward');
        card.className = `card__${paintingid} card-unvisible`;
        card.innerHTML = '';
        const newcard = document.querySelector(`.card__${reihenfolge[indicator + 1]}`);
        newcard.className = `card__${reihenfolge[indicator + 1]} card`;
        console.log(reihenfolge[indicator + 1]);
        generateCard(reihenfolge[indicator + 1], data, reihenfolge, indicator + 1);
      });
    });
  });
  console.log(reihenfolge);
}

// Fügt die einzelnen Bilder hinzu

async function addpaintings(data) {
  console.log(data);

  const paintingsTemplate = await fetchData('./templates/painting.html', false);

  data.forEach((element) => {
    const jahr = element.dating.begin;

    // Gemälde, welche keine Grafik haben, werden nicht auf der Website angezeigt
    if (element.images !== null) {
      const link = element.images.sizes.m.src;
      const id = element.objectId;
      const { title } = element.titles[0];

      const mustacheElement = document.querySelector(`.paintinglist__${jahr}`);

      const renderedSection = Mustache.render(paintingsTemplate, { link, id, title });
      mustacheElement.innerHTML += renderedSection;
    }
  });

  // löscht Bilder, welche nicht geladen wurden
  document.querySelectorAll('.painting').forEach((painting) => {
    img = painting.querySelector('img');
    img.onerror = function () {
      const id = painting.className.replace(/[^0-9.]/g, '');
      painting.outerHTML = '';
      const card = document.querySelector(`.card__${id}`);
      card.outerHTML = '';
    };
  });

  /*   const test = document.querySelector('.paintinglist__1540');
  console.log(typeof (test.innerHTML.length));
  if (typeof (test.innerHTML).length === 'number') {
    console.log('ghjkj');
  } */

  document.querySelectorAll('.paintinglist').forEach((paintinglist) => {
    // console.log((paintinglist.innerHTML.length));
    if ((paintinglist.innerHTML).length === 0 || (paintinglist.innerHTML).length === 1
      || (paintinglist.innerHTML).length === 'number') {
      const year = paintinglist.className.replace(/[^0-9.]/g, '');
      const yearindicator = document.querySelector(`.yearindicator__${year}`);
      yearindicator.style.display = 'none';
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

async function main() {
  let DataDe = await fetchData('./data/json/cda-paintings-v2.de.json');
  DataDe = DataDe.items;
  let DataEn = await fetchData('./data/json/cda-paintings-v2.en.json');
  DataEn = DataEn.items;

  let Data = DataDe;
  addpaintings(Data);

  // Switch Langauge

  document.querySelector('.language-select').onchange = async function () {
    const language = document.querySelector('select').value;
    if (language === 'de') Data = DataDe;
    if (language === 'en') Data = DataEn;
    removepaintings();
    addpaintings(Data);
  };
}

main();
