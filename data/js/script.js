let characterData = {
  name: "", pronouns: "", playerName: "",
  class: "", subclass: "", level: 1,
  ancestry: "", community: "",
  evasion: 10, armorScore: 0, armorSlotsMarked: 0,
  traits: {agility: 0, strength: 0, finesse: 0, instinct: 0, presence: 0, knowledge: 0},
  traitsMarked: {agility: false, strength: false, finesse: false, instinct: false, presence: false, knowledge: false},
  spellcastingTrait: "",
  damageThresholds: "",
  hp: 0, hpMarked: 0, stress: 0, stressMarked: 0,
  hope: 2,
  experiences: [{experience: "", bonus: 2}, {experience: "", bonus: 2}, {experience: "", bonus: 0}, {experience: "", bonus: 0}, {experience: "", bonus: 0}],
  proficiency: 1,
  activeWeaponPrimary: {name: "", burden: "", trait: "", range: "", damagedie: "", damagetype: "", feature: ""},
  activeWeaponSecondary: {name: "", trait: "", range: "", damagedie: "", damagetype: "", feature: ""},
  activeArmor: {name: "", baseThresholdMajor: 0, baseThresholdSevere: 0, baseScore: "", feature: ""},
  inventory: [],
  inventoryWeapon1: {name: "", category: "", trait: "", range: "", damagedie: "", damagetype: "", burden: "", feature: ""},
  inventoryWeapon2: {name: "", category: "", trait: "", range: "", damagedie: "", damagetype: "", burden: "", feature: ""},
  gold: {handful: 0, bag: 0, chest: 0},
  heritageFeatures: [], classFeatures: [], domainCards: [],
  detail: [], background: [], connection: [],
  levelupTier2: {trait: 0, hp: 0, stress: 0, experience: 0, domaincard: 0, evasion: 0},
  levelupTier3: {trait: 0, hp: 0, stress: 0, experience: 0, domaincard: 0, evasion: 0, upgrade: 0, proficiency: 0, multiclass: 0},
  levelupTier4: {trait: 0, hp: 0, stress: 0, experience: 0, domaincard: 0, evasion: 0, upgrade: 0, proficiency: 0, multiclass: 0},
  additionalStat: [
    {label: "", current: 0, max: 0},
    {label: "", current: 0, max: 0},
    {label: "", current: 0, max: 0},
    {label: "", current: 0, max: 0},
    {label: "", current: 0, max: 0}
  ],
  additionalChatPalette: []
};

// =========================
// JSON保存
// =========================

function ResetCharacterData() {
  if (!confirm("入力中のデータは失われます。キャラクターシートをリセットしてもよろしいですか？")) {
    return;
  }
}

// =========================
// JSON保存
// =========================

