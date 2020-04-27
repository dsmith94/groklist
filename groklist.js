

/*
var data = {
    stores: {
        "WinCo" : [],
        "Fred Meyers" : [],
    },
    categories: {
        Produce: {
            Lettuce: true,
            Carrots: true,
        },
        "Meat and Fish": {
            Scallops: true,
            Shrimp: true,
        }
    },
    selectedStore: "WinCo",
};
*/


var data = {
    stores: {
    },
    categories: {
    },
    selectedStore: "",
};

var exploded = true;




var currentPage = 'main';


function SetHeader(element) {
    const e = document.getElementById("HeaderBar");
    if (e) {
        e.innerHTML = element;
    }
}


function RefreshHeader() {
    const highlightedColor = "w3-aqua\"";
    const buttonColor = {
        "main": (currentPage === "main") ? highlightedColor : "\"",
        "edit": (currentPage === "edit") ? highlightedColor : "\"",
        "store": (currentPage === "store") ? highlightedColor : "\"",
        "category": (currentPage === "category") ? highlightedColor : "\"",
    }
    const classes = `class="w3-bar-item w3-button`;
    const labelDiv = `<div style="font-size: xx-small;">`;
    let s = [
        `<div>Groklist</div><div>`,
        `<button style='width:25%;' ${classes} ${buttonColor["main"]} onclick="MainButtonEvent();">&#127822; ${labelDiv}Main</div></button>`,
        `<button style='width:25%;' ${classes} ${buttonColor["edit"]} onclick="EditButtonEvent();">&#9998; ${labelDiv}Edit</div></button>`,
        `<button style='width:25%;' ${classes} ${buttonColor["store"]} onclick="StoreButtonEvent();">&#127980; ${labelDiv}Stores</div></button>`,
        `<button style='width:25%;' ${classes} ${buttonColor["category"]} onclick="CategoryButtonEvent();">&#10070; ${labelDiv}Categories</div></button>`,
        `</div>`,
    ];
    SetHeader(s.join(""));
}


function SetStatus(element) {
    const e = document.getElementById("StatusBar");
    if (e) {
        e.innerHTML = element;
    }
}


function SetDisplay(element) {
    const e = document.getElementById("ListDisplay");
    if (e) {
        e.innerHTML = element;
    }
}


function MainButtonEvent() {
    currentPage = "main";
    Refresh();
}


function EditButtonEvent() {
    currentPage = "edit";
    Refresh();
}


function StoreButtonEvent() {
    currentPage = "store";
    Refresh();
}


function CategoryButtonEvent() {
    currentPage = "category";
    Refresh();
}


function ToggleAccordion(id) {
    const panel = document.getElementById(`pn_${id}`);
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
}


function ToggleStrike(category, label) {
    if (data.categories[category][label] === true) {
        data.categories[category][label] = false;
    }
    else {
        data.categories[category][label] = true;
    }
    Refresh();
    ToggleAccordion(category);
}


function RefreshStoreCategoryData() {
    for (const category of Object.keys(data.categories)) {
        for (const store of Object.keys(data.stores)) {
            if (data.stores[store].indexOf(category) === -1) {
                data.stores[store].push(category);
            }
        }
    }
}


function ChangeSelectedStore() {
    const e = document.getElementById("StoreSelect");
    if (e) {
        data.selectedStore = e.value;
    }
    Refresh();
}


function ShowSelectedStore() {
    const e = document.getElementById("StoreSelect");
    if (e) {
        e.value = data.selectedStore;
    }
}


function ResetList() {
    for (const category of Object.keys(data.categories)) {
        for (const item of Object.keys(data.categories[category])) {
            data["categories"][category][item] = true;
        }
    }
    Refresh();
}


