// 跑道表面状况信息转换工具
// By XeonM
// 20220519
// 说明：根据HTML页面选择，组合字符串，生成跑道表面状况信息
//      若需修改格式，请修改组合字符串。定位：跑道状况中文、英文、ACARS格式
// 修改记录：
// 20250513 
// 增加数据检查
// 增加特殊天气现象。字符串格式定位：特殊天气格式
// 

// 固定数据
// 二维数组，[0]显示，[1]中文，[2]英文，[3]ACARS
const rwySfCode = [['0', '1', '2', '3', '4', '5', '6', '无报告'],
					['0', '1', '2', '3', '4', '5', '6', '无报告'],
					['0', '1', '2', '3', '4', '5', '6', 'not reported'],
					['0', '1', '2', '3', '4', '5', '6', 'NR']];

// 二维数组，[0]显示，[1]中文，[2]英文，[3]ACARS
const plPctCode = [['无', '25', '50', '75', '100', '无报告'],
					['无', '百分之25', '百分之50', '百分之75', '百分之100', '无报告'],
					['none', '25 percent', '50 percent', '75 percent', '100 percent', 'not reported'],
					['NONE', '25PCT', '50PCT', '75PCT', '100PCT', 'NR']];

// 二维数组，[0]显示，[1]中文，[2]英文，[3]ACARS
const plCatCode = [["压实的雪-COMPACTED SNOW", "干-DRY", "干雪-DRY SNOW", "压实的雪面上有干雪-DRY SNOW ON TOP OF COMPACTED SNOW", "冰面上有干雪-DRY SNOW ON TOP OF ICE", "霜-FROST", "冰-ICE", "雪浆-SLUSH", "积水-STANDING WATER", "压实的雪面上有水-WATER ON TOP OF COMPACTED SNOW", "湿-WET", "湿冰-WET ICE", "湿雪-WET SNOW", "压实的雪面上有湿雪-WET SNOW ON TOP OF COMPACTED SNOW", "冰面上有湿雪-WET SNOW ON TOP OF ICE", "无报告-NOT REPORTED"],
["压实的雪", "干", "干雪", "压实的雪面上有干雪", "冰面上有干雪", "霜", "冰", "雪浆", "积水", "压实的雪面上有水", "湿", "湿冰", "湿雪", "压实的雪面上有湿雪", "冰面上有湿雪", "无报告"], 
["compacted snow", "dry", "dry snow", "dry snow on top of compacted snow", "dry snow on top of ice", "frost", "ice", "slush", "standing water", "water on top of compacted snow", "wet", "wet ice", "wet snow", "wet snow on top of compacted snow", "wet snow on top of ice", "not reported"],
["COMPACTED SNOW", "DRY", "DRY SNOW", "DRY SNOW ON TOP OF COMPACTED SNOW", "DRY SNOW ON TOP OF ICE", "FROST", "ICE", "SLUSH", "STANDING WATER", "WATER ON TOP OF COMPACTED SNOW", "WET", "WET ICE", "WET SNOW", "WET SNOW ON TOP OF COMPACTED SNOW", "WET SNOW ON TOP OF ICE", "NR"]];

// HTML选择栏ID，[行][列]
const elmId = [['rwySf26-select', 'rwySfMid-select', 'rwySf08-select'],
				['plCat26-select', 'plCatMid-select', 'plCat08-select'],
				['plDp26', 'plDpMid', 'plDp08'],
				['plPct26-select', 'plPctMid-select', 'plPct08-select']];

// const rwySf = ['rwySf26-select', 'rwySfMid-select', 'rwySf08-select'];
// const plCat = ['plCat26-select', 'plCatMid-select', 'plCat08-select'];
// const plDp = ['plDp26', 'plDpMid', 'plDp08'];
// const plPct = ['plPct26-select', 'plPctMid-select', 'plPct08-select'];

// 方向
const dir = [['0', '1', '2'], ['2', '1', '0']];

// 特殊天气
// 二维数组，[0]显示，[1]中文，[2]英文，[3]ACARS
const spWeatherLevel = [['无', '轻度', '中度', '重度'],
					['', '轻度', '中度', '重度'],
					['', 'light ', 'moderate ', 'severe '],
					['', 'LIGHT ', 'MODERATE ', 'SEVERE ']];

// 二维数组，[0]显示，[1]中文，[2]英文，[3]ACARS
const spWeatherCode = [['风切变-Windshear', '颠簸-Turbulence', '积冰-Icing'],
					['风切变', '颠簸', '积冰'],
					['windshear', 'turbulence', 'icing'],
					['WINDSHEAR', 'TURBULENCE', 'ICING']];

