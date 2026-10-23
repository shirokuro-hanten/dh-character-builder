const defaultAdversaryData = {
  name: "", tier: "", type: "", hpPerNum: "",
  description: "", motivesAndTactics: "",
  difficulty: 0, damageThresholds: "", hp: "", stress: "",
  attackModifier: "",
  standardAttack: {
    name: "",
    range: "",
    damagedice: "",
    damagetype: ""
  },
  experiences: [
    {name: "", modifier: 0},
    {name: "", modifier: 0},
    {name: "", modifier: 0},
    {name: "", modifier: 0},
  ],
  features: [
    {name: "", type: "", description: ""},
    {name: "", type: "", description: ""},
    {name: "", type: "", description: ""},
    {name: "", type: "", description: ""},
    {name: "", type: "", description: ""},
    {name: "", type: "", description: ""},
    {name: "", type: "", description: ""},
    {name: "", type: "", description: ""}
  ],
  number: 1,
  additionalStat: [
    {label: "", max: 0},
    {label: "", max: 0},
    {label: "", max: 0},
    {label: "", max: 0},
    {label: "", max: 0}
  ],
  additionalChatPalette: []
};

let adversaryData = defaultAdversaryData;

// =========================
// ページ初期化
// =========================

document.addEventListener("DOMContentLoaded", async () => {
  document
    .getElementById("new-adversary")
    .addEventListener("click", resetAdversaryData);

  document
    .getElementById("save-adversary")
    .addEventListener("click", saveAdversaryData);

  document
    .getElementById("load-adversary")
    .addEventListener("change", function () {
      const file = this.files[0];
      if (!file) return;

      loadAdversaryData(file);
      this.value = "";
    });

  document
    .getElementById("load-srd")
    .addEventListener("click", loadSrdData);
  await loadSrdAdversaries();
  document
    .getElementById("select-adversary-tier")
    .addEventListener("change", updateAdversaryOptions);

  document
    .getElementById("type")
    .addEventListener("change", changeType);

  document
    .getElementById("export-ccfolia")
    .addEventListener("click", copyToCcf);
  document
    .getElementById("export-udonarium")
    .addEventListener("click", exportToUdonarium);
});

// =========================
// 新規作成
// =========================

function resetAdversaryData() {
  if (!confirm("入力中のデータは失われます。キャラクターシートをリセットしてもよろしいですか？")) {
    return;
  }

  adversaryData = defaultAdversaryData;
  setAdversaryData();
}

// =========================
// JSON保存
// =========================

