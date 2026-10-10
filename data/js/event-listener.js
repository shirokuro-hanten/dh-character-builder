// =========================
// イベント設定
// =========================

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("new-character")
    .addEventListener("click", ResetCharacterData);

  document
    .getElementById("save-character")
    .addEventListener("click", saveCharacterData);

  document.getElementById("load-character").addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;
    loadCharacterData(file);
    this.value = "";
  });

  document
    .getElementById("save-character")
    .addEventListener("click", saveCharacterData);

  document.getElementById("load-character").addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;
    loadCharacterData(file);
    this.value = "";
  });

  document
    .getElementById("load-premade")
    .addEventListener("click", loadPremadeData);

  document
    .getElementById("export-ccfolia")
    .addEventListener("click", copyToCcf);
  document
    .getElementById("export-udonarium")
    .addEventListener("click", exportToUdonarium);

  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener("blur", () => {
      clampInput(input);
    });
  });

  document.getElementById("armor")
    .addEventListener("input", () => updateCheckboxes("armor"));
  document.getElementById("hp")
    .addEventListener("input", () => updateCheckboxes("hp"));
  document.getElementById("stress")
    .addEventListener("input", () => updateCheckboxes("stress"));
});