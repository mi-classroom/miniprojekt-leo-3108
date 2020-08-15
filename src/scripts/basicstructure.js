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

// Accordeon

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

function accordeon() {
  const yearindicatorButtons = document.querySelectorAll('.yearindicator__button');

  yearindicatorButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const buttonname = button.className;
      const year = parseInt(buttonname.replace(/[^0-9\.]/g, ''), 10);
      togglevisibility(year);
    });
  });
}

// Erstellt die Jahres-Teilbereiche

async function main() {
  let DataDe = await fetchData('./data/json/cda-paintings-v2.de.json');
  DataDe = DataDe.items;

  let year = [];

  DataDe.forEach((bild) => {
    const tmp = bild.dating.begin;
    year.push(tmp);
  });

  year.sort();
  year = year.filter((elem, index, self) => index === self.indexOf(elem));

  for (let i = 0; i < year.length; i += 1) {
    year[i] = { year: year[i] };
  }

  const mustacheElement = document.querySelector('main');

  const yearTemplate = await fetchData('./templates/basicstructure.html', false);

  const renderedSection = Mustache.render(yearTemplate, { year });
  mustacheElement.innerHTML = renderedSection;
  accordeon();
}

main();
