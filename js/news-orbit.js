


async function loadCategories() {
    const res = await fetch('https://openapi.programming-hero.com/api/news/categories');
    const data = await res.json();
    showCategories(data.data.news_category);
}
loadCategories();
let catIds = {};
function showCategories(newsCategories) {
    const categoriesSection = document.getElementById('categories-section');
    for (newsCategory of newsCategories) {
        const idName = newsCategory.category_name.toLowerCase().replace(' ', '-');
        catIds[`${idName}`] = newsCategory.category_id;
        const categoryDiv = document.createElement('div');
        categoryDiv.innerHTML = `<a class="inactive-category fw-medium px-2 py-1" id="${idName}" href="#">${newsCategory.category_name}</a>`;

        categoriesSection.appendChild(categoryDiv);

    }

}

async function loadNews(id, category) {
    const res = await fetch(`https://openapi.programming-hero.com/api/news/category/${id}`);
    const data = await res.json();
    showNews(data.data, category);
}

async function loadTodaysNews(id, category) {
    const res = await fetch(`https://openapi.programming-hero.com/api/news/category/${id}`);
    const data = await res.json();
    let todaysNews = [];
    for (news of data.data) {
        const status = news.others_info.is_todays_pick;
        if (status === true) {
            todaysNews.push(news);
        }
    }
    showNews(todaysNews, category);
}

async function loadTrendingNews(id, category) {
    const res = await fetch(`https://openapi.programming-hero.com/api/news/category/${id}`);
    const data = await res.json();
    let todaysNews = [];
    for (news of data.data) {
        const status = news.others_info.is_trending;
        if (status === true) {
            todaysNews.push(news);
        }
    }
    showNews(todaysNews, category);
}
const noNewsAlertSection = document.getElementById('no-news-alert-section');
function showNews(allNews, category) {
    const newsSection = document.getElementById('news-section');
    newsSection.innerHTML = '';
    stopSpinner();
    if (allNews.length === 0) {
        noNewsAlertSection.classList.remove('d-none');
    }
    else {
        noNewsAlertSection.classList.add('d-none');
    }
    for (news of allNews) {
        const newsDiv = document.createElement('div');
        newsDiv.classList.add('bg-white');
        newsDiv.classList.add('p-4');
        newsDiv.classList.add('d-flex');
        newsDiv.classList.add('rounded');
        newsDiv.classList.add('mb-4');
        newsDiv.classList.add('shadow');

        newsDiv.innerHTML = `
        <div class="me-5"><img src="${news.thumbnail_url}" alt=""></div>
                <div class="d-flex align-items-center pe-3">
                    <div>
                        <div>
                            <h4 class="news-title mb-3">${news.title}</h5>
                        </div>
                        <div>
                            <p class="news-description mb-3">${news.details.slice(0, 500)}...</p>
                        </div>
                        <div class="d-flex justify-content-between align-content-center px-2">
                            <div>
                                <div>
                                    <h6 class="author-name text-center">${news.author.name ? news.author.name : "Anonymous"}</h6>
                                    <p class="text-center publish-date">${news.author.published_date ? news.author.published_date.substring(0, 10) : "Date Unknown"}</p>
                                </div>
                            </div>
                            <div style="font-size: 18px;" class="d-flex justify-content-center align-items-center">
                                <div class="d-flex">
                                    <i style="color: #515151;"
                                        class="fa-solid fa-eye d-flex align-items-center me-3"></i>
                                
                                    <p class="my-0 py-0 view-count">${news.total_view ? news.total_view : 0}</p>
                                </div>
                               
                            </div>
                                                        <div style="font-size: 18px;" class="d-flex justify-content-center align-items-center">
                                <div class="d-flex">
                                    <i style="color: #515151;" class="fa-solid fa-star d-flex align-items-center"></i>
                                    <i style="color: #515151;" class="fa-solid fa-star d-flex align-items-center"></i>
                                    <i style="color: #515151;" class="fa-solid fa-star d-flex align-items-center"></i>
                                    <i style="color: #515151;" class="fa-solid fa-star d-flex align-items-center"></i>
                                    <i style="color: #515151;" class="fa-solid fa-star-half-stroke d-flex align-items-center"></i>
                                </div>
                               
                            </div>
                            <div style="font-size: 22px;" class="d-flex align-items-center">
                                <i class="fa-solid fa-arrow-right text-purple"></i>
                            </div>
                        </div>
                    </div>
                </div>
        `;
        newsSection.appendChild(newsDiv);
    }
    const newsNumber = document.getElementById('news-numbers');
    newsNumber.innerText = `${allNews.length} items found for category ${category}`
}

let prev = 'home';
let idNo;
let nameOfCategory;
document.getElementById('categories-section').addEventListener('click', function (event) {
    if (event.target.tagName === 'A') {
        nameOfCategory = event.target.textContent;
        if (nameOfCategory !== "Breaking News" && nameOfCategory !== "Regular News" && nameOfCategory !== "International News" && nameOfCategory !== "Sports" && nameOfCategory !== "Entertainment" && nameOfCategory !== "Culture" && nameOfCategory !== "Arts" && nameOfCategory !== "All News") {
            console.log(nameOfCategory);
            infoSection.classList.add('d-none');
        }
        else {
            const cover = document.getElementById('cover');
            cover.classList.add('d-none');
            infoSection.classList.remove('d-none');
        }
        loadSpinner();
        const todaysBtn = document.getElementById('todays-pick-btn');
        todaysBtn.classList.remove('btn-clicked');
        todaysBtn.classList.add('btn-not-clicked');
        const trendingBtn = document.getElementById('trending-btn');
        trendingBtn.classList.remove('btn-clicked');
        trendingBtn.classList.add('btn-not-clicked');

        const home = document.getElementById(prev);
        home.classList.remove('active-category');
        home.classList.add('inactive-category');
        const categoryName = document.getElementById(event.target.id);
        prev = event.target.id;
        categoryName.classList.remove('inactive-category');
        categoryName.classList.add('active-category');
        idNo = catIds[`${event.target.id}`];

        loadNews(idNo, nameOfCategory);


    }
});


document.getElementById('todays-pick-btn').addEventListener('click', function () {
    loadSpinner();
    const todaysBtn = document.getElementById('todays-pick-btn');
    todaysBtn.classList.remove('btn-not-clicked');
    todaysBtn.classList.add('btn-clicked');
    const trendingBtn = document.getElementById('trending-btn');
    trendingBtn.classList.remove('btn-clicked');
    trendingBtn.classList.add('btn-not-clicked');
    loadTodaysNews(idNo, nameOfCategory);
})

document.getElementById('trending-btn').addEventListener('click', function () {
    loadSpinner();
    const todaysBtn = document.getElementById('todays-pick-btn');
    todaysBtn.classList.remove('btn-clicked');
    todaysBtn.classList.add('btn-not-clicked');
    const trendingBtn = document.getElementById('trending-btn');
    trendingBtn.classList.remove('btn-not-clicked');
    trendingBtn.classList.add('btn-clicked');
    loadTrendingNews(idNo, nameOfCategory);
})

function loadSpinner() {
    const spinner = document.getElementById('spinner-section');
    spinner.classList.remove('d-none');
}

function stopSpinner() {
    const spinner = document.getElementById('spinner-section');
    spinner.classList.add('d-none');
}
const infoSection = document.getElementById('info-and-selection-section');

