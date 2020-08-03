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

function togglevisibility(year) {
  const picturelist = document.querySelector(`.picturelist__${year}`);
  const button = document.querySelector(`.yearindicator__button-${year}`);

  console.log(picturelist.className);
  console.log(button.className);

  if (picturelist.className === `picturelist picturelist__${year} picturelist-invisible`) {
    button.className = `yearindicator__button yearindicator__button-${year} yearindicator__button-open`;
    picturelist.className = `picturelist picturelist__${year} picturelist-visible`;
    console.log(picturelist.className);
  } else {
    picturelist.className = `picturelist picturelist__${year} picturelist-invisible`;
    button.className = `yearindicator__button yearindicator__button-${year} yearindicator__button-close`;
    console.log(picturelist.className);
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

async function main() {
  let DataDe = await fetchData('./data/json/cda-paintings-v2.de.json');
  DataDe = DataDe.items;
  let DataEn = await fetchData('./data/json/cda-paintings-v2.en.json');
  DataEn = DataEn.items;

  let year = [];

  DataDe.forEach((bild) => {
    const tmp = bild.dating.begin;
    year.push(tmp);
  });

  year.sort();
  year = year.filter((elem, index, self) => index === self.indexOf(elem));

  for (let i = 0; i < year.length; i++) {
    year[i] = { year: year[i] };
  }

  const mustacheElement = document.querySelector('main');

  const yearTemplate = await fetchData('./templates/pictureblock.html', false);

  const renderedSection = Mustache.render(yearTemplate, { year });
  mustacheElement.innerHTML = renderedSection;
  accordeon();
}

main();
