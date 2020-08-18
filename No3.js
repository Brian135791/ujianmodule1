var arrProduct = [
    { id: 1579581080923,category: 'Fast Food' , name: "Noodle", price: 3500, stock : 9},
    { id: 1579581081130,category: 'Electronic' , name: "Headphone", price: 4300000, stock :8 },
    { id: 1579581081342,category: 'Cloth' , name: "Hoodie", price: 300000, stock :7 },
    { id: 1579581081577,category: 'Fruit' , name: "Apple", price: 10000, stock :8 }
];
var arrCategory = ["Fast Food", "Electronic", "Cloth", "Fruit"]
var tableContent
var cart = []

const setCategoryContent = (idElement, value = '') => {
    var categoryContent = `<option value=''>Pilih Kategori</option>`
    arrCategory.forEach(element => {
        if(element === value){
            categoryContent += `<option selected value='${element}'>${element}</option>`
        } else {
            categoryContent += `<option value='${element}'>${element}</option>`
        }
    })
    document.getElementById(idElement).innerHTML = categoryContent
}

setCategoryContent("categoryFilter")
setCategoryContent("categoryInput")

const filterData = () => {

    var keyword = document.getElementById("keyword").value.toLowerCase()
    var min = document.getElementById("min").value
    var max = document.getElementById("max").value
    var category = document.getElementById("categoryFilter").value

    var filteredProduct = arrProduct.filter(item => {
        var namaFilter = true
        var hargaFilter = true
        var categoryFilter = true

        if(keyword){
            namaFilter = item.name.toLowerCase().includes(keyword)
        }
         
        if(category){
            categoryFilter = item.category === category
        }

        if(min || max){
            if(min && max){
                hargaFilter = item.price >= min && item.price <= max
            } else if(min && !max){
                hargaFilter = item.price >= min
            } else {
                hargaFilter = item.price <= max
            }
        }

        return namaFilter && categoryFilter && hargaFilter
    })
    tampilData(filteredProduct)
}

const tampilData = (arr = arrProduct, idElement = "render", isCart = false) => {
    tableContent = ''
    arr.forEach((element, index) => {
        tableContent += `<tr id="row${index}">
            <td>${element.id}</td>
            <td>${element.category}</td>
            <td>${element.name}</td>
            <td>${element.price}</td>`
        if(isCart){
            tableContent += `<td>${element.qty}</td>
                <td id="cartAction${index}">
                    <button type="button" onclick="deleteData(${index}, true)">Delete</button>
                </td>
            </tr>`
        } else {
            tableContent += `<td>${element.stock}</td>
                <td><button type="button" onclick="tambahData(true,{id: ${element.id}, category: '${element.category}', name: '${element.name}', price: ${element.price}, stock: ${element.stock}})">Buy</button></td>
                <td id="action${index}">
                    <button type="button" onclick="renderEditForm(${index}, {id: ${element.id}, category: '${element.category}', name: '${element.name}', price: ${element.price}, stock: ${element.stock}})">Edit</button>
                    <button type="button" onclick="confirmDelete(${index})">Delete</button>
                </td>
            </tr>`
        }
    });
    document.getElementById(idElement).innerHTML = tableContent
}

tampilData()

const tambahData = (isCart = false, item = null) => {
    var name
    var price
    var category
    var stock
    var id
    var qty = 1
   

    if(isCart){
        let found
        name = item.name
        price = item.price
        category = item.category
        stock = item.stock
        id = item.id
        
        cart.forEach((element) => {
            if(element.name === item.name){
                found = true
                if(element.qty < stock){
                    qty = element.qty++
                }if(stock === 0){
                    alert(`stock abis`)
                }               
            }
        })

        if(!found){
            cart.push({
                id: id,
                category: category,
                name: name,
                price: price,
                qty: qty
            })
        }
        
        tampilData(cart, "render2", true)
    } else {
        name = document.getElementById("nameInput").value
        price = document.getElementById("priceInput").value 
        category = document.getElementById("categoryInput").value
        stock = document.getElementById("stockInput").value
        id = new Date().getTime()
    
        document.getElementById("nameInput").value = ''
        document.getElementById("priceInput").value = ''
        document.getElementById("categoryInput").value = ''
        document.getElementById("stockInput").value = ''
        arrProduct.push({
            id: id,
            category: category,
            name: name,
            price: price,
            stock: stock
        })
        tampilData()
    }
}

const confirmDelete = (index) => {
    let buttons = `<button type="button" onclick="deleteData(${index})">Yes</button>
        <button type="button" onclick="tampilData()">Cancel</button>`

    document.getElementById(`action${index}`).innerHTML = buttons;
}

const renderEditForm = (index, item) => {
    let forms = `<td>${item.id}</td>
        <td>
            <select id="editCategory${index}"
            </select>
        </td>
        <td>
            <input type="text" id="editName${index}" value="${item.name}" />
        </td>
        <td>
            <input type="number" id="editPrice${index}" value="${item.price}" />
        </td>
        <td>
            <input type="number" id="editStock${index}" value="${item.stock}" />
        </td>
        <td>
            <button type="button" onclick="editData(${index})">Save</button>
            <button type="button" onclick="tampilData()">Cancel</button>
        </td>`

    document.getElementById(`row${index}`).innerHTML = forms
    setCategoryContent(`editCategory${index}`, item.category)
}

const editData = (index) => {
    arrProduct[index].category = document.getElementById(`editCategory${index}`).value
    arrProduct[index].name = document.getElementById(`editName${index}`).value
    arrProduct[index].price = document.getElementById(`editPrice${index}`).value
    arrProduct[index].stock = document.getElementById(`editStock${index}`).value

    tampilData()
}

const deleteData = (index, isCart = false) => { //iscart mastikan orang mencet delete yang di field cart
    if(!isCart){
        arrProduct.splice(index,1)
        tampilData()
    } else {
        if(cart[index].qty > 1){
            cart[index].qty--
        } else {
            cart.splice(index,1)
        }
        tampilData(cart, "render2", true)
    }
}

const bayar = () => {
    let transactionDetailContent = `<h3>Transaction Detail</h3>`
    let totalHarga = 0
    let ppn = 0

    cart.forEach(item => {
        totalHarga += item.qty * item.price
        transactionDetailContent += `<p>${item.id} | ${item.category} | ${item.name} | ${item.qty} | ${item.price} |Total: ${item.qty * item.price} </p>`
    })

    ppn = totalHarga * 0.01
    transactionDetailContent += `<p><b>Total Harga: ${totalHarga} </p>
        <p>PPN: ${ppn}</b></p>
        <p><b>Total Pembayaran: ${totalHarga + ppn}</b></p>`

    document.getElementById("transactionDetail").innerHTML = transactionDetailContent
}