function RefreshMainPage() {
    let s = [];
    let stores = Object.keys(data.stores);
    const explodedDisplay = (exploded) ? `block` : `none`;
    exploded = false;
    if (stores.length > 0) {
        stores.sort((a, b) => a.localeCompare(b));
        let m = `<div class="w3-card" style="float: none;"><div class="w3-blue"><h3>Store</h3></div>
        <select class="w3-input" id="StoreSelect" onchange="ChangeSelectedStore();">`;
        for (n of stores) {
            m += `<option value="${n}">${n}</option>`;
        }
        m += `</select></div><p></p>`;
        s.push(m);
    }
    else {
        s.push(`No stores yet added. Begin by adding stores and categories.`);
    }
    if (data.selectedStore) {
        for (const category of data.stores[data.selectedStore]) {
            const buttonCode = `<button onclick="ToggleAccordion('${category}');" class="w3-btn w3-blue" style="width:90%;">${category}</button>`;
            const divCode = `<div class="w3-panel w3-pale-blue" id="pn_${category}" style="display: ${explodedDisplay}; overflow: hidden;">`;
            s.push(`${buttonCode}`);
            s.push(`${divCode}`);
            const listToGet = Object.keys(data.categories[category]).filter(x => data.categories[category][x] === true);
            const listToSkip = Object.keys(data.categories[category]).filter(x => data.categories[category][x] === false);
            listToGet.sort((a, b) => a.localeCompare(b));
            listToSkip.sort((a, b) => a.localeCompare(b));
            for (const label of listToGet) {
                s.push(`<p onclick="ToggleStrike('${category}', '${label}');">${label}</p>`);
            }
            for (const label of listToSkip) {
                s.push(`<p onclick="ToggleStrike('${category}', '${label}');" style="text-decoration:line-through;">${label}</p>`);
            }
            s.push(`</div><p></p>`);
        }
        const resetList = `<button onclick="ResetList();" class="w3-btn w3-indigo">Reset List</button>`;
        s.push(resetList);
    }
    SetDisplay(s.join(""));
    ShowSelectedStore();
}


function CancelAddItem() {
    currentPage = 'edit';
    Refresh();
}


function FinishAddItem() {
    const productName = document.getElementById("ProductName").value;
    const categoryName = document.getElementById("CategorySelect").value;
    data.categories[categoryName][productName] = true;
    currentPage = 'edit';
    Refresh();
}


function AddNewItem() {
    let s = [
        `<div class="w3-card-4">`,
        `<div class="w3-container w3-blue"><h4>New Product</h4>`,
        `<p>`,
        `<input class="w3-input w3-blue" type="text" id="ProductName" placeholder="Food">`,
        `<label>Product Name</label>`,
        `</p>`,
        `<p>`,
        `<select class="w3-input" id="CategorySelect">`,
    ];
    for (category of Object.keys(data.categories)) {
        s.push(`<option value="${category}">${category}</option>`);
    }
    let s2 = [
        `</select>`,
        `<label>Category</label>`,
        `</p>`,
        `<p>`,
        `<h3>`,
        `<button onclick="CancelAddItem();" class="w3-btn w3-blue" style="float: right;">&#10062;</button>`,
        `<button onclick="FinishAddItem();" class="w3-btn w3-blue" style="float: right;">&#9989;</button>`,
        `</h3>`,
        `</p>`,
        `</div>`,
        `</div>`,
    ];
    s = s.concat(s2);
    SetDisplay(s.join(""));
    const e = document.getElementById("ProductName");
    e.focus();
}


function DeleteItem(category, item)
{
    if (data.categories[category][item]) {
        delete data.categories[category][item];
    }
    Refresh();
}



function FinishEditLabel(c, i) {
    const v = document.getElementById("EditingProductName").value;
    if (v && v != i) {
        data["categories"][c][v] = data["categories"][c][i];
        delete data["categories"][c][i];
    }
    Refresh();
}


function FinishEditCategory(category, item) {
    const e = document.getElementById("CategorySelect").value;
    if (category != e) {
        const v = data["categories"][category][item];
        data["categories"][e][item] = v;
        delete data["categories"][category][item];
    }
    Refresh();
}


function EditCategory(c, i) {
    let masterList = [];
    for (const category of Object.keys(data.categories)) {
        const keys = Object.keys(data.categories[category]);
        for (const label of keys) {
            let divCode = `<div class="w3-panel w3-blue" id='en_${label}'>
            <span onclick="EditLabel('${category}', '${label}');"><h5>${label}</h5></span>
            <small><i>in ${category}</i></small>
            </div>`;
            if (c === category && i === label) {
                divCode = `<div class="w3-panel w3-blue" id='en_${label}'>
                <h5><span class="w3-input w3-blue"">${i}</h5>
                <select class="w3-input" id="CategorySelect" onfocusout="FinishEditCategory('${c}', '${i}');">`;
                for (m of Object.keys(data.categories)) {
                    divCode += `<option value="${m}">${m}</option>`;
                }
                divCode += `</select>`;
                divCode += `</div>`;
            }
            masterList.push(divCode);
        }
    }
    masterList.sort((a, b) => a.localeCompare(b));
    SetDisplay(masterList.join(""));
    const e = document.getElementById("CategorySelect");
    e.focus();
    e.selectionStart = e.selectionEnd = e.value.length;
}


