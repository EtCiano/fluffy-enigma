const limparnpcs = document.getElementById('limparnpcs');
const botaoAdicionarNPC = document.getElementById('buttoniniciativa');
const containerNPC = document.getElementById('npcinimigosection');
const deleteficha = document.getElementById('deleteficha');
const adicionarhabilidade = document.getElementById('adicionarhabilidade');
const adicionaritem = document.getElementById('adicionaritem');
const selectitem = document.getElementById('selectitem');

const inputstr = document.getElementById('inputstr');
const inputdex = document.getElementById('inputdex');
const inputcon = document.getElementById('inputcon');
const inputint = document.getElementById('inputint');
const inputwis = document.getElementById('inputwis');
const inputcha = document.getElementById('inputcha');

let allEquipmentData = [];

function calcularModificador(inputElement, modElement) {
    const valor = parseInt(inputElement.value);
    const mod = isNaN(valor) ? '' : (Math.floor((valor - 10) / 2) >= 0 ? `+${Math.floor((valor - 10) / 2)}` : Math.floor((valor - 10) / 2));
    if (modElement) {
        modElement.textContent = mod;
    }
}

const inputsatributosIniciais = [inputstr, inputdex, inputcon, inputint, inputwis, inputcha];
inputsatributosIniciais.forEach(input => {
    input.addEventListener('input', () => {
        const modId = `modificador${input.id.slice(5)}`;
        const modElement = document.getElementById(modId);
        calcularModificador(input, modElement);
    });
});

adicionarhabilidade.addEventListener('click', () => {
    const novaHabilidade = document.createElement('input');
    novaHabilidade.type = 'text';
    novaHabilidade.className = 'inputfichagrande';
    novaHabilidade.placeholder = '.....';
    adicionarhabilidade.parentElement.parentElement.appendChild(novaHabilidade);
});

adicionaritem.addEventListener('click', () => {
    const novoSelect = document.createElement('select');
    novoSelect.name = 'item';
    novoSelect.className = 'item';
    populateEquipmentSelect(novoSelect);
    adicionaritem.parentElement.parentElement.appendChild(novoSelect);
});

deleteficha.addEventListener('click', () => {
    deleteficha.parentElement.parentElement.remove();
});

limparnpcs.addEventListener('click', () => {
    containerNPC.innerHTML = '';
});

