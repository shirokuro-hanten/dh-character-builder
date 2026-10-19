const traitsName = {agility: "敏捷", strength: "筋力", finesse: "技巧", instinct: "直観", presence: "存在", knowledge: "知識"};

// =========================
// ココフォリア用駒生成→クリップボードにコピー
// =========================

function copyToCcf() {
  getCharacterData();
  const data = characterData;
  
  let memo_arr = [];
  let status_arr = [];
  let params_arr = [];

  // メモ
  memo_arr.push(`【代名詞】${data.pronouns}｜【プレイヤー名】${data.playerName}`);
  memo_arr.push(`【クラス】${data.class}｜【サブクラス】${data.subclass}｜【レベル】${data.level}`);
  memo_arr.push(`【血統】${data.ancestry}｜【共同体】${data.community}`);
  memo_arr.push(`【回避】${data.evasion}｜【ダメージ閾値】${data.damageThresholds.major}／${data.damageThresholds.severe}`);
  memo_arr.push(`【所持品】\n${data.inventory.join("\n")}`);

  // ステータス
  status_arr.push({label: "HP", value: data.hp - data.hpMarked, max: data.hp});
  status_arr.push({label: "ストレス", value: data.stress - data.stressMarked, max: data.stress});
  status_arr.push({label: "希望", value: data.hope, max: 6});
  status_arr.push({label: "防具スロット", value: data.armorScore - data.armorSlotsMarked, max: data.armorScore});
  for (let i = 0; i < 5; i++) {
    const additionalStat = data.additionalStat[i];
    if (additionalStat.label === "") {continue;}
    status_arr.push({label: additionalStat.label, value: additionalStat.current, max: additionalStat.max});
  }

  // パラメータ
  Object.entries(traitsName).forEach(([traitName, traitLabel]) => {
    params_arr.push({label: traitLabel, value: String(data.traits[traitName])});
  });
  params_arr.push({label: "習熟", value: String(data.proficiency)});

  const ccfData = {
    kind: "character",
    data: {
      name: data.name,
      memo: memo_arr.join("\n"),
      status: status_arr,
      params: params_arr,
      commands: chatPalette(data),
      active: true,
      secret: false,
      invisible: false,
      hideStatus: false,
      color: "#ffffff",
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

function exportToUdonarium() {
  getCharacterData();
  const data = characterData;

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
        <data type="note" name="代名詞">${escapeXml(data.pronouns)}</data>
        <data type="note" name="プレイヤー名">${escapeXml(data.playerName)}</data>
        <data type="note" name="クラス">${escapeXml(data.class)}</data>
        <data type="note" name="サブクラス">${escapeXml(data.subclass)}</data>
        <data type="number" name="レベル">${data.level}</data>
        <data type="note" name="血統">${escapeXml(data.ancestry)}</data>
        <data type="note" name="共同体">${escapeXml(data.community)}</data>
      </data>
      <data name="ステータス">
        <data type="numberResource" currentValue="${data.hp - data.hpMarked}" name="HP">${data.hp}</data>
        <data type="numberResource" currentValue="${data.stress - data.stressMarked}" name="ストレス">${data.stress}</data>
        <data type="numberResource" currentValue="${data.hope}" name="希望">6</data>
        <data type="numberResource" currentValue="${data.armorScore - data.armorSlotsMarked}" name="防具スロット">${data.armorScore}</data>
        <data name="回避">${data.evasion}</data>
        <data type="number" name="ダメージ閾値">${data.damageThresholds.major}／${data.damageThresholds.severe}</data>
        <data name="習熟">${data.proficiency}</data>
        ${additionalStatsXml(data)}
      </data>
      <data name="特性">
        <data name="敏捷">${data.traits.agility}</data>
        <data name="筋力">${data.traits.strength}</data>
        <data name="技巧">${data.traits.finesse}</data>
        <data name="直感">${data.traits.instinct}</data>
        <data name="存在">${data.traits.presence}</data>
        <data name="知識">${data.traits.knowledge}</data>
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
  link.download = `${data.name || "character"}.xml`;
  link.click();
  URL.revokeObjectURL(url);
}

function additionalStatsXml(data) {
  let xml = "";

  for (let i = 0; i < 5; i++) {
    const stat = data.additionalStat[i];
    if (stat.label === "") continue;

    xml += `
        <data type="numberResource" currentValue="${stat.current}" name="${escapeXml(stat.label)}">${stat.max}</data>`;
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
  Object.entries(traitsName).forEach(([traitName, traitLabel]) => {
    chatPalette_arr.push(`2d12${getModifier(data.traits[traitName])} 【${traitLabel}】行動ロール`);
  });
  chatPalette_arr.push("------反応ロール------");
  Object.entries(traitsName).forEach(([traitName, traitLabel]) => {
    chatPalette_arr.push(`2d12${getModifier(data.traits[traitName])} 【${traitLabel}】反応ロール`);
  });
  if (data.spellcastingTrait != "") {
    chatPalette_arr.push(`------呪文発動------`);
    chatPalette_arr.push(`2d12${getModifier(data.traits[data.spellcastingTrait])} 呪文発動ロール【${traitsName[data.spellcastingTrait]}】`);
  };
  chatPalette_arr.push("------武器------");
  chatPalette_arr.push(`---メイン武器〈${data.activeWeaponPrimary.name}〉：${data.activeWeaponPrimary.range}、${data.activeWeaponPrimary.burden}、${traitsName[data.activeWeaponPrimary.trait]}`);
  chatPalette_arr.push(`2d12${getModifier(data.traits[data.activeWeaponPrimary.trait])} 〈${data.activeWeaponPrimary.name}〉攻撃ロール`);
  chatPalette_arr.push(`${data.proficiency}${data.activeWeaponPrimary.damagedie} 〈${data.activeWeaponPrimary.name}〉ダメージロール（${data.activeWeaponPrimary.damagetype}）`);
  if (data.activeWeaponSecondary.name != "") {
    chatPalette_arr.push(`---サブ武器〈${data.activeWeaponSecondary.name}〉：${data.activeWeaponSecondary.range}、${traitsName[data.activeWeaponSecondary.trait]}`);
    chatPalette_arr.push(`2d12${getModifier(data.traits[data.activeWeaponSecondary.trait])} 〈${data.activeWeaponSecondary.name}〉攻撃ロール`);
    chatPalette_arr.push(`${data.proficiency}${data.activeWeaponSecondary.damagedie} 〈${data.activeWeaponSecondary.name}〉ダメージロール（${data.activeWeaponSecondary.damagetype}）`);
  }
  if (data.inventoryWeapon1.name != "") {
    chatPalette_arr.push(`---所持武器〈${data.inventoryWeapon1.name}〉：${data.inventoryWeapon1.category}、${data.inventoryWeapon1.range}、${data.inventoryWeapon1.burden}、${traitsName[data.inventoryWeapon1.trait]}`);
    chatPalette_arr.push(`2d12${getModifier(data.traits[data.inventoryWeapon1.trait])} 〈${data.inventoryWeapon1.name}〉攻撃ロール`);
    chatPalette_arr.push(`${data.proficiency}${data.inventoryWeapon1.damagedie} 〈${data.inventoryWeapon1.name}〉ダメージロール（${data.inventoryWeapon1.damagetype}）`);
  }
  if (data.inventoryWeapon2.name != "") {
    chatPalette_arr.push(`---所持武器〈${data.inventoryWeapon2.name}〉：${data.inventoryWeapon2.category}、${data.inventoryWeapon2.range}、${data.inventoryWeapon2.burden}、${traitsName[data.inventoryWeapon2.trait]}`);
    chatPalette_arr.push(`2d12${getModifier(data.traits[data.inventoryWeapon2.trait])} 〈${data.inventoryWeapon2.name}〉攻撃ロール`);
    chatPalette_arr.push(`${data.proficiency}${data.inventoryWeapon2.damagedie} 〈${data.inventoryWeapon2.name}〉ダメージロール（${data.inventoryWeapon2.damagetype}）`);
  }
  if (data.additionalChatPalette.length > 0) {
    chatPalette_arr.push("---------------");
    chatPalette_arr.push(...data.additionalChatPalette);
  }

  const chatPalette = chatPalette_arr.join("\n");
  return chatPalette;
}

function getModifier(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}