function saveCharacterData() {
  getCharacterData();

  const json = JSON.stringify(characterData, null, 2);
  const blob = new Blob([json], {type: "application/octet-stream"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${characterData.name}.dh`;
  console.log(link.download);
  link.click();

  URL.revokeObjectURL(url);
}

// =========================
// JSON読み込み
// =========================

function loadCharacterData(file) {
  if (!confirm("入力中のデータは失われます。ファイルを読み込んでもよろしいですか？")) {
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {
    const data = JSON.parse(reader.result);
    characterData = data;
    setCharacterData();
  };

  reader.readAsText(file);
}

// =========================
// サンプル読み込み
// =========================

async function loadPremadeData(file) {
  if (!confirm("入力中のデータは失われます。サンプルキャラクターを読み込んでもよろしいですか？")) {
    return;
  }

  const id = document.getElementById("select-premade").value;
  
  const response = await fetch("data/json/premade.json");
  const premadeData = await response.json();
  
  const data = premadeData.find(premade => premade.id === id);
  
  characterData = data;
  setCharacterData();
}

// =========================
// フォームからデータを取得
// =========================

function getCharacterData() {
  const data = characterData;

  data.name =
    document.getElementById("character-name").value;
  data.pronouns =
    document.getElementById("pronouns").value;
  data.playerName =
    document.getElementById("player-name").value;
  
  data.class =
    document.getElementById("class").value;
  data.subclass =
    document.getElementById("subclass").value;
  data.level =
    Number(document.getElementById("level").value);

  data.ancestry =
    document.getElementById("ancestry").value;
  data.community =
    document.getElementById("community").value;

  data.evasion =
    Number(document.getElementById("evasion").value);
  data.armorScore =
    Number(document.getElementById("armor").value);
  data.armorSlotsMarked =
    document.querySelectorAll('input[data-group="armor-slot"]:checked').length;

  const traitsName = ["agility", "strength", "finesse", "instinct", "presence", "knowledge"]
  traitsName.forEach(traitName => {
    data.traits[traitName] =
      Number(document.getElementById(`${traitName}`).value);
    data.traitsMarked[traitName] =
      Number(document.getElementById(`${traitName}-marked`).checked);
  });

  data.spellcastingTrait =
    document.getElementById("spellcasting-trait").value;

  data.damageThresholds.major =
    Number(document.getElementById("damage-threshold-major").value);
  data.damageThresholds.severe =
    Number(document.getElementById("damage-threshold-severe").value);

  data.hp =
    Number(document.getElementById("hp").value);
  data.hpMarked =
    document.querySelectorAll('input[data-group="hp-slot"]:checked').length;
  data.stress =
    Number(document.getElementById("stress").value);
  data.stressMarked =
    document.querySelectorAll('input[data-group="stress-slot"]:checked').length;

  data.hope =
    document.querySelectorAll('input[data-group="hope"]:checked').length;

  for (let i = 0; i < 5; i++) {
    data.experiences[i].experience =
      document.getElementById(`experience-${i + 1}`).value;
    data.experiences[i].bonus =
      Number(document.getElementById(`experience-${i + 1}-bonus`).value);
  }

  data.proficiency =
    Number(document.getElementById("proficiency").value);

  data.activeWeaponPrimary.name =
    document.getElementById("active-weapon-primary-name").value;
  data.activeWeaponPrimary.burden =
    document.getElementById("active-weapon-primary-burden").value;
  data.activeWeaponPrimary.trait =
    document.getElementById("active-weapon-primary-trait").value;
  data.activeWeaponPrimary.range =
    document.getElementById("active-weapon-primary-range").value;
  data.activeWeaponPrimary.damagedie =
    document.getElementById("active-weapon-primary-damagedie").value;
  data.activeWeaponPrimary.damagetype =
    document.getElementById("active-weapon-primary-damagetype").value;
  data.activeWeaponPrimary.feature =
    document.getElementById("active-weapon-primary-feature").value;

  data.activeWeaponSecondary.name =
    document.getElementById("active-weapon-secondary-name").value;
  data.activeWeaponSecondary.trait =
    document.getElementById("active-weapon-secondary-trait").value;
  data.activeWeaponSecondary.range =
    document.getElementById("active-weapon-secondary-range").value;
  data.activeWeaponSecondary.damagedie =
    document.getElementById("active-weapon-secondary-damagedie").value;
  data.activeWeaponSecondary.damagetype =
    document.getElementById("active-weapon-secondary-damagetype").value;
  data.activeWeaponSecondary.feature =
    document.getElementById("active-weapon-secondary-feature").value;

  data.activeArmor.name =
    document.getElementById("active-armor-name").value;
  data.activeArmor.baseThresholdMajor =
    document.getElementById("active-armor-thresholds").value;
  data.activeArmor.baseScore =
    Number(document.getElementById("active-armor-score").value);
  data.activeArmor.feature =
    document.getElementById("active-armor-feature").value;

  data.inventory =
    document.getElementById("inventory").value.split("\n");

  for (let i = 1; i < 3; i++) {
    const weapon = data[`inventoryWeapon${i}`]
    
    weapon.name =
      document.getElementById(`inventory-weapon-${i}-name`).value;
    weapon.category =
      document.getElementById(`inventory-weapon-${i}-category`).value;
    weapon.burden =
      document.getElementById(`inventory-weapon-${i}-burden`).value;
    weapon.trait =
      document.getElementById(`inventory-weapon-${i}-trait`).value;
    weapon.range =
      document.getElementById(`inventory-weapon-${i}-range`).value;
    weapon.damagedie =
      document.getElementById(`inventory-weapon-${i}-damagedie`).value;
    weapon.damagetype =
      document.getElementById(`inventory-weapon-${i}-damagetype`).value;
    weapon.feature =
      document.getElementById(`inventory-weapon-${i}-feature`).value;
  }

  data.gold.handful =
    document.getElementById("gold-handful").value === "" ? 0
    : document.getElementById("gold-handful").value;
  data.gold.bag =
    document.getElementById("gold-bag").value === "" ? 0
    : document.getElementById("gold-bag").value;
  data.gold.chest =
    document.getElementById("gold-chest").value === "" ? 0
    : document.getElementById("gold-chest").value;

  data.heritageFeatures =
    document.getElementById("heritage-features").value.split("\n");
  data.classFeatures =
    document.getElementById("class-features").value.split("\n");
  data.domainCards =
    document.getElementById("domain-cards").value.split("\n");
  data.detail =
    document.getElementById("detail").value.split("\n");
  data.background =
    document.getElementById("background").value.split("\n");
  data.connection =
    document.getElementById("connection").value.split("\n");

  for (let i = 2; i < 5; i++) {
    const tier = data[`levelupTier${i}`];

    tier.trait =
      document.querySelectorAll(`input[data-group="levelup-tier-${i}-trait"]:checked`).length;
    tier.hp =
      document.querySelectorAll(`input[data-group="levelup-tier-${i}-hp"]:checked`).length;
    tier.stress =
      document.querySelectorAll(`input[data-group="levelup-tier-${i}-stress"]:checked`).length;
    tier.experience =
      document.querySelectorAll(`input[data-group="levelup-tier-${i}-experience"]:checked`).length;
    tier.domaincard =
      document.querySelectorAll(`input[data-group="levelup-tier-${i}-domaincard"]:checked`).length;
    tier.evasion =
      document.querySelectorAll(`input[data-group="levelup-tier-${i}-evasion"]:checked`).length;

    if (i == 2) continue;

    tier.upgrade =
      document.querySelectorAll(`input[data-group="levelup-tier-${i}-upgrade"]:checked`).length;
    tier.proficiency =
      document.querySelectorAll(`input[data-group="levelup-tier-${i}-proficiency"]:checked`).length;
    tier.multiclass =
      document.querySelectorAll(`input[data-group="levelup-tier-${i}-multiclass"]:checked`).length;
  }

  for (let i = 1; i < 6; i++) {
    const additionalStat = data.additionalStat[i - 1];

    additionalStat.label =
      document.getElementById(`additional-stat-${i}`).value;
    additionalStat.current =
      document.getElementById(`additional-stat-${i}-current`).value;
    additionalStat.max =
      document.getElementById(`additional-stat-${i}-max`).value;
  }

  data.additionalChatPalette = document.getElementById(`additional-chat-palette`).value.split("\n");
}

// =========================
// データをフォームに反映
// =========================

function setCharacterData() {
  const data = characterData;

  document.getElementById("character-name").value =
    data.name;
  document.getElementById("pronouns").value =
    data.pronouns;
  document.getElementById("player-name").value =
    data.playerName;

  document.getElementById("class").value =
    data.class;
  document.getElementById("subclass").value =
    data.subclass;
  document.getElementById("level").value =
    data.level;

  document.getElementById("ancestry").value =
    data.ancestry;
  document.getElementById("community").value =
    data.community;

  document.getElementById("evasion").value =
    data.evasion;

  document.getElementById("armor").value =
    data.armorScore;
  setCheckedCount("armor-slot", data.armorSlotsMarked);
  updateCheckboxes("armor");

  const traitsName = ["agility", "strength", "finesse", "instinct", "presence", "knowledge"];
  traitsName.forEach(traitName => {
    document.getElementById(traitName).value =
      data.traits[traitName];
    document.getElementById(`${traitName}-marked`).checked =
      data.traitsMarked[traitName];
  });

  document.getElementById("spellcasting-trait").value =
    data.spellcastingTrait;

  document.getElementById("damage-threshold-major").value =
    data.damageThresholds.major;
  document.getElementById("damage-threshold-severe").value =
    data.damageThresholds.severe;

  document.getElementById("hp").value =
    data.hp;
  setCheckedCount("hp-slot", data.hpMarked);
  updateCheckboxes("hp");
  document.getElementById("stress").value =
    data.stress;
  setCheckedCount("stress-slot", data.stressMarked);
  updateCheckboxes("stress");

  setCheckedCount("hope", data.hope);

  for (let i = 0; i < data.experiences.length; i++) {
    document.getElementById(`experience-${i + 1}`).value =
      data.experiences[i].experience;
    document.getElementById(`experience-${i + 1}-bonus`).value =
      data.experiences[i].bonus === 0
        ? ""
        : data.experiences[i].bonus;
  }

  document.getElementById("proficiency").value =
    data.proficiency;

  document.getElementById("active-weapon-primary-name").value =
    data.activeWeaponPrimary.name;
  document.getElementById("active-weapon-primary-burden").value =
    data.activeWeaponPrimary.burden;
  document.getElementById("active-weapon-primary-trait").value =
    data.activeWeaponPrimary.trait;
  document.getElementById("active-weapon-primary-range").value =
    data.activeWeaponPrimary.range;
  document.getElementById("active-weapon-primary-damagedie").value =
    data.activeWeaponPrimary.damagedie;
  document.getElementById("active-weapon-primary-damagetype").value =
    data.activeWeaponPrimary.damagetype;
  document.getElementById("active-weapon-primary-feature").value =
    data.activeWeaponPrimary.feature;

  document.getElementById("active-weapon-secondary-name").value =
    data.activeWeaponSecondary.name;
  document.getElementById("active-weapon-secondary-trait").value =
    data.activeWeaponSecondary.trait;
  document.getElementById("active-weapon-secondary-range").value =
    data.activeWeaponSecondary.range;
  document.getElementById("active-weapon-secondary-damagedie").value =
    data.activeWeaponSecondary.damagedie;
  document.getElementById("active-weapon-secondary-damagetype").value =
    data.activeWeaponSecondary.damagetype;
  document.getElementById("active-weapon-secondary-feature").value =
    data.activeWeaponSecondary.feature;

  document.getElementById("active-armor-name").value =
    data.activeArmor.name;
  document.getElementById("active-armor-thresholds").value =
    data.activeArmor.baseThresholds;
  document.getElementById("active-armor-score").value =
    data.activeArmor.baseScore;
  document.getElementById("active-armor-feature").value =
    data.activeArmor.feature;

  document.getElementById("inventory").value =
    data.inventory.join("\n");

  for (let i = 1; i <= 2; i++) {
    const weapon = data[`inventoryWeapon${i}`];

    document.getElementById(`inventory-weapon-${i}-name`).value =
      weapon.name;
    document.getElementById(`inventory-weapon-${i}-burden`).value =
      weapon.burden;
    document.getElementById(`inventory-weapon-${i}-category`).value =
      weapon.caregory;
    document.getElementById(`inventory-weapon-${i}-trait`).value =
      weapon.trait;
    document.getElementById(`inventory-weapon-${i}-range`).value =
      weapon.range;
    document.getElementById(`inventory-weapon-${i}-damagedie`).value =
      weapon.damagedie;
    document.getElementById(`inventory-weapon-${i}-damagetype`).value =
      weapon.damagetype;
    document.getElementById(`inventory-weapon-${i}-feature`).value =
      weapon.feature;
  }

  document.getElementById("gold-handful").value =
    data.gold.handful === 0 ? "" : data.gold.handful;
  document.getElementById("gold-bag").value =
    data.gold.bag === 0 ? "" : data.gold.bag;
  document.getElementById("gold-chest").value =
    data.gold.chest === 0 ? "" : data.gold.chest;

  document.getElementById("heritage-features").value =
    data.heritageFeatures.join("\n");
  document.getElementById("class-features").value =
    data.classFeatures.join("\n");
  document.getElementById("domain-cards").value =
    data.domainCards.join("\n");
  document.getElementById("detail").value =
    data.detail.join("\n");
  document.getElementById("background").value =
    data.background.join("\n");
  document.getElementById("connection").value =
    data.connection.join("\n");

  for (let i = 2; i < 5; i++) {
    const tier = data[`levelupTier${i}`];

    setCheckedCount(`levelup-tier-${i}-trait`, tier.trait);
    setCheckedCount(`levelup-tier-${i}-hp`, tier.hp);
    setCheckedCount(`levelup-tier-${i}-stress`, tier.stress);
    setCheckedCount(`levelup-tier-${i}-experience`, tier.experience);
    setCheckedCount(`levelup-tier-${i}-domaincard`, tier.domaincard);
    setCheckedCount( `levelup-tier-${i}-evasion`, tier.evasion);

    if (i === 2) continue;

    setCheckedCount(`levelup-tier-${i}-upgrade`, tier.upgrade);
    setCheckedCount(`levelup-tier-${i}-proficiency`, tier.proficiency);
    setCheckedCount(`levelup-tier-${i}-multiclass`, tier.multiclass);
  }

  for (let i = 1; i < 6; i++) {
    const additionalStat = data.additionalStat[i - 1];

    document.getElementById(`additional-stat-${i}`).value =
      additionalStat.label;
    document.getElementById(`additional-stat-${i}-current`).value =
      additionalStat.current;
    document.getElementById(`additional-stat-${i}-max`).value =
      additionalStat.max;
  }

  document.getElementById("additional-chat-palette").value =
    data.additionalChatPalette.join("\n");
}

// =========================
// 指定された数だけチェックする
// =========================

function setCheckedCount(name, count) {
  
  const checkboxes =
    document.querySelectorAll(`input[data-group="${name}"]`);

  checkboxes.forEach((checkbox, index) => {
    checkbox.checked = index < count;
  });
}

// =========================
// 防具値、HP、ストレス入力時にスロット数を増減する
// =========================

function updateCheckboxes(id) {

  const count = Number(document.getElementById(`${id}`).value);
  const checkboxes =
    document.querySelectorAll(`input[data-group="${id}-slot"]`);

  checkboxes.forEach((checkbox, index) => {
    checkbox.disabled = index >= count;

    if (checkbox.disabled) {
      checkbox.checked = false;
    }
  });
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
