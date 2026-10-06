let characterData = {
  name: "", pronouns: "", playerName: "",
  class: "", subclass: "", level: 1,
  ancestry: "", community: "",
  evasion: 10, armorScore: 0, armorSlotsMarked: 0,
  traits: {agility: 0, strength: 0, finesse: 0, instinct: 0, presence: 0, knowledge: 0},
  traitsMarked: {agility: false, strength: false, finesse: false, instinct: false, presence: false, knowledge: false},
  spellcastingTrait: "",
  damageThresholdMajor: 0, damageThresholdSevere: 0,
  hp: 0, hpMarked: 0, stress: 0, stressMarked: 0,
  hope: 2,
  experiences: [{experience: "", bonus: 2}, {experience: "", bonus: 2}, {experience: "", bonus: 0}, {experience: "", bonus: 0}, {experience: "", bonus: 0}],
  features: [],
  proficiency: 1,
  activeWeaponPrimary: {name: "", trait: "", range: "", damagedie: "", damagetype: "", burden: "", feature: ""},
  activeWeaponSecondary: {name: "", trait: "", range: "", damagedie: "", damagetype: "", feature: ""},
  activeArmor: {name: "", baseThresholdMajor: 0, baseThresholdSevere: 0, baseScore: "", feature: ""},
  inventory: [],
  inventoryWeapon1: {category: "", name: "", trait: "", range: "", damagedie: "", damagetype: "", burden: "", feature: ""},
  inventoryWeapon2: {category: "", name: "", trait: "", range: "", damagedie: "", damagetype: "", burden: "", feature: ""},
  goldHandful: 0, goldBag: 0, goldChest: 0,
  notes: [],
  levelUpTier2: {trait: 0, hp: 0, stress: 0, experience: 0, domaincard: 0, evasion: 0},
  levelUpTier3: {trait: 0, hp: 0, stress: 0, experience: 0, domaincard: 0, evasion: 0, upgrade: 0, proficiency: 0, multiclass: 0},
  levelUpTier4: {trait: 0, hp: 0, stress: 0, experience: 0, domaincard: 0, evasion: 0, upgrade: 0, proficiency: 0, multiclass: 0},
};

// =========================
// JSON保存
// =========================