// 页面
// 选择栏添加选项
for (let v of elmId[0]) {
	for (let i = 0; i < rwySfCode[0].length; i++) {
		let opt = document.createElement('option');
		opt.value = i;
		opt.textContent = rwySfCode[0][i];
		document.getElementById(v).appendChild(opt);
	}	
}
for (let v of elmId[1]) {
	for (let i = 0; i < plCatCode[0].length; i++) {
		let opt = document.createElement('option');
		opt.value = i;
		opt.textContent = plCatCode[0][i];
		document.getElementById(v).appendChild(opt);
	}	
}
for (let v of elmId[3]) {
	for (let i = 0; i < plPctCode[0].length; i++) {
		let opt = document.createElement('option');
		opt.value = i;
		opt.textContent = plPctCode[0][i];
		document.getElementById(v).appendChild(opt);
	}	
}

// 功能
// 更新日期时间
function updateDatetime(){
	let date = new Date();
	document.getElementById('date').value = date.toISOString().substring(0,10);
	document.getElementById('time').value = date.toISOString().substring(11,16);
}
// “当前时间”按钮
// const btnUpDt = document.getElementById('btnCurTime');
const btnUpDt = document.querySelector('button#btnCurTime');
btnUpDt.addEventListener('click', updateDatetime);

// 清除选项按钮
function clnSel() {
	document.getElementById('date').value = '';
	document.getElementById('time').value = '';
	document.getElementById(elmId[0][0]).value = '';
	document.getElementById(elmId[0][1]).value = '';
	document.getElementById(elmId[0][2]).value = '';
	document.getElementById(elmId[1][0]).value = '';
	document.getElementById(elmId[1][1]).value = '';
	document.getElementById(elmId[1][2]).value = '';
	document.getElementById(elmId[2][0]).value = '';
	document.getElementById(elmId[2][1]).value = '';
	document.getElementById(elmId[2][2]).value = '';
	document.getElementById(elmId[3][0]).value = '';
	document.getElementById(elmId[3][1]).value = '';
	document.getElementById(elmId[3][2]).value = '';
	document.querySelector('Textarea#taZh').value = '';
	document.querySelector('Textarea#taEn').value = '';
	document.querySelector('Textarea#taAcars').value = '';
}

const btnClnSel_js = document.querySelector('button#btnClnSel');
btnClnSel_js.addEventListener('click', clnSel);


// 填充按钮，总，分项
// 填充选择栏选项
function fillElmt(ElID) {
	let val = document.getElementById(ElID[1]).value;
	document.getElementById(ElID[0]).value = val;
	document.getElementById(ElID[2]).value = val;
}

// 填充所有选择栏
function fillAll() {
	fillElmt(elmId[0]);
	fillElmt(elmId[1]);
	fillElmt(elmId[2]);
	fillElmt(elmId[3]);
}

// 填充按钮事件
function fillElmtRwySf() { fillElmt(elmId[0]); }
function fillElmtPlCat() { fillElmt(elmId[1]); }
function fillElmtPlDp() { fillElmt(elmId[2]); }
function fillElmtPlPct() { fillElmt(elmId[3]); }

// 填充按钮
const btnRwySfFil = document.getElementById('rwySfFil');
const btnPlCatFil = document.getElementById('plCatFil');
const btnPlDpFil = document.getElementById('plDpFil');
const btnPlPctFil = document.getElementById('plPctFil');
const btnFilAll_js = document.getElementById('btnFilAll');

// 按钮添加事件监听
btnRwySfFil.addEventListener('click', fillElmtRwySf);
btnPlCatFil.addEventListener('click', fillElmtPlCat);
btnPlDpFil.addEventListener('click', fillElmtPlDp);
btnPlPctFil.addEventListener('click', fillElmtPlPct);
btnFilAll_js.addEventListener('click', fillAll);

// 删除字符串特定位置字符，用于调整时间格式
// usage string.removeCharAt(n);
String.prototype.removeCharAt = function (i) {
    let tmp = this.split(''); // convert to an array
    tmp.splice(i - 1 , 1); // remove 1 element from the array (adjusting for non-zero-indexed counts)
    return tmp.join(''); // reconstruct the string
}