function saveAdversaryData() {
  getAdversaryData();

  const json = JSON.stringify(adversaryData, null, 2);
  const blob = new Blob([json], {type: "application/octet-stream"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${adversaryData.name}.adversary`;
  console.log(link.download);
  link.click();

  URL.revokeObjectURL(url);
}

// =========================
// JSON読み込み
// =========================

function loadAdversaryData(file) {
  if (!confirm("入力中のデータは失われます。ファイルを読み込んでもよろしいですか？")) {
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {
    const data = JSON.parse(reader.result);
    adversaryData = data;
    setAdversaryData();
  };

  reader.readAsText(file);
}

// =========================
// SRD読み込み
// =========================

// SRDデータを読み込む
let srdAdversaryData = [];
async function loadSrdAdversaries() {
  try {
    const response = await fetch("data/json/adversaries.json");
    srdAdversaryData = await response.json();
  } catch (error) {
    console.error(error);
    alert("SRDデータを読み込めませんでした。");
  }
}

// ティア変更時に敵キャラクターの選択肢を更新
function updateAdversaryOptions() {
  const tierSelect = document.getElementById("select-adversary-tier");
  const adversarySelect = document.getElementById("select-adversary");
  const selectedTier = tierSelect.value;

  // 選択肢を初期化
  adversarySelect.replaceChildren();

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "------敵キャラクターを選択------";
  placeholder.disabled = true;
  placeholder.selected = true;

  adversarySelect.appendChild(placeholder);

  // 選択されたティアのデータを取得
  const tierKey = `tier-${selectedTier}`;
  const adversaries = srdAdversaryData[tierKey] ?? [];

  // 選択肢を作成
  adversaries.forEach(adversary => {
    const option = document.createElement("option");

    option.value = adversary.id;
    option.textContent = adversary.name;

    adversarySelect.appendChild(option);
  });
}

// SRDデータの読み込み
function loadSrdData() {
  if (!confirm("入力中のデータが失われます。SRDの敵キャラクターを読み込んでもよろしいですか？")) {
    return;
  }

  const tierKey =
    document.getElementById("select-adversary-tier").value;
  const id = document.getElementById(`select-adversary`).value;
  if (id === "") return;

  const data = srdAdversaryData[`tier-${tierKey}`].find(adversary => adversary.id === id);
  const { id: _, ...newData } = data;
  adversaryData = newData;

  while (adversaryData.experiences.length < 4) {
    adversaryData.experiences.push({
      name: "",
      modifier: null
    });
  }

  while (adversaryData.features.length < 8) {
    adversaryData.features.push({
      name: "",
      type: "",
      description: ""
    });
  }

  adversaryData.number = 1;
  adversaryData.additionalStat = [
    {label: "", max: 0},
    {label: "", max: 0},
    {label: "", max: 0},
    {label: "", max: 0},
    {label: "", max: 0}
  ];
  adversaryData.additionalChatPalette = [];

  setAdversaryData();
}

// =========================
// フォームからデータを取得
// =========================

function getAdversaryData() {
  const data = adversaryData;

  data.name =
    document.getElementById("name").value;
  data.tier =
    document.getElementById("tier").value;
  data.type =
    document.getElementById("type").value;
  data.hpPerNum =
    document.getElementById("hp-per-num").value;
  
  data.description =
    document.getElementById("description").value;
  data.motivesAndTactics =
    document.getElementById("motives-and-tactics").value;

  data.difficulty =
    Number(document.getElementById("difficulty").value);
  data.damageThresholds =
    document.getElementById("damage-thresholds").value;
  data.hp =
    Number(document.getElementById("hp").value);
  data.stress =
    Number(document.getElementById("stress").value);

  data.attackModifier =
    document.getElementById("attack-modifier").value;
  data.standardAttack.name =
    document.getElementById("standard-attack").value;
  data.standardAttack.range =
    document.getElementById("standard-attack-range").value;
  data.standardAttack.damagedice =
    document.getElementById("standard-attack-damagedice").value;
  data.standardAttack.damagetype =
    document.getElementById("standard-attack-damagetype").value;

  for (let i = 1; i <= 4; i++) {
    data.experiences[i - 1] = {
      name: document.getElementById(`experiences-${i}`).value,
      modifier: document.getElementById(`experiences-${i}-modifier`).value
    };
  }

  for (let i = 1; i <= 8; i++) {
    data.features[i - 1] = {
      name: document.getElementById(`feature-${i}`).value,
      type: document.getElementById(`feature-${i}-type`).value,
      description: document.getElementById(`feature-${i}-description`).value
    };
  }

  data.number =
    Number(document.getElementById("number").value);

  for (let i = 1; i < 6; i++) {
    data.additionalStat[i - 1] = {
      label: document.getElementById(`additional-stat-${i}`).value,
      max: document.getElementById(`additional-stat-${i}-max`).value
    }
  }

  data.additionalChatPalette = document.getElementById(`additional-chat-palette`).value.split("\n");
}

// =========================
// データをフォームに反映
// =========================

function setAdversaryData() {
  const data = adversaryData;

  document.getElementById("name").value =
    data.name;
  document.getElementById("tier").value =
    data.tier;
  document.getElementById("type").value =
    data.type;
  document.getElementById("hp-per-num").value =
    data.hpPerNum;

  document.getElementById("description").value =
    data.description;
  document.getElementById("motives-and-tactics").value =
    data.motivesAndTactics;

  document.getElementById("difficulty").value =
    data.difficulty;
  document.getElementById("damage-thresholds").value =
    data.damageThresholds;
  document.getElementById("hp").value =
    data.hp;
  document.getElementById("stress").value =
    data.stress;

  document.getElementById("attack-modifier").value =
    data.attackModifier;
  document.getElementById("standard-attack").value =
    data.standardAttack.name;
  document.getElementById("standard-attack-range").value =
    data.standardAttack.range;
  document.getElementById("standard-attack-damagedice").value =
    data.standardAttack.damagedice;
  document.getElementById("standard-attack-damagetype").value =
    data.standardAttack.damagetype;

  for (let i = 1; i <= 4; i++) {
    document.getElementById(`experiences-${i}`).value =
      data.experiences[i - 1].name;
    document.getElementById(`experiences-${i}-modifier`).value =
      data.experiences[i - 1].modifier;
  }

  for (let i = 1; i <= 8; i++) {
    document.getElementById(`feature-${i}`).value =
      data.features[i - 1].name;
    document.getElementById(`feature-${i}-type`).value =
      data.features[i - 1].type;
    document.getElementById(`feature-${i}-description`).value =
      data.features[i - 1].description;
  }

  document.getElementById("number").value =
    data.number;

  for (let i = 1; i < 6; i++) {
    document.getElementById(`additional-stat-${i}`).value =
      data.additionalStat[i - 1].label;
    document.getElementById(`additional-stat-${i}-max`).value =
      data.additionalStat[i - 1].max;
  }

  document.getElementById("additional-chat-palette").value =
    data.additionalChatPalette.join("\n");
}

function changeType(input) {
  const type = document.getElementById("type").value

  document.getElementById("show-hp-per-num").hidden = true;
  if (type === "大群") {
    document.getElementById("show-hp-per-num").hidden = false;
  }
}

// =========================
// 範囲外の値が入力された時に値を丸める
// =========================

function clampInput(input) {
  if (input.value === "") return;

  let value = Number(input.value);
  if (input.min !== "" && value < Number(input.min)) {
    value = Number(input.min);
  }
  if (input.max !== "" && value > Number(input.max)) {
    value = Number(input.max);
  }

  input.value = value;
}

// =========================
// ココフォリア用駒生成→クリップボードにコピー
// =========================

function copyToCcf() {
  getAdversaryData();
  const data = adversaryData;
  
  let memo_arr = [];
  let status_arr = [];
  let params_arr = [];

  // メモ
  memo_arr.push(`【ティア】${data.tier}｜【分類】${data.type}
    ${data.type === "大群" ? `（${data.hpPerNum}／HP）` : ""}`);
  if (data.description) {
    memo_arr.push(data.description);
  }
  if (data.motivesAndTactics) {
    memo_arr.push(`【動機と戦術】${data.motivesAndTactics}`);
  }
  memo_arr.push(`【難易度】${data.difficulty}｜【ダメージ閾値】${data.damageThresholds}`);

  // ステータス
  if (data.number === 1) {
    status_arr = getStatsCcf(data, "");
  } else {
    for (let i = 1; i <= data.number; i++) {
      const numStr = `#${i}`;
      status_arr.push(...getStatsCcf(data, numStr));
    }
  }

  const ccfData = {
    kind: "character",
    data: {
      name: data.name,
      memo: memo_arr.join("\n"),
      status: status_arr,
      params: "",
      commands: chatPalette(data),
      active: true,
      secret: true,
      invisible: false,
      hideStatus: false,
      color: "#ffffff"
    }
  };

  const json = JSON.stringify(ccfData);

  navigator.clipboard.writeText(json)
    .then(() => {
      alert("ココフォリア用キャラクターデータをクリップボードにコピーしました。\nココフォリアのルームにペーストしてください。");
    })
    .catch(error => {
      console.error(error);
      alert("クリップボードへのコピーに失敗しました。");
    });
}

