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

// Beim Klicken auf ein Gemälde, wird die Card generiert

async function addoverlay(data) {
  const overlay = document.querySelector('.overlay-off');
  const test = document.querySelectorAll('.painting');

  test.forEach((element) => {
    element.addEventListener('click', async () => {
      const paintingid = parseInt(element.className.replace(/[^0-9.]/g, ''), 10);
      const card = document.querySelector(`.card__${paintingid}`);

      let elementdata;

      for (let i = 0; i < data.length; i++) {
        if (data[i].objectId === paintingid) {
          elementdata = data[i];
          console.log(elementdata);
        }
      }

      const cardTemplate = await fetchData('./templates/card.html', false);
      const renderedSection = Mustache.render(cardTemplate, {
        link: elementdata.images.sizes.m.src,
        title: elementdata.titles[0].title,
        description: elementdata.description,
        dimensions: elementdata.dimensions,
      });
      card.innerHTML += renderedSection;

      const button = card.querySelector('.card__button');

      button.addEventListener('click', () => {
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
    });
  });
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

      // addoverlay(element);
    }
  });
  addoverlay(data);
}

// Switch Langauge

async function main() {
  let DataDe = await fetchData('./data/json/cda-paintings-v2.de.json');
  DataDe = DataDe.items;
  let DataEn = await fetchData('./data/json/cda-paintings-v2.en.json');
  DataEn = DataEn.items;

  let Data = DataDe;

  addpaintings(Data);

  document.querySelector('.language-select').onchange = async function () {
    const language = document.querySelector('select').value;
    console.log(language);
    if (language === 'de') Data = DataDe;
    if (language === 'en') Data = DataEn;

    addpaintings(Data);
  };
}

main();
