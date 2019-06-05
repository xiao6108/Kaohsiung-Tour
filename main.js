// MOD設定
const selectlist = document.querySelector('#selectlist');
const title = document.querySelector('.title');
const hotbox = document.querySelector('.hotbox');
const list = document.querySelector('.list');

//獲取資料
let data=[]

// 跟伺服器要資料-----------------------------------------------------------
const xhr = new XMLHttpRequest()
//格式:get/post、網址、同步與非同步
//大部份時候用true非同步執行，程式會往下跑，所以會撈不到資料
//如果執行false同步，會等資料回傳（卡住）再讓程式往下跑
xhr.open('get', 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', true)
//並沒有要傳任何值寫null
xhr.send(null)

//xhr.onload確定資料回傳回來後，執行
xhr.onload = function() {
  if (this.status == 200) {
    getData();
  } else {
    list.innerHTML = "沒法連接資料庫 status"
  }
};
// 轉資料JSON.parse，並過濾select資料-------------------------------------------
function getData() {
  var area = [];
  var arealist = [];
  data = JSON.parse(xhr.responseText);
  data = data.result.records;
  
  for(let i=0;i<data.length;i++){
    arealist.push(data[i].Zone)
  }
  //檢查不重複
  arealist.forEach(e=>{
    if(area.indexOf(e)==-1){
      area.push(e);
    }
  });
  areaUpdated(area)
}

// 資料代入下拉選單-------------------------------------------
function areaUpdated(e) {
  let str = '';
  //增加一行disable option
  for (let i = -1; i < e.length; i++) {
    if (i == -1) {
      str += `<option selected="selected" disabled="disabled" value=""> -- 請選擇行政區 -- </option>`
    } else {
      str += `<option value=${e[i]}>${e[i]}</option>`
    }
  }
  selectlist.innerHTML = str;
}

//熱門行政區更改資料-------------------------------------------
function hotlist(e) {
  if(e.target.nodeName=="INPUT"){
    updatedList(e);
  }else{
    return
  }
}

//將所有區域資料代入畫面-------------------------------------------
function updatedList(e){
  let str=''

  for(let i=0;i<data.length;i++){
    //e.target.value<<option的value>> == 區名稱 
    if(data[i].Zone==e.target.value){
      //更改標題
      title.textContent = data[i].Zone;

    //更改所有畫面上的資料
    str+=`<div class="col-sm-6 col-md-4"><a class="cover-box" href="#"><div class="about"><h3>${data[i].Name}<span class="zone">[${data[i].Zone}]</span></h3><div class="opentime"><i class="fa fa-clock-o mg-r"></i>${data[i].Opentime}</div><div class="address"><i class="fa fa-map-marker mg-r"></i>${data[i].Add}</div><div class="telephone"><i class="fa fa-phone mg-r"></i>${data[i].Tel}</div></div><div class="cover" style="background:url(${data[i].Picture1}) no-repeat center; background-size: cover;"></div></a></div>`
    }
  }
  list.innerHTML = str;
}

// 下拉與更新觸發事件-------------------------------------------
hotbox.addEventListener('click', hotlist);
selectlist.addEventListener('change', updatedList);