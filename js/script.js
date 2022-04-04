const API_KEY = 'ba265851592f45518d14e27538ede190'
const newsList = document.querySelector('.news-list')
const choiceElement = document.querySelector('.js-choice')
const formSearch = document.querySelector('.search-form')
const title = document.querySelector('.title')
const choices = new Choices(choiceElement, {
  searchEnabled: false,
  itemSelectText: '',
  position: 'bottom',
})

const declOfNum = (n, titles) => titles[n % 10 === 1 && n % 100 !== 11 ?
  0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];

async function getData(url) {
  const response = await fetch(url, {
    headers: {
      'X-API-Key': API_KEY,
    }
  })

  const data = await response.json()

  return data
}

function getDateCorrectFormat(isoDate) {
  const date = new Date(isoDate)

  const fullDate = date.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })

  const fullTime = date.toLocaleString('en-GB', {
    hour: 'numeric',
    minute: 'numeric',
  })

  return `<span class="news-date">${fullDate}</span> ${fullTime}`
}

const getImage = (url) => new Promise((resolve) => {
  const image = new Image(270, 200)

  image.addEventListener('load', () => {
    resolve(image)
  })

  image.addEventListener('error', () => {
    image.src = 'image/nophoto.jpg'
    resolve(image)
  })

  image.src = url || 'image/nophoto.jpg'
  image.className = 'news-image'

  return image
})

function renderCard(data) {
  newsList.textContent = ''

  data.forEach(async news => {
    const {urlToImage, title, url, description, publishedAt, author} = news
    const card = document.createElement('li')
    card.className = 'news-item'

    const image = await getImage(urlToImage)
    image.alt = title
    card.append(image)

    card.innerHTML += `
      <h3 class="news-title">
        <a href="${url}" class="news-link" target="_blank">${title || ''}</a>
      </h3>
      <p class="news-description">${description || ''}.</p>

      <div class="news-footer">
        <time class="news-datetime" datetime="${publishedAt}">
          ${getDateCorrectFormat(publishedAt)}
        </time>
        <div class="news-author">${author || ''}</div>
      </div>
    `

    newsList.append(card)
  });
}

async function loadNews() {
  newsList.innerHTML = `
    <li class="preload"></li>
  `
  const country = localStorage.getItem('country') || 'ru'
  choices.setChoiceByValue(country)
  title.classList.add('hide')
  
  const data = await getData(`https://newsapi.org/v2/top-headlines?country=${country}&pageSize=100`)
  renderCard(data.articles)
}

async function loadSearch(value) {
  newsList.innerHTML = `
  <li class="preload"></li>
`
  const data = await getData(`https://newsapi.org/v2/everything?q=${value}&pageSize=100`)
  title.classList.remove('hide')
  const find = ['найден', 'найдено', 'найдено']
  const res = ['результат', 'результата', 'результатов']
  const count = data.articles.length
  title.textContent = `По вашему запросу “${value}” ${declOfNum(count, find)} ${count} ${declOfNum(count, res)}`
  choices.setChoiceByValue('')
  renderCard(data.articles)
}

choiceElement.addEventListener('change', (e) => {
  const value = e.detail.value
  localStorage.setItem('country', value)
  loadNews()
})

formSearch.addEventListener('submit', (e) => {
  e.preventDefault()
  loadSearch(formSearch.search.value)
  formSearch.reset()
})

loadNews()