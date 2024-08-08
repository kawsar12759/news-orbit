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

function showNews(allNews, category) {
    const newsSection = document.getElementById('news-section');
    newsSection.innerHTML = '';
    for (news of allNews) {
        console.log(news);
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
document.getElementById('categories-section').addEventListener('click', function (event) {
    if (event.target.tagName === 'A') {
        const home = document.getElementById(prev);
        home.classList.remove('active-category');
        home.classList.add('inactive-category');
        const categoryName = document.getElementById(event.target.id);
        prev = event.target.id;
        categoryName.classList.remove('inactive-category');
        categoryName.classList.add('active-category');
        const idNo = catIds[`${event.target.id}`];
        loadNews(idNo, event.target.textContent);


    }
});