function getStatsCcf(data, numStr) {
  let arr = [];

  arr.push({label: `HP${numStr}`, value: data.hp, max: data.hp});
  arr.push({label: `ｽﾄﾚｽ${numStr}`, value: data.stress, max: data.stress});

  for (let i = 0; i < 5; i++) {
    const stat = data.additionalStat[i];
    if (stat.label === "") continue;

    arr.push({label: `${stat.label}${numStr}`, value: stat.max, max: stat.max});
  }

  return arr;
}

function exportToUdonarium() {
  getAdversaryData();
  const data = adversaryData;

  const xml = `
<?xml version="1.0" encoding="UTF-8"?>
<character rotate="0" roll="0">
  <data name="character">
    <data name="image"></data>
    <data name="common">
      <data name="name">${escapeXml(data.name)}</data>
      <data name="size">1</data>
    </data>
    <data name="detail">
      <data name="情報">
        <data type="note" name="ティア">${escapeXml(data.tier)}</data>
        <data type="note" name="分類">${escapeXml(data.type)}</data>
        <data type="note" name="クラス">${escapeXml(data.hpPerNum)}</data>
        <data type="note" name="説明">${escapeXml(data.description)}</data>
        <data type="number" name="動機と戦術">${data.motivesAndTactics}</data>
        <data type="note" name="難易度">${escapeXml(data.difficulty)}</data>
        <data type="note" name="ダメージ閾値">${escapeXml(data.damageThresholds)}</data>
      </data>
      <data name="ステータス">
        ${getStatsXml(data)}
      </data>
    </data>
  </data>
  <chat-palette dicebot="">${escapeXml(chatPalette(data))}</chat-palette>
</character>
`.trim();

  const blob = new Blob([xml],{type: "application/xml"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${data.name || "adversary"}.xml`;
  link.click();
  URL.revokeObjectURL(url);
}

function getStatsXml(data) {
  let xml = "";
  let numStr = "";

  if (data.number > 1) {
    for (let i = 1; i <= data.number; i++) {
      xml += statsXml(data, `#${i}`);
    }
  } else {
    xml = statsXml(data, "");
  }

  return xml;
}

