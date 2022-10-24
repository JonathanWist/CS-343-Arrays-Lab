console.log(data);
// 1. instead of creating the cards manually, we should use array functions to convert the data into cards

const courseToCard = ({prefix, number, title, url, desc, prereqs, credits}) => {
  const prereqLinks = prereqs.map(
    (prereq) => `<a href="#" class="card-link">${prereq}</a>`).join();
    const courseTemplate = `<div class="col">
      <div class="card" style="width: 18rem;">
        <h3 class="card-header"><a href="${url}">${title}</a></h3>
        <div class="card-body">
          <h5 class="card-title">${prefix} ${number}</h5>
          <p class="card-text">${desc}</p>
          ${prereqLinks}
          <div class="card-footer text-muted">
            ${credits}
          </div>
        </div>
      </div>
    </div>`;
  return courseTemplate;
};

const resultsContainer = document.querySelector("#filtered");
const summaryContainer = document.querySelector("#summary");
const courseCards = data.items.map(courseToCard);
resultsContainer.innerHTML = courseCards.join("");
//document.write(courseCards.join(''));

// 3. we update the result count and related summary info as we filter

const updateSummary = (cards) => {
  let items = cards.length;
  console.log(cards);
  console.log(items);

  const initial = 0;
  const sumOfCreditHours = cards.reduce((prev, curr) => {
    return prev + curr.credits;
  }, initial);
  console.log(sumOfCreditHours);

  const uniquePrereqs = new Set();
  const sumOfPrereqHours = cards.reduce((prev, curr) => {
    let courseCredits = 0;
    curr.prereqs.forEach((prereq) => {
      if (!uniquePrereqs.has(prereq)) {
        uniquePrereqs.add(prereq);
        const course = data.items.find((course) => course.number == prereq);
        courseCredits = course.credits;
        /*courseCredits = data.items.reduce((prevcard, card) => {
          let credits = 0;
          if (card.number == prereq) {
            credits = card.credits;
          }
          return prevcard + credits;}, initial);*/
      }
    })
    return prev + courseCredits;
  }, initial);
  
  const summaryTemplate = `<h2>Summary</h2>
  <dl>
    <dt>Count</dt>
    <dd><span>${items}</span> items</dd>
    <dt>Cost</dt>
    <dd><span>${sumOfCreditHours}</span> credit-hours + <span>${sumOfPrereqHours}</span> credit-hours of prereqs</dd>
  </dl>`
  return summaryTemplate;
};

window.onload = (ev) => {summaryContainer.innerHTML = updateSummary(data.items)};

// 2. maybe we only show those that match the search query?

const filterCourseCard = (markup, query) => {
  return markup.toLowerCase().includes(query.toLowerCase());
};

const filterData = (card, query) => {
  if (query == card.number || query == card.credits) {
    return true;
  } else if (filterCourseCard(card.title, query) || filterCourseCard(card.prefix, query) 
  || filterCourseCard(card.desc, query)) {
    return true;
  } else {
    return card.prereqs.some(prereq => prereq == query);
  }
}

const searchButton = document.getElementById("search-btn");
searchButton.addEventListener("click", (ev) => {
  ev.preventDefault();
  const searchField = document.querySelector('input[name="query-text"]');
  const queryText = searchField.value;
  const filteredData = data.items.filter((card) => filterData(card, queryText));
  console.log(filteredData);
  //const filteredCards = courseCards.filter((card) => filterCourseCard(card, queryText));
  const filteredCards = filteredData.map(courseToCard);
  resultsContainer.innerHTML = filteredCards.join("");
  summaryContainer.innerHTML = updateSummary(filteredData);
});