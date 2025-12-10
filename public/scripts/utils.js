let kanjiMeaningsDict;
export const fetchKanjiMeanings = async () => {
  try {
    const response = await fetch('./data/kanji-meanings-dict.json')
    kanjiMeaningsDict = await response.json();
  } catch (error) {
    console.error('Error loading Kanji Meanings:', error);
  }
}

const getMeaningsForKanjiCharacter = (character) => {
  const kanjiMeanings = kanjiMeaningsDict[character];

  // If character is not a kanji, skip it.
  if (!!kanjiMeanings && !!Object.keys(kanjiMeanings)) {
    return kanjiMeanings["Meanings"];
  } else {
    return null;
  }
};

const getMeaningsForKanjiText = (text) => {
  let meanings = {};
  let characters = []; // We must make sure to have all characters, even duplicates.
  for (const character of text) {
    // If we already have meanings for this character, reuse them.
    if (!!meanings[character]) {
      characters.push(character);
    } else {
      const _meanings = getMeaningsForKanjiCharacter(character);
      // Only add characters that have meanings. If value is null, that means it's a non-kanji character.
      if(!!_meanings) {
        meanings[character] = _meanings;
        characters.push(character);
      }
    }
  };
  return { characters, meanings };
}

const meaningsLists = document.getElementById('meanings-lists');
const textInput = document.getElementById('search-field');
export const populateMeaningsLists = () => {
  clearQueryParams();
  const { characters, meanings } = getMeaningsForKanjiText(textInput.value);

  // Clear existing table content and repopulate table with kanji meanings
  if (!!meaningsLists) meaningsLists.innerHTML = '';
  characters.forEach((character, characterIndex) => {
    const ul = document.createElement('ul');
    const finalIndex = meanings[character].length - 1;
    for (let meaningIndex = 0; meaningIndex <= finalIndex; meaningIndex++) {
      const meaning = meanings[character][meaningIndex];
      if (!!String(meaning).trim().length) {
        // Automatically append the first meaning of each kanji to the query params.
        if (meaningIndex == 0) appendQueryParam(`meaning-${characterIndex + 1}`, meaning)

        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = meaning;
        button.onclick = () => appendQueryParam(`meaning-${characterIndex + 1}`, meaning);
        li.append(button);
        ul.append(li);
      } else {
        // Found an empty meaning, stop processing further meanings for this kanji.
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
  queryParamsUpdatedListener()
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy from clipboard: ', err);
  }
}

export const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText();
    textInput.value = text;
  } catch (err) {
    console.error('Failed to paste from clipboard: ', err);
  }
}

const clearFields = () => {
  textInput.value = '';
  outputField.textContent = '';
  meaningsLists.innerHTML = '';
  clearQueryParams();
}

const insertTextAtInput = (text) => {
  textInput.value = text;
}

const onClickRedoWord = (text, element) => {
  insertTextAtInput(text);
  populateMeaningsLists()
  const logItem = element.parentElement.parentElement;
  logItem.remove();
}

const log = document.getElementById('log');
export const addToHistory = async () => {
  // Don't add to history if there are no meanings.
  if (!meaningsLists.innerHTML) return;

  const redoWord = document.createElement('button');
  const copyMeanings = document.createElement('button');
  // const deleteItem = document.createElement('button');

  redoWord.textContent = ` 🔄 ${textInput.value}`;
  copyMeanings.textContent = `💾 ${outputField.textContent}`;
  // deleteItem.textContent = "❌";
  // deleteItem.onclick = () => removeLogItem(...);

  redoWord.onclick = onClickRedoWord.bind(null, textInput.value, redoWord);
  copyMeanings.onclick = copyToClipboard.bind(null, outputField.textContent);

  const redoWordListItem = document.createElement('li');
  const copyMeaningsListItem = document.createElement('li');
  redoWordListItem.append(redoWord);
  copyMeaningsListItem.append(copyMeanings);

  const ul = document.createElement('ul');
  ul.append(redoWordListItem, copyMeaningsListItem);
  log.append(ul);

  await copyToClipboard(outputField.textContent);
  clearFields()
}

export const clearHistory = () => {
  log.innerHTML = '';
}