function statsXml(data, numStr) {
  let xml = "";

  xml += `<data type="numberResource" currentValue="${data.hp}" name="HP${numStr}">${data.hp}</data>`;
  xml += `<data type="numberResource" currentValue="${data.stress}" name="ストレス${numStr}">${data.stress}</data>`;

  for (let i = 0; i < 5; i++) {
    const stat = data.additionalStat[i];
    if (stat.label === "") continue;

    xml += `
      <data type="numberResource" currentValue="${stat.max}" name="${escapeXml(stat.label)}${numStr}">${stat.max}</data>`;
  }

  return xml;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function chatPalette(data) {
  let chatPalette_arr = [];

  chatPalette_arr.push("------行動ロール------");
  chatPalette_arr.push("1d20 行動ロール");

  data.experiences.forEach(({ name, modifier }) => {
    if (name === "") return;
    chatPalette_arr.push(`1d20${getModifier(modifier)} 行動ロール【${name}】`);
  });

  chatPalette_arr.push("------攻撃------");
  chatPalette_arr.push(`1d20${getModifier(data.attackModifier)} 攻撃ロール`);
  chatPalette_arr.push(`1d20${getModifier(data.attackModifier)} 【${data.standardAttack.name}】攻撃ロール（射程：${data.standardAttack.range}）`);
  chatPalette_arr.push(`${data.standardAttack.damagedice} 【${data.standardAttack.name}】ダメージロール（${data.standardAttack.damagetype}）`);

  if (data.additionalChatPalette.some(line => line !== "")) {
    chatPalette_arr.push("---------------");
    chatPalette_arr.push(...data.additionalChatPalette);
  }

  chatPalette_arr.push("======特徴======");
  data.features.forEach(({ name, type, description }) => {
    if (name === "") return;
    chatPalette_arr.push(`------${name} — ${type}------`);
    chatPalette_arr.push(description);
  });

  const chatPalette = chatPalette_arr.join("\n");
  return chatPalette;
}

function getModifier(value) {
  return value < 0 ? `${value}` : `+${value}`;
}