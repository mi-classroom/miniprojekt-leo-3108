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

function overlay() {
  const paintings = document.querySelectorAll('.painting');

  paintings.forEach((painting) => {
    painting.addEventListener('click', (bild) => {
      const paitingname = painting.className;
      console.log(`${paitingname}`);
    });
  });
}

async function main() {
  let DataDe = await fetchData('./data/json/cda-paintings-v2.de.json');
  DataDe = DataDe.items;
  let DataEn = await fetchData('./data/json/cda-paintings-v2.en.json');
  DataEn = DataEn.items;

  console.log(DataDe);

  const paintingsTemplate = await fetchData('./templates/painting.html', false);

  DataDe.forEach((element) => {
    const jahr = element.dating.begin;

    // Gemälde, welche keine Grafik haben, werden nicht auf der Website angezeigt
    if (element.images !== null) {
      const link = element.images.sizes.m.src;
      const id = element.objectId;

      const mustacheElement = document.querySelector(`.picturelist__${jahr}`);
      const renderedSection = Mustache.render(paintingsTemplate, { link, id });

      mustacheElement.innerHTML += renderedSection;
    }
  });
  overlay();
}

main();