if (botaoAdicionarNPC && containerNPC) {
    botaoAdicionarNPC.addEventListener('click', () => {
        const novoNPC = document.createElement('div');
        novoNPC.className = 'npcinimigo';
        novoNPC.innerHTML = `
            <section>
                <input type="text" class="inputficha" placeholder="Nome">
                <select name="condicoes" class="condicoes">
                    <option value="Normal">Normal</option>
                    <option value="Surdo">Surdo</option>
                    <option value="Rastreado">Rastreado</option>
                    <option value="Possuído">Possuído</option>
                    <option value="Petrificado">Petrificado</option>
                    <option value="Paralisado">Paralisado</option>
                    <option value="Marcado">Marcado</option>
                    <option value="Invisível">Invisível</option>
                    <option value="Inconsciente">Inconsciente</option>
                    <option value="Incapacitado">Incapacitado</option>
                    <option value="Exaustão">Exaustão</option>
                    <option value="Escondido">Escondido</option>
                    <option value="Envenenado">Envenenado</option>
                    <option value="Enfeitiçado">Enfeitiçado</option>
                    <option value="Dominado">Dominado</option>
                    <option value="Desafiado">Desafiado</option>
                    <option value="Contido">Contido</option>
                    <option value="Confuso">Confuso</option>
                    <option value="Cego">Cego</option>
                    <option value="Caído">Caído</option>
                    <option value="Atordoado">Atordoado</option>
                    <option value="Amedrontado">Amedrontado</option>
                    <option value="Agarrado">Agarrado</option>
                </select>
                <img class="deleteficha" src="https://images.icon-icons.com/37/PNG/512/delete_4219.png">
            </section>
            <section id="gridficha">
                <p id="pficha">Raça:</p>
                <p id="pficha">Classe:</p>
                <p id="pficha">Nível:</p>
            </section>
            <section id="gridficha">
                <input type="text" class="inputfichasubclasse" placeholder=".....">
                <input type="text" class="inputfichasubclasse" placeholder=".....">
                <input type="text" class="inputfichasubclasse" placeholder=".....">
            </section>
            <section id="gridficha">
                <section>
                    <p id="pficha1">HP:</p>
                    <p id="pficha1">Máx.:</p>
                </section>
                <p id="pficha">CA:</p>
                <p id="pficha">Deslocamento:</p>
            </section>
            <section id="gridficha">
                <section>
                    <input type="text" class="inputfichasubclasse2" placeholder="...">
                    <strong>/</strong>
                    <input type="text" class="inputfichasubclasse2" placeholder="...">
                </section>
                <input type="text" class="inputfichasubclasse" placeholder=".....">
                <input type="text" class="inputfichasubclasse" placeholder=".....">
            </section>
            <hr id="hrnpc">
            <section id="gridficha">
                <p id="pficha">Str:</p>
                <p id="pficha">Dex:</p>
                <p id="pficha">Con:</p>
            </section>
            <section id="gridficha2">
                <section>
                    <input type="text" class="inputfichasubclasse1" name="inputstr" placeholder="...">
                    <p class="modificadorficha" name="modificadorstr"></p>
                </section>
                <section>
                    <input type="text" class="inputfichasubclasse1" name="inputdex" placeholder="...">
                    <p class="modificadorficha" name="modificadordex"></p>
                </section>
                <section>
                    <input type="text" class="inputfichasubclasse1" name="inputcon" placeholder="...">
                    <p class="modificadorficha" name="modificadorcon"></p>
                </section>
            </section>
            <section id="gridficha">
                <p id="pficha">Int:</p>
                <p id="pficha">Wis:</p>
                <p id="pficha">Cha:</p>
            </section>
            <section id="gridficha2">
                <section>
                    <input type="text" class="inputfichasubclasse1" name="inputint" placeholder="...">
                    <p class="modificadorficha" name="modificadorint"></p>
                </section>
                <section>
                    <input type="text" class="inputfichasubclasse1" name="inputwis" placeholder="...">
                    <p class="modificadorficha" name="modificadorwis"></p>
                </section>
                <section>
                    <input type="text" class="inputfichasubclasse1" name="inputcha" placeholder="...">
                    <p class="modificadorficha" name="modificadorcha"></p>
                </section>
            </section>
            <section id="gridficha1">
                <p id="pficha">Desafio (XP):</p>
                <p id="pficha">Linguagens:</p>
            </section>
            <section id="gridficha1">
                <input type="text" class="inputficha1" placeholder=".....">
                <input type="text" class="inputficha1" placeholder=".....">
            </section>
            <section style="align-items: flex-start;">
                <section class="sectionverticalficha">
                         <section class="sectionespecifica">
                        <button id="adicionarhabilidade">+</button>
                        <p id="pficha" style="font-size: 12px;">Proeficiencias e Habilidades</p>
                        </section>
                        <input type="text" class="inputfichagrande" placeholder=".....">
                </section>
                <section class="sectionverticalficha">
                    <section class="sectionespecifica">
                        <button id="adicionaritem">+</button>
                        <p id="pficha">Itens</p>
                        </section>
                        <select name="item" class="item" id="selectitem">
                            <option value=""></option>
                        </select>
                </section>
            </section>
        `;

        const deleteBtn = novoNPC.querySelector('.deleteficha');
        deleteBtn.addEventListener('click', () => {
            novoNPC.remove();
        });

        const addHabilidadeBtn = novoNPC.querySelector('#adicionarhabilidade');
        addHabilidadeBtn.addEventListener('click', () => {
            const novaHabilidade = document.createElement('input');
            novaHabilidade.type = 'text';
            novaHabilidade.className = 'inputfichagrande';
            novaHabilidade.placeholder = '.....';
            addHabilidadeBtn.parentElement.parentElement.appendChild(novaHabilidade);
        });

        const addItemBtn = novoNPC.querySelector('#adicionaritem');
        addItemBtn.addEventListener('click', () => {
            const novoSelect = document.createElement('select');
            novoSelect.name = 'item';
            novoSelect.className = 'item';
            populateEquipmentSelect(novoSelect);
            addItemBtn.parentElement.parentElement.appendChild(novoSelect);
        });
        
        const inputsAtributosNovo = novoNPC.querySelectorAll('.inputfichasubclasse1');
        inputsAtributosNovo.forEach(input => {
            input.addEventListener('input', () => {
                const modElement = input.nextElementSibling;
                calcularModificador(input, modElement);
            });
        });

        const novoSelectItem = novoNPC.querySelector('.item');
        populateEquipmentSelect(novoSelectItem);

        containerNPC.appendChild(novoNPC);
    });
}

function populateEquipmentSelect(selectElement) {
    if (!selectElement) return;

    const optionsHtml = allEquipmentData.map(item =>
        `<option value="${item.index}">${item.name}</option>`
    ).join('');

    selectElement.innerHTML = `<option value=""></option>${optionsHtml}`;
}

async function fetchAllEquipment() {
    try {
        const response = await fetch('https://www.dnd5eapi.co/api/equipment');
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.statusText}`);
        }
        const data = await response.json();
        allEquipmentData = data.results;

        populateEquipmentSelect(selectitem);

    } catch (error) {
        console.error("Falha ao carregar equipamentos da API:", error);

        if(selectitem) {
            selectitem.innerHTML = `<option value="">Erro ao carregar itens</option>`;
        }
    }
}

fetchAllEquipment();
