import { MODULE_ID } from "../kuruf.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const DEFAULT_IMG = "icons/svg/mystery-man.svg";

/**
 * Form application to create a custom D&D 5e "race" Item: base traits (size,
 * type, movement, senses) plus a freeform list of racial traits appended to
 * the description. Ability score improvements, exact language grants, and
 * other advancement-driven choices are left to the item's native
 * "Advancement" tab, which dnd5e already provides on every race item.
 */
export class KurufRaceCreatorApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(options = {}) {
    super(options);
    this.actor = options.actor ?? null;
    this.img = DEFAULT_IMG;
    this.traits = [];
  }

  static DEFAULT_OPTIONS = {
    id: "kuruf-race-creator",
    tag: "form",
    window: {
      title: "KURUF.RaceCreator.Title",
      icon: "fa-solid fa-dna",
      contentClasses: ["kuruf", "kuruf-race-creator"]
    },
    position: { width: 640, height: "auto" },
    form: {
      handler: KurufRaceCreatorApp.#onSubmitForm,
      submitOnChange: false,
      closeOnSubmit: true
    },
    actions: {
      addTrait: KurufRaceCreatorApp.#onAddTrait,
      removeTrait: KurufRaceCreatorApp.#onRemoveTrait,
      editImage: KurufRaceCreatorApp.#onEditImage
    }
  };

  static PARTS = {
    form: { template: `modules/${MODULE_ID}/templates/race-creator.hbs` }
  };

  /** @override */
  async _prepareContext(_options) {
    const dnd5e = CONFIG.DND5E ?? {};
    return {
      img: this.img,
      sizes: dnd5e.actorSizes ?? {},
      creatureTypes: dnd5e.creatureTypes ?? {},
      movementUnits: dnd5e.movementUnits ?? { ft: "ft" },
      traits: this.traits
    };
  }

  /** @override */
  _onRender(context, options) {
    super._onRender?.(context, options);
    this.element.querySelectorAll("[data-trait-index]").forEach(row => {
      const index = Number(row.dataset.traitIndex);
      row.querySelectorAll("[data-field]").forEach(field => {
        field.addEventListener("change", event => {
          if (this.traits[index]) this.traits[index][event.target.dataset.field] = event.target.value;
        });
      });
    });
  }

  static #onAddTrait() {
    this.traits.push({ name: "", description: "" });
    this.render();
  }

  static #onRemoveTrait(_event, target) {
    const index = Number(target.dataset.index);
    this.traits.splice(index, 1);
    this.render();
  }

  static async #onEditImage() {
    const picker = new FilePicker({
      type: "image",
      current: this.img,
      callback: path => {
        this.img = path;
        this.render();
      }
    });
    picker.browse();
  }

  static async #onSubmitForm(_event, _form, formData) {
    const data = foundry.utils.expandObject(formData.object);
    const name = data.name?.trim();

    if (!name) {
      ui.notifications.warn(game.i18n.localize("KURUF.RaceCreator.NameRequired"));
      return;
    }

    const traitsHtml = this.traits
      .filter(trait => trait.name?.trim())
      .map(trait => `<h3>${trait.name}</h3><p>${trait.description ?? ""}</p>`)
      .join("");

    const description = [data.description ?? "", traitsHtml].filter(Boolean).join("");

    const itemData = {
      name,
      type: "race",
      img: this.img || DEFAULT_IMG,
      system: {
        description: { value: description },
        movement: {
          walk: Number(data.movement?.walk) || 30,
          fly: Number(data.movement?.fly) || 0,
          swim: Number(data.movement?.swim) || 0,
          climb: Number(data.movement?.climb) || 0,
          burrow: Number(data.movement?.burrow) || 0,
          units: data.movement?.units || "ft",
          hover: Boolean(data.movement?.hover)
        },
        senses: {
          darkvision: Number(data.senses?.darkvision) || 0,
          blindsight: Number(data.senses?.blindsight) || 0,
          tremorsense: Number(data.senses?.tremorsense) || 0,
          truesight: Number(data.senses?.truesight) || 0,
          units: data.senses?.units || "ft",
          special: data.senses?.special ?? ""
        },
        type: {
          value: data.creatureType || "humanoid",
          subtype: "",
          swarm: "",
          custom: ""
        }
      }
    };

    const item = this.actor
      ? (await this.actor.createEmbeddedDocuments("Item", [itemData]))[0]
      : await Item.create(itemData);

    ui.notifications.info(game.i18n.format("KURUF.RaceCreator.Created", { name: item.name }));
    ui.notifications.info(game.i18n.localize("KURUF.RaceCreator.AdvancementHint"));
    item.sheet?.render(true);
  }
}
