const output = document.getElementById("output");
const form = document.getElementById("inputForm");
const selectBox = document.getElementById("generation");
const inputNum = document.getElementById("inputNum");

async function main() {
  form.addEventListener("submit", async (e) => {
    try {
      e.preventDefault();
      renderLoading();
      const pokeNum = parseInt(e.target.inputNum.value);
      if (!pokeNum) {
        throw new Error("Please insert a valid number");
      }
      await getPokemonAPI(pokeNum, e.target.generation.value);
      removeLoading();
      inputNum.value = "";
      selectBox.value = "generation-i";
    } catch (err) {
      removeLoading();
      renderError(err);
      console.log(err);
    }
  });
}

async function getPokemonAPI(number, generation) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}`);
    if (res.ok) {
      const data = await res.json();
      renderPokemon(data, generation);
    } else {
      throw new Error("Something went wrong, please try again.");
    }
  } catch (error) {
    renderError(error);
    console.log(error);
  }
}

function renderLoading() {
  console.log("I wasn't");
  const para = document.createElement("p");
  para.id = "loading";
  para.innerText = "Loading...";
  output.appendChild(para);
}

function removeLoading() {
  const load = document.getElementById("loading");
  output.removeChild(load);
}

function renderError(error) {
  const para = document.createElement("p");
  para.innerText = error;
  output.appendChild(para);
  setTimeout(() => output.removeChild(para), 2000);
}

function renderPokemon(data, generation) {
  if (
    data.sprites.versions[generation][
      Object.keys(data.sprites.versions[generation])[0]
    ]["front_default"]
  ) {
    const div = document.createElement("div");
    const pokeName = document.createElement("p");
    const pokeLowerName = data.name.slice(1);
    const pokeUpperName = data.name[0].toUpperCase();
    pokeName.innerText = pokeUpperName + pokeLowerName;

    console.log(Object.keys(data.sprites.versions[generation]));
    const img =
      data.sprites.versions[generation][
        Object.keys(data.sprites.versions[generation])[0]
      ]["front_default"];

    const imgElement = document.createElement("img");
    imgElement.src = img;
    imgElement.alt = `${data.name} from ${generation}`;

    div.appendChild(imgElement);
    div.appendChild(pokeName);
    output.appendChild(div);
  } else {
    renderError("Image doesn't exist for this Pokemon in this generation.");
  }
}

main();
