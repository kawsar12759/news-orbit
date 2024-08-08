async function loadCategories() {
    const res = await fetch('https://openapi.programming-hero.com/api/news/categories');
    const data = await res.json();
    showCategories(data.data.news_category)
}
loadCategories();
let catIds = {};
function showCategories(newsCategories) {
    const categoriesSection = document.getElementById('categories-section');
    for (newsCategory of newsCategories) {
        const idName = newsCategory.category_name.toLowerCase().replace(' ', '-');
        console.log(idName);
        catIds[`${idName}`] = newsCategory.category_id;
        const categoryDiv = document.createElement('div');
        categoryDiv.innerHTML = `<a class="inactive-category fw-medium px-2 py-1" id="${idName}" href="#">${newsCategory.category_name}</a>`;

        categoriesSection.appendChild(categoryDiv);

    }

}


let prev='home';
document.getElementById('categories-section').addEventListener('click', function (event) {
    if (event.target.tagName === 'A') {
        const home = document.getElementById(prev);
        home.classList.remove('active-category');
        home.classList.add('inactive-category');
        const categoryName = document.getElementById(event.target.id);
        prev = event.target.id;
        categoryName.classList.remove('inactive-category');
        categoryName.classList.add('active-category');

    }
});