function saveCharacterData() {
  getCharacterData();

  const json = JSON.stringify(characterData, null, 2);
  const blob = new Blob([json], { type: "application/json"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${characterData.name}.json`;
  link.click();

  URL.revokeObjectURL(url);
}

// =========================
// JSON読み込み
// =========================

function loadCharacterData(file) {
  const reader = new FileReader();

  reader.onload = function () {
    const data = JSON.parse(reader.result);
    characterData = data;
    setCharacterData();
  };

  reader.readAsText(file);
}

// =========================
// フォームからデータを取得
// =========================

function getCharacterData() {
  const data = characterData

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

  data.damageThresholdMajor =
    Number(document.getElementById("damage-threshold-major").value);
  data.damageThresholdSevere =
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

  data.features =
    document.getElementById("features").value.split("\n");

  data.proficiency =
    Number(document.getElementById("proficiency").value);

  data.activeWeaponPrimary.name =
    document.getElementById("active-weapon-primary-name").value;
  data.activeWeaponPrimary.trait =
    document.getElementById("active-weapon-primary-trait").value;
  data.activeWeaponPrimary.range =
    document.getElementById("active-weapon-primary-range").value;
  data.activeWeaponPrimary.damagedie =
    document.getElementById("active-weapon-primary-damagedie").value;
  data.activeWeaponPrimary.damagetype =
    document.getElementById("active-weapon-primary-damagetype").value;
  data.activeWeaponPrimary.burden =
    document.querySelector(`input[name="active-weapon-primary-burden"]:checked`)?.value ?? "";
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
  data.activeWeaponSecondary.burden =
    document.querySelector(`input[name="active-weapon-secondary-burden"]:checked`)?.value ?? "";
  data.activeWeaponSecondary.feature =
    document.getElementById("active-weapon-secondary-feature").value;

  data.activeArmor.name =
    document.getElementById("active-armor-name").value;
  data.activeArmor.baseThresholdMajor =
    Number(document.getElementById("active-armor-threshold-major").value);
  data.activeArmor.baseThresholdSevere =
    Number(document.getElementById("active-armor-threshold-severe").value);
  data.activeArmor.baseScore =
    Number(document.getElementById("active-armor-score").value);
  data.activeArmor.feature =
    document.getElementById("active-armor-feature").value;

  data.inventory =
    document.getElementById("inventory").value.split("\n");

  for (let i = 1; i < 3; i++) {
    const weapon = data[`inventoryWeapon${i}`]
    
    weapon.category =
      document.querySelector(`input[name="inventory-weapon-${i}-category"]:checked`)?.value ?? "";
    weapon.name =
      document.getElementById(`inventory-weapon-${i}-name`).value;
    weapon.trait =
      document.getElementById(`inventory-weapon-${i}-trait`).value;
    weapon.range =
      document.getElementById(`inventory-weapon-${i}-range`).value;
    weapon.damagedie =
      document.getElementById(`inventory-weapon-${i}-damagedie`).value;
    weapon.damagetype =
      document.getElementById(`inventory-weapon-${i}-damagetype`).value;
    weapon.burden =
      document.querySelector(`input[name="inventory-weapon-${i}-burden"]:checked`)?.value ?? "";
    weapon.feature =
      document.getElementById(`inventory-weapon-${i}-feature`).value;
  }

  data.notes =
    document.getElementById("notes").value.split("\n");

  let tier;
  for (let i = 2; i < 5; i++) {
    tier = data[`levelUpTier${i}`];

    tier.trait =
      document.querySelectorAll(`input[data-group="level-up-tier-${i}-trait"]:checked`).length;
    tier.hp =
      document.querySelectorAll(`input[data-group="level-up-tier-${i}-hp"]:checked`).length;
    tier.stress =
      document.querySelectorAll(`input[data-group="level-up-tier-${i}-stress"]:checked`).length;
    tier.experience =
      document.querySelectorAll(`input[data-group="level-up-tier-${i}-experience"]:checked`).length;
    tier.domaincard =
      document.querySelectorAll(`input[data-group="level-up-tier-${i}-domaincard"]:checked`).length;
    tier.evasion =
      document.querySelectorAll(`input[data-group="level-up-tier-${i}-evasion"]:checked`).length;

    if (i == 2) continue;

    tier.upgrade =
      document.querySelectorAll(`input[data-group="level-up-tier-${i}-upgrade"]:checked`).length;
    tier.proficiency =
      document.querySelectorAll(`input[data-group="level-up-tier-${i}-proficiency"]:checked`).length;
    tier.multiclass =
      document.querySelectorAll(`input[data-group="level-up-tier-${i}-multiclass"]:checked`).length;
  }
}

// =========================
// characterData → JSON保存
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
    data.damageThresholdMajor;
  document.getElementById("damage-threshold-severe").value =
    data.damageThresholdSevere;

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

  document.getElementById("features").value =
    data.features.join("\n");

  document.getElementById("proficiency").value =
    data.proficiency;

  document.querySelector(`input[name="active-weapon-primary-burden"][value="${data.activeWeaponPrimary.burden}"]`).checked =
    true;
  
  document.getElementById("active-weapon-primary-name").value =
    data.activeWeaponPrimary.name;
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
  document.getElementById(
    "active-weapon-secondary-damagedie"
  ).value =
    data.activeWeaponSecondary.damagedie;
  document.getElementById(
    "active-weapon-secondary-damagetype"
  ).value =
    data.activeWeaponSecondary.damagetype;
  document.getElementById("active-weapon-secondary-feature").value =
    data.activeWeaponSecondary.feature;

  document.getElementById("active-armor-name").value =
    data.activeArmor.name;
  document.getElementById("active-armor-threshold-major").value =
    data.activeArmor.baseThresholdMajor;
  document.getElementById("active-armor-threshold-severe").value =
    data.activeArmor.baseThresholdSevere;
  document.getElementById("active-armor-score").value =
    data.activeArmor.baseScore;
  document.getElementById("active-armor-feature").value =
    data.activeArmor.feature;

  document.getElementById("inventory").value =
    data.inventory.join("\n");

  for (let i = 1; i <= 2; i++) {
    const weapon = data[`inventoryWeapon${i}`];

    document.querySelector(`input[name="inventory-weapon-${i}-category"][value="${weapon.category}"]`).checked = true;

    document.querySelector(`input[name="inventory-weapon-${i}-burden"][value="${weapon.burden}"]`).checked = true;

    document.getElementById(`inventory-weapon-${i}-name`).value =
      weapon.name;
    document.getElementById(`inventory-weapon-${i}-trait`).value =
      weapon.trait;
    document.getElementById(`inventory-weapon-${i}-range`).value =
      weapon.range;
    document.getElementById(`inventory-weapon-${i}-damagedie`).value =
      weapon.damagedie;
    document.getElementById(`inventory-weapon-${i}-damagetype`).value =
      weapon.damagetype;
    document.getElementById(`inventory-weapon-${i}-feature`).value =weapon.feature;
  }

  document.getElementById("gold-handful").value =
    data.goldHandful === 0
      ? ""
      : data.goldHandful;
  document.getElementById("gold-bag").value =
    data.goldBag === 0
      ? ""
      : data.goldBag;
  document.getElementById("gold-chest").value =
    data.goldChest === 0
      ? ""
      : data.goldChest;

  document.getElementById("notes").value =
    data.notes.join("\n");

  let tier;
  for (let i = 2; i < 5; i++) {
    tier = data[`levelUpTier${i}`];

    setCheckedCount(`level-up-tier-${i}-trait`, tier.trait);
    setCheckedCount(`level-up-tier-${i}-hp`, tier.hp);
    setCheckedCount(`level-up-tier-${i}-stress`, tier.stress);
    setCheckedCount(`level-up-tier-${i}-experience`, tier.experience);
    setCheckedCount(`level-up-tier-${i}-domaincard`, tier.domaincard);
    setCheckedCount( `level-up-tier-${i}-evasion`, tier.evasion);

    if (i === 2) continue;

    setCheckedCount(`level-up-tier-${i}-upgrade`, tier.upgrade);
    setCheckedCount(`level-up-tier-${i}-proficiency`, tier.proficiency);
    setCheckedCount(`level-up-tier-${i}-multiclass`, tier.multiclass);
  }
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