// 组合字符串
function genStr() {
	// 检查数据
	// 退出标志大于零则退出
	let exFlg = 0;
	// 数据未定义则高亮
	if (!document.querySelector("input#time").value) {
		document.querySelector("input#time").style.outlineStyle = 'solid';
		exFlg++;
	} else {
		document.querySelector("input#time").style.outlineStyle = '';
	}
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 3; j++) {
			if (!document.getElementById(elmId[i][j]).value) {
				document.getElementById(elmId[i][j]).style.outlineStyle = 'solid';
				exFlg++;
			} else {
				document.getElementById(elmId[i][j]).style.outlineStyle = '';
			}
		}
	}
	if (exFlg > 0) {
		return;
	}
	// 获得数据
	// 新建二维数组，行
	let rwy = document.querySelector('input[name=runway]:checked').value;
	let tD = document.querySelector("input#time").value.removeCharAt(3);
	let d = [];
	let datArr = new Array(4);
	for (let i = 0; i < 4; i++) {
		// 列
		datArr[i] = new Array(3);
	}
	datArr[0][0] = document.getElementById(elmId[0][0]).value;
	datArr[0][1] = document.getElementById(elmId[0][1]).value;
	datArr[0][2] = document.getElementById(elmId[0][2]).value;
	datArr[1][0] = document.getElementById(elmId[1][0]).value;
	datArr[1][1] = document.getElementById(elmId[1][1]).value;
	datArr[1][2] = document.getElementById(elmId[1][2]).value;
	datArr[2][0] = document.getElementById(elmId[2][0]).value;
	datArr[2][1] = document.getElementById(elmId[2][1]).value;
	datArr[2][2] = document.getElementById(elmId[2][2]).value;
	datArr[3][0] = document.getElementById(elmId[3][0]).value;
	datArr[3][1] = document.getElementById(elmId[3][1]).value;
	datArr[3][2] = document.getElementById(elmId[3][2]).value;
	
	// 跑道状况中文、英文、ACARS格式
	// 新建字符串
	let strZh = '跑道 ';
	let strEn = 'RWY ';
	let strAc = 'RWY ';
	
	// 判断跑道方向
	if (rwy === '26') {
		d = dir[0];
	} else {
		d = dir[1];
	}
	
	// 跑道状况代码、时间、污染物种类
	strZh = strZh + rwy + '，跑道状况代码 '
			+ rwySfCode[1][datArr[0][d[0]]] + '、'
			+ rwySfCode[1][datArr[0][d[1]]] + '、'
			+ rwySfCode[1][datArr[0][d[2]]] + '，'
			+ tD + 'Z，'
			+ plCatCode[1][datArr[1][d[0]]] + '、'
			+ plCatCode[1][datArr[1][d[1]]] + '、'
			+ plCatCode[1][datArr[1][d[2]]] + '，深度 ';
			
	strEn = strEn + rwy + ' surface condition code '
			+ rwySfCode[2][datArr[0][d[0]]] + ', '
			+ rwySfCode[2][datArr[0][d[1]]] + ', '
			+ rwySfCode[2][datArr[0][d[2]]] + ', issued at '
			+ tD + ' Z, '
			+ plCatCode[2][datArr[1][d[0]]] + ', '
			+ plCatCode[2][datArr[1][d[1]]] + ', '
			+ plCatCode[2][datArr[1][d[2]]] + ', depth ';
			
	strAc = strAc + rwy + ' RWYCC '
			+ rwySfCode[3][datArr[0][d[0]]] + '/'
			+ rwySfCode[3][datArr[0][d[1]]] + '/'
			+ rwySfCode[3][datArr[0][d[2]]] + ' ISSUED AT '
			+ tD + 'Z '
			+ plCatCode[3][datArr[1][d[0]]] + '/'
			+ plCatCode[3][datArr[1][d[1]]] + '/'
			+ plCatCode[3][datArr[1][d[2]]] + ' DPT ';
	
	// 松散污染物深度
	if (datArr[2][d[0]] === '-1') {
		strZh += '无报告、';
		strEn += 'not reported/';
		strAc += 'NR/';
	} else {
		strZh = strZh + datArr[2][d[0]] + '毫米、';
		strEn = strEn + datArr[2][d[0]] + ' milimeters/';
		strAc = strAc + datArr[2][d[0]] + 'MM/';
	}
	if (datArr[2][d[1]] === '-1') {
		strZh += '无报告、';
		strEn += 'not reported/';
		strAc += 'NR/';
	} else {
		strZh = strZh + datArr[2][d[1]] + '毫米、';
		strEn = strEn + datArr[2][d[1]] + ' milimeters/';
		strAc = strAc + datArr[2][d[1]] + 'MM/';
	}
	if (datArr[2][d[2]] === '-1') {
		strZh += '无报告，';
		strEn += 'not reported, ';
		strAc += 'NR ';
	} else {
		strZh = strZh + datArr[2][d[2]] + '毫米，';
		strEn = strEn + datArr[2][d[2]] + ' milimeters, ';
		strAc = strAc + datArr[2][d[2]] + 'MM ';
	}
	
	// 污染物覆盖百分比
	strZh = strZh
			+ plPctCode[1][datArr[3][d[0]]] + '、'
			+ plPctCode[1][datArr[3][d[1]]] + '、'
			+ plPctCode[1][datArr[3][d[2]]] + '。';
			
	strEn = strEn + 'coverage '
			+ plPctCode[2][datArr[3][d[0]]] + '/'
			+ plPctCode[2][datArr[3][d[1]]] + '/'
			+ plPctCode[2][datArr[3][d[2]]] + '.';
			
	strAc = strAc + 'COV '
			+ plPctCode[3][datArr[3][d[0]]] + '/'
			+ plPctCode[3][datArr[3][d[1]]] + '/'
			+ plPctCode[3][datArr[3][d[2]]];

	// 填入文本框
	document.querySelector('Textarea#taZh').value = strZh;
	document.querySelector('Textarea#taEn').value = strEn;
	document.querySelector('Textarea#taAcars').value = strAc;
}

