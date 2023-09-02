const detailsContainer = document.getElementById("detailsContainer");
const detailsModal = document.getElementById("details");
const showAllBtn = document.getElementById("showAll");

let isSortedData = false;
let isAllDataShown = false;

/* update global variable & load data as sorted */
function sortData(isSorted) {
  isSortedData = isSorted;
  loadData(isAllDataShown, isSortedData);
}

async function loadData(isShowAll = false, isSorted = isSortedData) {
  try {
    const response = await fetch(
      "https://openapi.programming-hero.com/api/ai/tools"
    );
    const loadedData = await response.json();

    const data = loadedData.data.tools;

    isAllDataShown = isShowAll; /* save the current state */

    if (!isShowAll) showAllBtn.classList.remove("hidden");
    if (isShowAll && !showAllBtn.classList.contains("hidden"))
      showAllBtn.classList.add("hidden");

    if (isSorted) {
      console.log("sorted.");
      data.sort((a, b) => {
        return new Date(b.published_in) - new Date(a.published_in);
      });
    }

    showData(data, isShowAll);
  } catch (error) {
    console.log("the error is: ", error);
  }
}

/* another way to function with async */
const detailsData = async (productId) => {
  try {
    const response = await fetch(
      `https://openapi.programming-hero.com/api/ai/tool/${productId}`
    );
    const data = await response.json();

    createModal(data?.data);
  } catch (error) {
    console.log("the error is: ", error);
  }
};
// detailsData("01");

const createModal = (details) => {
  detailsContainer.children[0].innerHTML = "";
  detailsContainer.children[1].innerHTML = "";
  console.log(details);

  const div = document.createElement("div");
  const div2 = document.createElement("div");
  const h3F = document.createElement("h3");
  const h3I = document.createElement("h3");
  const featuresContainer = document.createElement("aside");
  const integrationsContainer = document.createElement("aside");
  const pricing = document.createElement("div");
  const features = document.createElement("div");
  const ulF = document.createElement("ul");
  const ulI = document.createElement("ul");
  features.setAttribute("class", "flex justify-between");
  h3F.setAttribute("class", "font-semibold text-xl text-header pt-6");
  h3I.setAttribute("class", "font-semibold text-xl text-header pt-6");
  ulF.setAttribute("class", "list-disc list-inside py-4");
  ulI.setAttribute("class", "list-disc list-inside py-4");

  /* Creating Pricing Section */
  pricing.setAttribute(
    "class",
    "grid grid-cols-3 gap-2 text-base font-inter font-bold"
  );

  // details?.pricing?.forEach((price) => {
  //   const h3 = document.createElement("h3");
  //   h3.setAttribute(
  //     "class",
  //     "p-5 flex text-center items-center font-extrabold rounded-2xl bg-base-100 text-green-500"
  //   );
  //   h3.innerHTML = `${price?.price}<br>${price?.plan}`;
  //   pricing.appendChild(h3);
  // });

  /* Creating Features Container */
  h3F.innerText = "Features";
  featuresContainer.appendChild(h3F);

  /* Features is not an array but with numbered keys */
  const Features = details?.features;
  const numOfFeatures = Object.keys(Features)?.length || 0;
  for (let idxOfFeature = 1; idxOfFeature <= numOfFeatures; idxOfFeature++) {
    const li = document.createElement("li");
    li.innerText = Features[idxOfFeature]?.feature_name
      ? Features[idxOfFeature].feature_name
      : "No data found";
    ulF.appendChild(li);
  }
  featuresContainer.appendChild(ulF);

  /* Creating Integrations Container */
  h3I.innerText = "Integrations";
  integrationsContainer.appendChild(h3I);
  const Integrations = details?.integrations;
  Integrations?.forEach((integration) => {
    const li = document.createElement("li");
    li.innerText = integration ? integration : "No data found";
    ulI.appendChild(li);
  });
  integrationsContainer.appendChild(ulI);

  /* Creating Features Section */
  features.appendChild(featuresContainer);
  features.appendChild(integrationsContainer);

  /* Add to the left 'aside' */
  detailsContainer.children[0].innerHTML = `<h2 class="font-semibold text-2xl text-header leading-9 pb-6">${details?.description}</h2>`;
  detailsContainer.children[0].appendChild(pricing);
  detailsContainer.children[0].appendChild(div);
  detailsContainer.children[0].appendChild(features);

  /* Creating Poster-Image Section */
  div.innerHTML = "";
  const figure = document.createElement("figure");
  let linkURL = null;
  figure.setAttribute("class", "px-10 pt-10");
  figure.innerHTML = `<img src=${
    (details?.image_link.forEach((link) => {
      linkURL = link && !linkURL ? link : null;
    }),
    linkURL ? linkURL : "")
  } class="rounded-2xl" />`;
  div.appendChild(figure);

  /* Creating Input-Output Section */
  div2.setAttribute("class", "card-body items-center text-center");
  div2.innerHTML = `<h2 class="card-title pt-6">${
    details?.input_output_examples?.[0]?.input || "No! Not Yet! Take a break!!!"
  }</h2>
    <p class='py-5'>${
      details?.input_output_examples?.[0]?.output ||
      "No! Not Yet! Take a break!!!"
    }</p>`;

  /* Add to the right 'aside' */
  div.appendChild(div2);
  detailsContainer.children[1].appendChild(div);

  detailsModal.showModal();
}; /* Modal END */

/* Show AI */
const showData = (data, isShowAll = false) => {
  console.log(data.length);
  console.log(data);

  /* Show the 6 data by default  */
  let b = isShowAll ? data.length : 6;

  /* Data Container */
  const AiHubs = document.getElementById("AiHubs");
  AiHubs.innerHTML = "";

  data.slice(0, b).forEach((AI) => {
    console.log(AI.published_in);

    const card = document.createElement("div");
    const cardContext = document.createElement("div");
    const cardFooter = document.createElement("div");
    const ol = document.createElement("ol");
    const hr = document.createElement("hr");
    ol.setAttribute(
      "class",
      "text-base list-decimal list-inside pt-4 pb-6 leading-[26px]"
    );
    AI.features.forEach((liContent) => {
      const li = document.createElement("li");
      li.innerText = liContent;
      ol.appendChild(li);
    });
    card.setAttribute(
      "class",
      "card bg-base-100 border flex flex-col justify-between"
    );

    card.innerHTML = AI?.image
      ? `<figure class="p-6"><img src="${AI?.image}" alt="No Image Found" class='rounded-2xl' /></figure>`
      : "No Image Found";

    cardContext.setAttribute("class", "card-body");
    cardContext.innerHTML = `<h2 class="card-title text-header text-[25px] font-semibold">Features</h2>`;
    cardContext.appendChild(ol);
    cardContext.appendChild(hr);

    cardFooter.setAttribute("class", "flex justify-between items-center");
    cardFooter.innerHTML = `
        <div>
            <h2 class="card-title text-header text-[25px] font-semibold pb-4">${
              AI?.name || "Guess what it is."
            }</h2>
            <span><i class="fa fa-calendar"></i> ${
              AI?.published_in || "Up coming soon"
            }</span>
        </div>
        <i onclick="detailsData('${
          AI.id
        }')" class="fa fa-arrow-right rounded-full p-2 bg-red-50 text-red-400"></i>`;

    cardContext.appendChild(cardFooter);
    card.appendChild(cardContext);

    AiHubs.appendChild(card);
  });
};

/* Load Data Using API */
loadData();
