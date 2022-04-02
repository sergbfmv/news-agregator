const API_KEY = 'ba265851592f45518d14e27538ede190'
const newsList = document.querySelector('.news-list')
const choiceElement = document.querySelector('.js-choice')
const choices = new Choices(choiceElement, {
  searchEnabled: false,
  itemSelectText: '',
  position: 'bottom',
})

async function getData(url) {
  const response = await fetch(url, {
    headers: {
      'X-API-Key': API_KEY,
    }
  })

  const data = await response.json()

  return data
}

function renderCard(data) {
  newsList.textContent = ''

  data.forEach(news => {
    const card = document.createElement('li')
    card.className = 'news-item'
    card.innerHTML = `
      <img class="news-image" src="${news.urlToImage}" alt="${news.title}" width="270" height="200">
      <h3 class="news-title">
        <a href="${news.url}" class="news-link" target="_blank">${news.title}</a>
      </h3>
      <p class="news-description">${news.description}.</p>

      <div class="news-footer">
        <time class="news-datetime" datetime="${news.publishedAt}">
          <span class="news-date">${news.publishedAt}</span> 11:06
        </time>
        <div class="news-author">${news.author}</div>
      </div>
    `

    newsList.append(card)
  });
}

async function loadData() {
  const data = await getData('https://newsapi.org/v2/top-headlines?country=ru')
  renderCard(data.articles)
}

loadData()