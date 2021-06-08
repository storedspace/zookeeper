let products = [0,0,0,0];
let productsName = ["口罩","酒精","額溫槍","護目鏡"];
let productsPrice = [119,105,615,178];
let allProductNum = 0;

function saveSelect(sel, productId){
    let num = parseInt(sel.options[sel.selectedIndex].text);
    products[ productId ]+= num; //新增數量至購物車
    allProductNum+= num;
}
function add(n){
    let id = "productNum"+n;
    let num = parseInt(document.getElementById(id).value);
    num+=1;
    document.getElementById(id).value = num;
    products[n] = num;
    document.getElementById("price"+n).innerHTML = "NT$"+num*productsPrice[n];
    let p = document.getElementById("priceAll").innerHTML;
    p = parseInt(p.substring(3,p.length));
    p+= productsPrice[n];
    let ss = "NT$"+p
    document.getElementById("priceAll").innerHTML = ss;
}
function minus(n){
    let id = "productNum"+n;
    let num = parseInt(document.getElementById(id).value);
    
    let p = document.getElementById("priceAll").innerHTML;
    p = parseInt(p.substring(3,p.length));

    if(num>0) {
        num-=1;
        p-= productsPrice[n];
    }
    document.getElementById("price"+n).innerHTML = "NT$"+num*productsPrice[n];
    document.getElementById(id).value = num;
    products[n] = num;    
    
    let ss = "NT$"+p
    document.getElementById("priceAll").innerHTML = ss;
}

