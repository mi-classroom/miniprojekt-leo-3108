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
}

main();
