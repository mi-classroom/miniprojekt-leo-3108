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

  console.log(DataDe);

  const paintingsTemplate = await fetchData('./templates/painting.html', false);

  DataDe.forEach((element) => {
    const jahr = element.dating.begin;

    // Gemälde, welche keine Grafik haben, werden nicht auf der Website angezeigt
    if (element.images !== null) {
      let link = element.images.sizes.m;
      link = link.src;

      const mustacheElement = document.querySelector(`.picturelist__${jahr}`);
      const renderedSection = Mustache.render(paintingsTemplate, { link });

      mustacheElement.innerHTML += renderedSection;
    }
  });
}

main();