function EditLabel(c, i) {
    let masterList = [];
    for (const category of Object.keys(data.categories)) {
        const keys = Object.keys(data.categories[category]);
        for (const label of keys) {
            let divCode = `<div class="w3-panel w3-blue" id='en_${label}'>
            <span onclick="EditLabel('${category}', '${label}');"><h5>${label}</h5></span>
            <small><i>in ${category}</i></small>
            </div>`;
            if (c === category && i === label) {
                divCode = `<div class="w3-panel w3-blue" id='en_${label}'>
                <h5><input class="w3-input w3-blue" type="text" id="EditingProductName"
                    onfocusout="FinishEditLabel('${c}', '${i}');" value="${i}"></h5>
                    <small><i>in ${category}</i></small>
                    </div>`;

            }
            masterList.push(divCode);
        }
    }
    masterList.sort((a, b) => a.localeCompare(b));
    SetDisplay(masterList.join(""));
    const e = document.getElementById("EditingProductName");
    e.focus();
    e.selectionStart = e.selectionEnd = e.value.length;
}


function RefreshEditPage() {
    const newItem = `<button onclick="AddNewItem();" class="w3-btn w3-indigo">Add New Item</button>`;
    let masterList = [];
    for (const category of Object.keys(data.categories)) {
        const keys = Object.keys(data.categories[category]);
        for (const label of keys) {
            const divCode = `<div class="w3-panel w3-blue" id='en_${label}' style="float: none;">
            <h3><span onclick="DeleteItem('${category}', '${label}');" style="float: right;">&#10062;</span></h3>
            <span onclick="EditLabel('${category}', '${label}');"><h5>${label}</h5></span>
            <small><i>in <span onclick="EditCategory('${category}', '${label}');">${category}</span></i></small>
            </div><p></p>`;
            masterList.push(divCode);
        }
    }
    masterList.sort((a, b) => a.localeCompare(b));
    masterList.unshift(newItem);
    SetDisplay(masterList.join(""));
}


function MoveUpCat(store, category)
{
    let arr = data.stores[store];
    const index = arr.indexOf(category);
    if (index > 0) {
        const i1 = index;
        const i2 = i1 - 1;
        [arr[i1], arr[i2]] = [arr[i2], arr[i1]];
    }
    Refresh();
}


function MoveDownCat(store, category)
{
    let arr = data.stores[store];
    const index = arr.indexOf(category);
    if (index < (arr.length - 1) && index > -1) {
        const i1 = index;
        const i2 = i1 + 1;
        [arr[i1], arr[i2]] = [arr[i2], arr[i1]];
    }
    Refresh();
}


function ReallyDeleteStore(store) {
    delete data.stores[store];
    Refresh();
}


function DeleteStore(store) {
    let s = [
        `<h3>Are you sure you want to delete store <br><b>${store}?</b></h3>`,
        `<h4>This action cannot be undone.</h4>`,
        `<button style="margin:3em;" onclick="ReallyDeleteStore('${store}');" class="w3-btn w3-indigo">Yes</button>`,
        `<button style="margin:3em;" onclick="Refresh();" class="w3-btn w3-indigo">No</button>`,
    ];
    SetDisplay(s.join(""));
}


function FinishAddStore() {
    const storeName = document.getElementById("StoreName").value;
    if (!data.stores[storeName]) {
        data.stores[storeName] = [];
    }
    Refresh();
}


function AddNewStore() {
    let s = [
        `<div class="w3-card-4">`,
        `<div class="w3-container w3-blue"><h4>New Store</h4>`,
        `<p>`,
        `<input class="w3-input w3-blue" type="text" id="StoreName" placeholder="eg Safeway">`,
        `<label>Store Name</label>`,
        `</p>`,
    ];
    let s2 = [
        `<p>`,
        `<h3>`,
        `<button onclick="Refresh();" class="w3-btn w3-blue" style="float: right;">&#10062;</button>`,
        `<button onclick="FinishAddStore();" class="w3-btn w3-blue" style="float: right;">&#9989;</button>`,
        `</h3>`,
        `</p>`,
        `</div>`,
        `</div>`,
    ];
    s = s.concat(s2);
    SetDisplay(s.join(""));
    const e = document.getElementById("StoreName");
    e.focus();
}


