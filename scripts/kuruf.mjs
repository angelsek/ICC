import { KurufRaceCreatorApp } from "./apps/race-creator.mjs";

export const MODULE_ID = "kuruf";

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Inicializando módulo`);
  game.kuruf = {
    apps: { RaceCreatorApp: KurufRaceCreatorApp }
  };
});

Hooks.once("ready", () => {
  if (game.system.id !== "dnd5e") {
    ui.notifications.warn(game.i18n.localize("KURUF.SystemWarning"));
  }
});

/**
 * Adds a "Create Race" button to the Items sidebar directory footer.
 * Handles both jQuery (v12) and raw HTMLElement (v13) render arguments.
 */
Hooks.on("renderItemDirectory", (_app, html) => {
  const root = html instanceof HTMLElement ? html : html[0];
  const footer = root.querySelector(".directory-footer") ?? root.querySelector(".directory-header");
  if (!footer || footer.querySelector(".kuruf-create-race")) return;

  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("kuruf-create-race");
  button.innerHTML = `<i class="fa-solid fa-dna"></i> ${game.i18n.localize("KURUF.RaceCreator.ButtonLabel")}`;
  button.addEventListener("click", () => new KurufRaceCreatorApp().render(true));
  footer.appendChild(button);
});
