let kanjiMeaningsDict;
export const fetchKanjiMeanings = async () => {
  try {
    const response = await fetch('./data/kanji-meanings-dict.json')
    kanjiMeaningsDict = await response.json();
  } catch (error) {
    console.error('Error loading Kanji Meanings:', error);
  }
}

const getMeaningsForKanji = (text) => {
  let meanings = {};
  for (const character of text) {
    const kanjiMeanings = kanjiMeaningsDict[character];
    if (!!Object.keys(kanjiMeanings)) {
      meanings[character] = kanjiMeanings["Meanings"];
    }
  }
  return meanings;
};

export const populateMeaningsLists = () => {
  clearQueryParams();
  const meaningsLists = document.getElementById('meanings-lists');
  const textInput = document.getElementById('search-field');
  const kanjiMeanings = getMeaningsForKanji(textInput.value);

  // Clear existing table content and repopulate table with kanji meanings
  if (!!meaningsLists) meaningsLists.innerHTML = '';
  Object.keys(kanjiMeanings).forEach((kanji, kanjiIndex) => {
    const ul = document.createElement('ul');
    for (const meaning of kanjiMeanings[kanji]) {
      if (!!String(meaning).trim().length) {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = meaning;
        button.onclick = () => appendQueryParam(`meaning-${kanjiIndex + 1}`, meaning);
        li.append(button);
        ul.append(li);
      } else {
        break;
      }
    }
    meaningsLists.appendChild(ul);
  });
};

const separator = " | ";
const outputField = document.getElementById('output-field');
export const queryParamsUpdatedListener = () => {
  const url = new URL(window.location.href);
  url.searchParams.sort()
  outputField.textContent = Array.from(url.searchParams.values()).join(separator);
}

export const appendQueryParam = (paramName, paramValue) => {
  const url = new URL(window.location.href);
  url.searchParams.set(paramName, paramValue);
  history.pushState({}, "", url);
  queryParamsUpdatedListener()
}

export const clearQueryParams = () => {
  const url = new URL(window.location.href);
  url.search = "";
  history.pushState({}, "", url);
}

 