// 生成按钮
const btnGenStr_js = document.querySelector('button#btnGenStr');
btnGenStr_js.addEventListener('click', genStr);

// 复制按钮
const btnCpZh = document.querySelector('button#btnZhCp');
const btnCpEn = document.querySelector('button#btnEnCp');
const btnCpAc = document.querySelector('button#btnAcCp');

// 禁用按钮状态
function disBtn() {
	arguments[0].setAttribute("disabled", "");
	arguments[0].innerHTML = '已复制（3）';
	// setTimeout(rstBtn, 3000, arguments[0]);
	setTimeout(() => {
		arguments[0].innerHTML = '已复制（2）';
	}, 1000, arguments[0]);
	setTimeout(() => {
		arguments[0].innerHTML = '已复制（1）';
	}, 2000, arguments[0]);
	setTimeout(() => {
		arguments[0].innerHTML = '复制';
		arguments[0].removeAttribute("disabled");
	}, 3000, arguments[0]);
}

// 按钮动作，复制到剪贴板。参数0 按钮，参数1 文本框。例：(btnCpZh, 'Textarea#taZh')
function copyTextarea() {
	let txt = document.querySelector(arguments[1]).value;
	navigator.clipboard.writeText(txt).then(disBtn(arguments[0]));
}

// 按钮动作，复制到剪贴板
function copyZh() {
	copyTextarea(btnCpZh, 'Textarea#taZh');
}
function copyEn() {
	copyTextarea(btnCpEn, 'Textarea#taEn');
}
function copyAcars() {
	copyTextarea(btnCpAc, 'Textarea#taAcars');
}

// 按钮，事件监听
btnCpZh.addEventListener('click', copyZh);
btnCpEn.addEventListener('click', copyEn);
btnCpAc.addEventListener('click', copyAcars);

// 清除文本
function clnStr() {
	document.querySelector('Textarea#taZh').value = '';
	document.querySelector('Textarea#taEn').value = '';
	document.querySelector('Textarea#taAcars').value = '';
}

// 文本，清除按钮
const btnClnStr_js = document.querySelector('button#btnClnStr');
btnClnStr_js.addEventListener('click', clnStr);

// 特殊天气
// 清除选项按钮
function spClnSel() {
	document.getElementById('spStartTime').value = '';
	document.getElementById('spEndTime').value = '';
	document.getElementById('spLvNone').checked = true;
	document.getElementById('spWs').checked = false;
	document.getElementById('spTb').checked = false;
	document.getElementById('spIc').checked = false;
	document.querySelector('Textarea#spTaZh').value = '';
	document.querySelector('Textarea#spTaEn').value = '';
	document.querySelector('Textarea#spTaAcars').value = '';
}

const spBtnClnSel_js = document.querySelector('button#spBtnClnSel');
spBtnClnSel_js.addEventListener('click', spClnSel);



