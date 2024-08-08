async function loadCategories() {
    const res = await fetch('https://openapi.programming-hero.com/api/news/categories');
    const data = await res.json();
    showCategories(data.data.news_category)
}
loadCategories();
function showCategories(newsCategories) {
    const categoriesSection = document.getElementById('categories-section');
    for (newsCategory of newsCategories) {
        const categoryDiv = document.createElement('div');
        categoryDiv.innerHTML = `<a class="no-underline fw-medium" href="">${newsCategory.category_name}</a>`
        categoriesSection.appendChild(categoryDiv);
        
    }

}