function RefreshStorePage() {
    let s = [];
    let stores = Object.keys(data.stores);
    stores.sort((a, b) => a.localeCompare(b));
    const newStore = `<button onclick="AddNewStore();" class="w3-btn w3-indigo">Add New Store</button>`;
    s.push(newStore);
    for (const store of stores) {
        const h = `<div class="w3-card" id='es_${store}' style="float: none;"><div class="w3-blue">
        <h3>${store}
        <span onclick="DeleteStore('${store}');" style="float: right;">&#10062;</span></h3>
        </div><div class="w3-pale-yellow">`;
        s.push(h);
        for (const category of data.stores[store]) {
            const div = `<div>
            <div class="w3-container w3-pale-red" style="float: right; font-size: x-large;">
            <b><span onclick="MoveUpCat('${store}', '${category}');">&uArr;</span> &nbsp; &nbsp;
            <span onclick="MoveDownCat('${store}', '${category}');">&dArr;</span> &nbsp;</b>
            </div>
            <div style="float: none;">${category}</div>
            </div>
            <br>
            `;
            
            s.push(div);
        }
        s.push(`</div></div>`);
    }
    SetDisplay(s.join(""));
}


function FinishAddCategory() {
    const categoryName = document.getElementById("CategoryName").value;
    if (!data.categories[categoryName]) {
        data.categories[categoryName] = {};
    }
    Refresh();
}


function AddNewCategory() {
    let s = [
        `<div class="w3-card-4">`,
        `<div class="w3-container w3-blue"><h4>New Category</h4>`,
        `<p>`,
        `<input class="w3-input w3-blue" type="text" id="CategoryName" placeholder="Category">`,
        `<label>Category Name</label>`,
        `</p>`,
    ];
    let s2 = [
        `<p>`,
        `<h3>`,
        `<button onclick="Refresh();" class="w3-btn w3-blue" style="float: right;">&#10062;</button>`,
        `<button onclick="FinishAddCategory();" class="w3-btn w3-blue" style="float: right;">&#9989;</button>`,
        `</h3>`,
        `</p>`,
        `</div>`,
        `</div>`,
    ];
    s = s.concat(s2);
    SetDisplay(s.join(""));
    const e = document.getElementById("CategoryName");
    e.focus();
}



function ReallyDeleteCategory(category)
{
    delete data["categories"][category];
    Refresh();
}


function DeleteCategory(category) {
    let s = [
        `<h3>Are you sure you want to delete category <br><b>${category}?</b></h3>`,
        `<h4>This action cannot be undone.</h4>`,
        `<button style="margin:3em;" onclick="ReallyDeleteCategory('${category}');" class="w3-btn w3-indigo">Yes</button>`,
        `<button style="margin:3em;" onclick="Refresh();" class="w3-btn w3-indigo">No</button>`,
    ];
    SetDisplay(s.join(""));
}


function RefreshCategoryPage() {
    let masterList = [];
    const newCategory = `<button onclick="AddNewCategory();" class="w3-btn w3-indigo">Add New Category</button>`;
    for (const category of Object.keys(data.categories)) {
        const div = `<div class="w3-panel w3-blue" id='ec_${category}'>
        <h3><span onclick="DeleteCategory('${category}');" style="float: right;">&#10062;<p></p></span></h3>
        ${category}
        </div><p></p>`;
        masterList.push(div);
    }
    masterList.sort((a, b) => a.localeCompare(b));
    masterList.unshift(newCategory);
    SetDisplay(masterList.join(""));
}


function Refresh() {
    RefreshStoreCategoryData();
    const content = {
        "main": RefreshMainPage,
        "edit": RefreshEditPage,
        "store": RefreshStorePage,
        "category": RefreshCategoryPage,
    }
    RefreshHeader();
    content[currentPage]();
    Save();
}


function Save() {
    const s = JSON.stringify(data);
    window.localStorage.setItem("data", s);
}


function Load() {
    const s = window.localStorage.getItem("data");
    if (s) {
        data = JSON.parse(s);
    }
}



function ExplodeList() {

}


function Begin() {
    Load();
    Refresh();
}



window.onload = function() {
    /* Only register a service worker if it's supported */
    /*
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js');
    }
    */
    Begin();
};


