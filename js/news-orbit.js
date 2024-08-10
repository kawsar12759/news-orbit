
let allNewsCollection;

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
    allNewsCollection = data.data;
    showNews(allNewsCollection, category);
}

async function loadTodaysNews(id, category) {
    const res = await fetch(`https://openapi.programming-hero.com/api/news/category/${id}`);
    const data = await res.json();
    allNewsCollection = data.data;
    let todaysNews = [];
    for (news of allNewsCollection) {
        const status = news.others_info.is_todays_pick;
        if (status === true) {
            todaysNews.push(news);
        }
    }
    showNews(todaysNews, category);
    allNewsCollection = todaysNews;
}

async function loadTrendingNews(id, category) {
    const res = await fetch(`https://openapi.programming-hero.com/api/news/category/${id}`);
    const data = await res.json();
    allNewsCollection = data.data;
    let trendingNews = [];
    for (news of allNewsCollection) {
        const status = news.others_info.is_trending;
        if (status === true) {
            trendingNews.push(news);
        }
    }
    showNews(trendingNews, category);
    allNewsCollection = trendingNews;
}

async function loadNewsDetails(id) {
    const res = await fetch(`https://openapi.programming-hero.com/api/news/${id}`);
    const data = await res.json();
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
    <div>
        <img class="w-100" src="${data.data[0].image_url}" alt="">
    </div>
    <div>
        <h3 class="text-center my-3">${data.data[0].title}<h3>
    </div>
    <div>
        <p>${data.data[0].details}<p>
    </div>
    `
}


async function loadHighToLowSortedData(id, category) {
    allNewsCollection.sort((a, b) => b.total_view - a.total_view)
    showNews(allNewsCollection, category);
}

async function loadLowToHighSortedData(id, category) {
    allNewsCollection.sort((a, b) => a.total_view - b.total_view)
    showNews(allNewsCollection, category);
}


let viewCount = {};
const noNewsAlertSection = document.getElementById('no-news-alert-section');
function showNews(allNews, category) {
    let counter = 0;
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
        viewCount[`${counter}`] = news.total_view ? news.total_view : 0;
        counter++;
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
                            <div class="d-flex">
                                <div class="me-3">
                                            <img style="width:45px; height: 45px;"
                                             src="${news.author.img}"
                                            class="rounded-circle" alt="">
                                </div>
                                <div>  
                                        <h6 class="author-name">${news.author.name ? news.author.name : "Anonymous"}</h6>
                                        <p class="publish-date mb-0 pb-0">${news.author.published_date ? news.author.published_date.substring(0, 10) : "Date Unknown"}</p>
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
                            <div onclick="showModal('${news._id}')" style="font-size: 22px;" class="d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
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
        document.getElementById('sort-type').innerText = "Default";
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
    document.getElementById('sort-type').innerText = "Default";
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
    document.getElementById('sort-type').innerText = "Default";
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


document.getElementById('high-to-low').addEventListener('click', function () {
    loadHighToLowSortedData(idNo, nameOfCategory);
    document.getElementById('sort-type').innerText = "High -> Low";
})

document.getElementById('low-to-high').addEventListener('click', function () {
    loadLowToHighSortedData(idNo, nameOfCategory);
    document.getElementById('sort-type').innerText = "Low -> High";
})

function showModal(id) {
    loadNewsDetails(id);
}