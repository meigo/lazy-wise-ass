var api = 'https://en.wikiquote.org/w/api.php';

export async function getRandomWikiQuote() {
  const pageId = await getRandomStart();
  const person = await getRandomPerson(pageId);
  const quote = await getPersonRandomQuote(person);

  return { person, quote };
}

async function getRandomStart() {
  const url = new URL(api);
  const params = {
    action: 'query',
    format: 'json',
    titles: 'List of people by name',
    generator: 'links',
    gplnamespace: '0',
    gpllimit: '20',
  };
  url.search = new URLSearchParams(params).toString();

  try {
    const response = await fetch(url);
    const data = await response.json();

    let links = data.query.pages;
    let pageIds = [];
    for (let prop in links) {
      pageIds.push(links[prop].pageid);
    }
    let rand = pageIds[Math.floor(Math.random() * pageIds.length)];
    return rand;
  } catch (e) {
    console.error(e);
  }
}

async function getRandomPerson(pageId) {
  const url = api + '?action=query&format=json&origin=*&prop=links&pageids=' + pageId + '&redirects=1&pllimit=max';

  try {
    const response = await fetch(url);
    const data = await response.json();

    const properId = Object.keys(data.query.pages)[0];
    const links = data.query.pages[properId].links;
    let randPerson = links[Math.floor(Math.random() * links.length)].title;
    while (randPerson.indexOf('List of people') != -1) {
      randPerson = links[Math.floor(Math.random() * links.length)].title;
    }
    return randPerson;
  } catch (e) {
    console.error(e);
  }
}

async function getPersonRandomQuote(person) {
  const url = `${api}?action=parse&format=json&origin=*&prop=text&page=${person}&section=1&disablelimitreport=1&disabletoc=1`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    const text = data.parse.text['*'];
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    while (doc.querySelector('li > ul > li')) {
      let toRemove = doc.querySelector('li > ul');
      toRemove.parentNode.removeChild(toRemove);
    }
    const quotes = doc.querySelectorAll('ul > li');
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const currentQuote = randomQuote.textContent || randomQuote.innerText;
    return currentQuote;
  } catch (e) {
    console.error(e);
  }
}