// 组合字符串
function spGenStr() {
	// 检查数据。未选天气现象则退出
	let exFlg = 0;
	if (!document.querySelector("input#spStartTime").value) {
		document.querySelector("input#spStartTime").style.outlineStyle = 'solid';
		exFlg++;
	} else {
		document.querySelector("input#spStartTime").style.outlineStyle = '';
	}
	if (!document.querySelector("input#spEndTime").value) {
		document.querySelector("input#spEndTime").style.outlineStyle = 'solid';
		exFlg++;
	} else {
		document.querySelector("input#spEndTime").style.outlineStyle = '';
	}
	if (!document.querySelector("input#spWs").checked 
	&& !document.querySelector("input#spTb").checked 
	&& !document.querySelector("input#spIc").checked) {
		document.querySelector("div#spWeather").style.outlineStyle='solid';
		exFlg++;
	} else {
		document.querySelector("div#spWeather").style.outlineStyle='';
	}
	if (exFlg > 0) {
		return;
	}
	
	// 时间
	let startTime = document.querySelector("input#spStartTime").value.removeCharAt(3);
	let endTime = document.querySelector("input#spEndTime").value.removeCharAt(3);
	
	// 特殊天气格式
	// 新建字符串
	let strZh = '';
	let strEn = 'Between ';
	let strAc = 'BETWEEN ';
	
	// 程度
	strZh = strZh + startTime + ' 至 '
			+ endTime + ' UTC，本场可能出现'
			+ spWeatherLevel[1][document.querySelector("input[name=spLevel]:checked").value];
	strEn = strEn + startTime + ' and '
			+ endTime + ' UTC, '
			+ spWeatherLevel[2][document.querySelector("input[name=spLevel]:checked").value]
			;
	strAc = strAc + startTime + ' AND '
			+ endTime + ' UTC '
			+ spWeatherLevel[3][document.querySelector("input[name=spLevel]:checked").value]
			;
	
	// 天气现象
	if (document.querySelector("input#spWs").checked) {
		strZh = strZh + spWeatherCode[1][0];
		strEn = strEn + spWeatherCode[2][0];
		strAc = strAc + spWeatherCode[3][0];
	}
	if (document.querySelector("input#spTb").checked) {
		if (document.querySelector("input#spWs").checked) {
			strZh = strZh + '、';
			strEn = strEn + '/';
			strAc = strAc + '/';
		}
		strZh = strZh + spWeatherCode[1][1];
		strEn = strEn + spWeatherCode[2][1];
		strAc = strAc + spWeatherCode[3][1];
	}
	if (document.querySelector("input#spIc").checked) {
		if (document.querySelector("input#spWs").checked
		|| document.querySelector("input#spTb").checked) {
			strZh = strZh + '、';
			strEn = strEn + '/';
			strAc = strAc + '/';
		}
		strZh = strZh + spWeatherCode[1][2];
		strEn = strEn + spWeatherCode[2][2];
		strAc = strAc + spWeatherCode[3][2];
	}
	
	strZh = strZh + '。';
	strEn = strEn + ' may occur in local field.';
	strAc = strAc + ' MAY OCCUR IN LOCAL FIELD';
	
	// 填入文本框
	document.querySelector('Textarea#spTaZh').value = strZh;
	document.querySelector('Textarea#spTaEn').value = strEn;
	document.querySelector('Textarea#spTaAcars').value = strAc;
}

// 生成按钮
const spBtnGenStr_js = document.querySelector('button#spBtnGenStr');
spBtnGenStr_js.addEventListener('click', spGenStr);

// 复制按钮
const spBtnCpZh = document.querySelector('button#spBtnZhCp');
const spBtnCpEn = document.querySelector('button#spBtnEnCp');
const spBtnCpAc = document.querySelector('button#spBtnAcCp');

// 按钮动作，复制到剪贴板
function spCopyZh() {
	copyTextarea(spBtnCpZh, 'Textarea#spTaZh');
}
function spCopyEn() {
	copyTextarea(spBtnCpEn, 'Textarea#spTaEn');
}
function spCopyAcars() {
	copyTextarea(spBtnCpAc, 'Textarea#spTaAcars');
}

// 按钮，事件监听
spBtnCpZh.addEventListener('click', spCopyZh);
spBtnCpEn.addEventListener('click', spCopyEn);
spBtnCpAc.addEventListener('click', spCopyAcars);

// 清除文本
function spClnStr() {
	document.querySelector('Textarea#spTaZh').value = '';
	document.querySelector('Textarea#spTaEn').value = '';
	document.querySelector('Textarea#spTaAcars').value = '';
}

// 文本，清除按钮
const spBtnClnStr_js = document.querySelector('button#spBtnClnStr');
spBtnClnStr_js.addEventListener('click', spClnStr);